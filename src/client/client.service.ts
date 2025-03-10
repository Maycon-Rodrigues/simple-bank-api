import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseClientDto } from './dto/response-client.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto): Promise<ResponseClientDto> {
    try {
      const client = await this.prisma.client.create({ data: createClientDto });
      return ResponseClientDto.fromPrisma(client);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException('Error creating client', HttpStatus.BAD_REQUEST);
    }
  }

  async findSentTransactionByClient(id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        sentTransactions: {
          select: {
            payee: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    return client;
  }

  async findReceivTransactionByClient(id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        receivedTransactions: {
          select: {
            payer: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    return client;
  }

  async findAll(): Promise<ResponseClientDto[]> {
    const clients = await this.prisma.client.findMany({
      where: { isActive: true },
    });

    return clients.map(
      (client: Client): ResponseClientDto =>
        ResponseClientDto.fromPrisma(client),
    );
  }

  async findOne(id: string): Promise<ResponseClientDto> {
    const client = await this.prisma.client.findUnique({ where: { id: id } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return ResponseClientDto.fromPrisma(client);
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ResponseClientDto> {
    const client = await this.findOne(id);

    if (!updateClientDto.amount || updateClientDto.amount < 0) {
      throw new BadRequestException('Invalid amount');
    }

    client.balance += updateClientDto.amount;

    await this.prisma.client.update({
      where: { id: client.id },
      data: client,
    });

    return client;
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);

    client.isActive = false;

    await this.prisma.client.update({
      where: { id: client.id },
      data: client,
    });
  }
}
