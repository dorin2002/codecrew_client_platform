import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, SowLevel } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  PaginationParams,
  PaginatedResponse,
  Organization as OrganizationType
} from '@codecrew/shared';
import slugify from 'slugify';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async findAll(params: PaginationParams): Promise<PaginatedResponse<OrganizationType>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await this.organizationRepository.findAndCount({
      where: { isActive: true },
      skip,
      take: limit,
      order: { [sortBy]: sortOrder.toUpperCase() },
    });

    return {
      data: data.map(this.mapToDto),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<OrganizationType> {
    const org = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return this.mapToDto(org);
  }

  async findBySlug(slug: string): Promise<OrganizationType> {
    const org = await this.organizationRepository.findOne({
      where: { slug },
    });

    if (!org) {
      throw new NotFoundException(`Organization with slug ${slug} not found`);
    }

    return this.mapToDto(org);
  }

  async create(dto: CreateOrganizationDto): Promise<OrganizationType> {
    const slug = dto.slug || slugify(dto.name, { lower: true, strict: true });

    // Check for existing slug
    const existing = await this.organizationRepository.findOne({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException(`Organization with slug "${slug}" already exists`);
    }

    const org = this.organizationRepository.create({
      name: dto.name,
      slug,
      totalPoints: dto.totalPoints ?? 0,
      sowLevel: (dto.sowLevel as SowLevel) ?? SowLevel.BRONZE,
    });

    const saved = await this.organizationRepository.save(org);
    return this.mapToDto(saved);
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<OrganizationType> {
    // Verify exists
    await this.findOne(id);

    // If updating slug, check for conflicts
    if (dto.slug) {
      const existing = await this.organizationRepository.findOne({
        where: { slug: dto.slug },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(`Slug "${dto.slug}" already in use`);
      }
    }

    // Build update object with proper typing
    const updateData: Partial<Organization> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.totalPoints !== undefined) updateData.totalPoints = dto.totalPoints;
    if (dto.usedPoints !== undefined) updateData.usedPoints = dto.usedPoints;
    if (dto.sowLevel !== undefined) updateData.sowLevel = dto.sowLevel as SowLevel;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    await this.organizationRepository.update(id, updateData);

    const updated = await this.organizationRepository.findOne({
      where: { id },
    });

    return this.mapToDto(updated!);
  }

  async remove(id: string): Promise<void> {
    // Verify exists
    await this.findOne(id);

    // Soft delete
    await this.organizationRepository.update(id, { isActive: false });
  }

  private mapToDto(org: Organization): OrganizationType {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      totalPoints: org.totalPoints,
      usedPoints: org.usedPoints,
      sowLevel: org.sowLevel,
      isActive: org.isActive,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    };
  }
}
