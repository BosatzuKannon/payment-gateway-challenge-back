import { TransactionController } from './transaction.controller';
import { BadRequestException } from '@nestjs/common';

jest.mock('uuid', () => ({
  v4: () => '1234-5678-9012',
}));

describe('TransactionController', () => {
  let controller: TransactionController;
  let useCase: any;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new TransactionController(useCase);
  });

  it('should throw BadRequestException when result is failure', async () => {
    useCase.execute.mockResolvedValue({
      success: false,
      error: 'Error de prueba',
    });

    await expect(controller.create({} as any)).rejects.toThrow(
      BadRequestException,
    );
  });
});
