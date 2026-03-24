import { Injectable, Logger } from '@nestjs/common';
import { IPaymentPort } from '../domain/payment.port';
import { Result, success, fail } from '../application/result';
import * as crypto from 'crypto';

// --- Interfaces para tipado estricto (Evita errores de Linter) ---

interface WompiMerchantResponse {
  data: {
    presigned_acceptance: { acceptance_token: string };
    presigned_personal_data_auth: { acceptance_token: string };
  };
}

interface WompiTransactionResponse {
  data: {
    id: string;
    status: string;
  };
  error?: {
    messages?: Record<string, string[]>;
  };
}

@Injectable()
export class WompiAdapter implements IPaymentPort {
  private readonly logger = new Logger(WompiAdapter.name);
  private readonly apiUrl =
    process.env.WOMPI_API_URL || 'https://sandbox.wompi.co/v1';
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY || '';
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY || '';
  private readonly integritySecret = process.env.WOMPI_INTEGRITY_SECRET || '';

  private async getAcceptanceTokens(): Promise<{
    acceptanceToken: string;
    personalAuthToken: string;
  }> {
    const response = await fetch(`${this.apiUrl}/merchants/${this.publicKey}`);

    if (!response.ok) {
      throw new Error(
        'No se pudieron obtener los tokens de aceptación del comercio',
      );
    }

    const data = (await response.json()) as WompiMerchantResponse;

    return {
      acceptanceToken: data.data.presigned_acceptance.acceptance_token,
      personalAuthToken:
        data.data.presigned_personal_data_auth.acceptance_token,
    };
  }

  private generateSignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const concatenatedString = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    return crypto.createHash('sha256').update(concatenatedString).digest('hex');
  }

  async charge(
    token: string,
    amountInCents: number,
    reference: string,
    customerEmail: string,
  ): Promise<Result<string>> {
    try {
      const legalTokens = await this.getAcceptanceTokens();
      const signature = this.generateSignature(reference, amountInCents, 'COP');

      const response = await fetch(`${this.apiUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.privateKey}`,
        },
        body: JSON.stringify({
          amount_in_cents: amountInCents,
          currency: 'COP',
          signature: signature,
          customer_email: customerEmail,
          payment_method: {
            type: 'CARD',
            installments: 1,
            token: token,
          },
          reference: reference,
          acceptance_token: legalTokens.acceptanceToken,
          accept_personal_auth: legalTokens.personalAuthToken,
        }),
      });

      const data = (await response.json()) as WompiTransactionResponse;

      if (!response.ok) {
        this.logger.error(`Wompi Error: ${JSON.stringify(data)}`);

        // Extraemos el primer mensaje de error de forma segura
        let errorMessage = 'Error al procesar el pago en Wompi';
        if (data.error?.messages) {
          const firstKey = Object.keys(data.error.messages)[0];
          errorMessage = data.error.messages[firstKey][0];
        }

        return fail(errorMessage);
      }

      if (data.data.status === 'APPROVED' || data.data.status === 'PENDING') {
        return success(data.data.id);
      } else {
        return fail(
          `Transacción fallida o declinada por el banco. Estado: ${data.data.status}`,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Failed to reach Wompi: ${errorMessage}`);
      return fail('Error de comunicación con la pasarela de pago');
    }
  }
}
