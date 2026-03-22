import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import {
  CreateTransactionUseCase,
  type CreateTransactionDto,
} from '../application/create-transaction.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTransactionDto) {
    const result = await this.createTransactionUseCase.execute(body);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}
