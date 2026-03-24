import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import {
  CreateTransactionUseCase,
  CreateTransactionDto,
} from '../application/create-transaction.use-case';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction completed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or payment rejected.',
  })
  async create(@Body() body: CreateTransactionDto) {
    const result = await this.createTransactionUseCase.execute(body);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}
