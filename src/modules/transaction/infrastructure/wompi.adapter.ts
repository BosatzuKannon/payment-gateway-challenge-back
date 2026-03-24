import { Injectable, Logger } from '@nestjs/common';
import { IPaymentPort } from '../domain/payment.port';
import { Result, success, fail } from '../application/result';
import * as crypto from 'crypto'; // <-- 1. Importamos la librería criptográfica nativa de Node

@Injectable()
export class WompiAdapter implements IPaymentPort {
  private readonly logger = new Logger(WompiAdapter.name);
  private readonly apiUrl = process.env.WOMPI_API_URL || 'https://sandbox.wompi.co/v1';
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY || '';
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY || '';
  private readonly integritySecret = process.env.WOMPI_INTEGRITY_SECRET || ''; // <-- 2. Traemos el secreto

  private async getAcceptanceTokens(): Promise<{ acceptanceToken: string, personalAuthToken: string }> {
    const response = await fetch(`${this.apiUrl}/merchants/${this.publicKey}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('No se pudieron obtener los tokens de aceptación del comercio');
    }

    return {
      acceptanceToken: data.data.presigned_acceptance.acceptance_token,
      personalAuthToken: data.data.presigned_personal_data_auth.acceptance_token,
    };
  }

  // 3. Función matemática que exige Wompi para asegurar que nadie altere el precio
  private generateSignature(reference: string, amountInCents: number, currency: string): string {
    const concatenatedString = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    return crypto.createHash('sha256').update(concatenatedString).digest('hex');
  }

  async charge(token: string, amountInCents: number, reference: string, customerEmail: string): Promise<Result<string>> {
    try {
      const legalTokens = await this.getAcceptanceTokens();
      
      // 4. Generamos la firma de integridad justo antes de disparar el cobro
      const signature = this.generateSignature(reference, amountInCents, 'COP');

      const response = await fetch(`${this.apiUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.privateKey}`,
        },
        body: JSON.stringify({
          amount_in_cents: amountInCents,
          currency: 'COP',
          signature: signature, // <-- 5. La enviamos en el payload
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

      const data = await response.json();

      if (!response.ok) {
        this.logger.error(`Wompi Error: ${JSON.stringify(data)}`);
        return fail(data.error?.messages?.[0] || 'Error al procesar el pago en Wompi');
      }

      if (data.data.status === 'APPROVED' || data.data.status === 'PENDING') {
        return success(data.data.id);
      } else {
        return fail(`Transacción fallida o declinada por el banco. Estado: ${data.data.status}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Failed to reach Wompi: ${errorMessage}`);
      return fail('Error de comunicación con la pasarela de pago');
    }
  }
}