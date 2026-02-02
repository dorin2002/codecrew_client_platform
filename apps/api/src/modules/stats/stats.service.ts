import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';

export interface DashboardStats {
  totalOrganizations: number;
  totalUsers: number;
  openRequests: number;
  totalPoints: number;
  usedPoints: number;
}

export interface RecentOrganization {
  id: string;
  name: string;
  slug: string;
  sowLevel: string;
  createdAt: string;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [totalOrganizations, totalUsers, pointsResult] = await Promise.all([
      this.organizationRepository.count({ where: { isActive: true } }),
      this.userRepository.count({ where: { isActive: true } }),
      this.organizationRepository
        .createQueryBuilder('org')
        .select('SUM(org.totalPoints)', 'totalPoints')
        .addSelect('SUM(org.usedPoints)', 'usedPoints')
        .where('org.isActive = :isActive', { isActive: true })
        .getRawOne(),
    ]);

    return {
      totalOrganizations,
      totalUsers,
      openRequests: 0, // Placeholder - will implement when requests module is created
      totalPoints: parseInt(pointsResult?.totalPoints || '0', 10),
      usedPoints: parseInt(pointsResult?.usedPoints || '0', 10),
    };
  }

  async getRecentOrganizations(limit: number = 5): Promise<RecentOrganization[]> {
    const organizations = await this.organizationRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      sowLevel: org.sowLevel,
      createdAt: org.createdAt.toISOString(),
    }));
  }
}
