import { WompiAdapter } from './wompi.adapter';
import { Logger } from '@nestjs/common';

describe('WompiAdapter', () => {
  let adapter: WompiAdapter;

  beforeEach(() => {
    // Seteamos variables de entorno temporales para el test
    process.env.WOMPI_PUBLIC_KEY = 'pub_test_123';
    process.env.WOMPI_INTEGRITY_SECRET = 'secret_123';
    adapter = new WompiAdapter();

    // Mock de fetch global (Node 18+)
    global.fetch = jest.fn();
  });

  it('should generate a valid SHA256 signature', () => {
    // Accedemos al método privado para testear la seguridad
    const signature = (adapter as any).generateSignature(
      'REF_001',
      150000,
      'COP',
    );
    expect(signature).toBeDefined();
    expect(signature.length).toBe(64); // Longitud de SHA256
  });

  it('should return success when Wompi approves the transaction', async () => {
    // Mock de la respuesta de Merchant (tokens)
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            presigned_acceptance: { acceptance_token: 'acc_1' },
            presigned_personal_data_auth: { acceptance_token: 'per_1' },
          },
        }),
      })
      // Mock de la respuesta de Transacción
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { id: 'wompi_tx_999', status: 'APPROVED' },
        }),
      });

    const result = await adapter.charge(
      'tok_123',
      100000,
      'REF_1',
      'test@test.com',
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe('wompi_tx_999');
    }
  });

  it('should return fail when communication fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await adapter.charge('tok_1', 100, 'R', 'e@e.com');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Error de comunicación');
    }
  });
});
