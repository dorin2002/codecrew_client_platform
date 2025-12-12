import { IsString, IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalPoints?: number;

  @IsEnum(['BRONZE', 'SILVER', 'GOLD'])
  @IsOptional()
  sowLevel?: 'BRONZE' | 'SILVER' | 'GOLD';
}
