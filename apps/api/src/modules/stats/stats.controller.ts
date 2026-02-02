import { Controller, Get, Query } from '@nestjs/common';
import { StatsService, DashboardStats, RecentOrganization } from './stats.service';
import { ApiResponse } from '@codecrew/shared';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const data = await this.statsService.getDashboardStats();
    return { success: true, data };
  }

  @Get('recent-organizations')
  async getRecentOrganizations(
    @Query('limit') limit?: string,
  ): Promise<ApiResponse<RecentOrganization[]>> {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    const data = await this.statsService.getRecentOrganizations(parsedLimit);
    return { success: true, data };
  }
}
