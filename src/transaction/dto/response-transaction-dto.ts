import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';

export class ResponseTransactionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  payerId: string;

  @ApiProperty()
  payeeId: string;

  @ApiProperty({ type: Number, minimum: 1 })
  amount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromPrisma(transaction: Transaction): ResponseTransactionDto {
    return {
      id: transaction.id,
      payerId: transaction.payerId,
      payeeId: transaction.payeeId,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
