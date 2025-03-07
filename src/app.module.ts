import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './client/client.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [PrismaModule, ClientModule, TransactionModule],
})
export class AppModule {}
