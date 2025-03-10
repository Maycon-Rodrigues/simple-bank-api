import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseTransactionDto } from './dto/response-transaction-dto';
import { Client, Person } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<ResponseTransactionDto> {
    try {
      const payer = await this.prisma.client.findUnique({
        where: { id: createTransactionDto.payerId },
      });

      if (!payer) {
        throw new HttpException('Payer not found', HttpStatus.NOT_FOUND);
      }

      const payee = await this.prisma.client.findUnique({
        where: { id: createTransactionDto.payeeId },
      });

      if (!payee) {
        throw new HttpException('Payee not found', HttpStatus.NOT_FOUND);
      }

      this.validateTransaction(payer, payee, createTransactionDto.amount);

      const isApproved = await this.validateExternalService();

      if (!isApproved) {
        throw new HttpException(
          'Transaction denied by external service',
          HttpStatus.FORBIDDEN,
        );
      }
      const transaction = await this.prisma.$transaction(async (tx) => {
        await tx.client.update({
          where: { id: createTransactionDto.payerId },
          data: { balance: { decrement: createTransactionDto.amount } },
        });

        await tx.client.update({
          where: { id: createTransactionDto.payeeId },
          data: { balance: { increment: createTransactionDto.amount } },
        });

        return await tx.transaction.create({ data: createTransactionDto });
      });

      return ResponseTransactionDto.fromPrisma(transaction);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Error processing transaction',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseTransactionDto[]> {
    const transactions = await this.prisma.transaction.findMany();
    return transactions.map(
      (transaction: ResponseTransactionDto): ResponseTransactionDto =>
        ResponseTransactionDto.fromPrisma(transaction),
    );
  }

  async findOne(id: string): Promise<ResponseTransactionDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return ResponseTransactionDto.fromPrisma(transaction);
  }

  private async validateExternalService(): Promise<boolean> {
    try {
      const url = this.configService.get<string>('EXTERNAL_API_URL');
      const response = await lastValueFrom(this.httpService.get(url || ''));

      if (response.data.message === 'Authorized') {
        return true;
      }

      throw new HttpException('Transaction not approved', HttpStatus.FORBIDDEN);
    } catch (error: any) {
      throw new HttpException(
        'Error validating transaction',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private validateTransaction(payer: Client, payee: Client, amount: number) {
    if (amount < 0) {
      throw new HttpException(
        'Amount must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payer.balance < amount) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    if (payer.type === Person.BUSINESS) {
      throw new HttpException(
        'Payer must be a common client',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payer === payee) {
      throw new HttpException(
        'Payer and payee must be different',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
