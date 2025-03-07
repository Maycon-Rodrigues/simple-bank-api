import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ResponseClientDto } from './dto/response-client.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ResponseClientDto,
  })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({
    status: 200,
    description: 'Return all clients.',
    type: ResponseClientDto,
  })
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'The record has been found.',
    type: ResponseClientDto,
  })
  @ApiResponse({ status: 404, description: 'Record not found' })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(':id/deposit')
  @ApiOperation({ summary: 'Deposit money to a client' })
  @ApiResponse({
    status: 200,
    description: 'Client balance has been updated.',
    type: ResponseClientDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a client' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Record not found' })
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
