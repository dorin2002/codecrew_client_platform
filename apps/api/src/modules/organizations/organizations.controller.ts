import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  PaginationParams,
  ApiResponse,
  Organization,
  PaginatedResponse
} from '@codecrew/shared';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<ApiResponse<PaginatedResponse<Organization>>> {
    const params: PaginationParams = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sortBy,
      sortOrder,
    };

    const result = await this.organizationsService.findAll(params);
    return { success: true, data: result };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<Organization>> {
    const org = await this.organizationsService.findOne(id);
    return { success: true, data: org };
  }

  @Post()
  async create(
    @Body() dto: CreateOrganizationDto,
  ): Promise<ApiResponse<Organization>> {
    const org = await this.organizationsService.create(dto);
    return { success: true, data: org };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<ApiResponse<Organization>> {
    const org = await this.organizationsService.update(id, dto);
    return { success: true, data: org };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.organizationsService.remove(id);
  }
}
