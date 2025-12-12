import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { CreateOrganizationDto } from './create-organization.dto';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @IsInt()
  @Min(0)
  @IsOptional()
  usedPoints?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
