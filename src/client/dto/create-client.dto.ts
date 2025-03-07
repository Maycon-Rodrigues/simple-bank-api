import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ minimum: 11, maximum: 16 })
  document: string;

  @ApiProperty({ enum: ['COMMON', 'BUSINESS'], default: 'COMMON' })
  type: Person;

  @ApiProperty({ type: Number })
  balance: number;
}

export enum Person {
  COMMON = 'COMMON',
  BUSINESS = 'BUSINESS',
}
