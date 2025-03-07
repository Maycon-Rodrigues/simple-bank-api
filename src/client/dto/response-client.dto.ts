import { ApiProperty } from '@nestjs/swagger';
import { Client } from '@prisma/client';

export class ResponseClientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ['COMMON', 'BUSINESS'], default: 'COMMON' })
  type: Person;

  @ApiProperty({ type: Number })
  balance: number;

  @ApiProperty({ type: Boolean, default: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromPrisma(client: Client): ResponseClientDto {
    return {
      id: client.id,
      name: client.name,
      type: client.type as Person,
      balance: Number(client.balance),
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}

export enum Person {
  COMMON = 'COMMON',
  BUSINESS = 'BUSINESS',
}
