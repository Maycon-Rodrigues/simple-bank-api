import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  payerId: string;

  @ApiProperty()
  payeeId: string;

  @ApiProperty({ type: Number, minimum: 1 })
  amount: number;
}
