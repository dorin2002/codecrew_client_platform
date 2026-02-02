'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { useDashboardStats, useRecentOrganizations } from '@/lib/hooks/use-stats';
import Link from 'next/link';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function getSowLevelColor(level: string) {
  switch (level) {
    case 'GOLD':
      return 'bg-yellow-100 text-yellow-800';
    case 'SILVER':
      return 'bg-gray-100 text-gray-800';
    case 'BRONZE':
    default:
      return 'bg-orange-100 text-orange-800';
  }
}

export default function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { organizations, loading: orgsLoading } = useRecentOrganizations(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to CodeCrew Portal. Here's an overview of your system.
        </p>
      </div>

      {statsError && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          Failed to load stats: {statsError.message}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Organizations"
          value={stats?.totalOrganizations ?? 0}
          description="Active organizations in the system"
          icon={Building2}
          loading={statsLoading}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          description="Registered users across all organizations"
          icon={Users}
          loading={statsLoading}
        />
        <StatCard
          title="Open Requests"
          value={stats?.openRequests ?? 0}
          description="Pending requests awaiting review"
          icon={FileText}
          loading={statsLoading}
        />
        <StatCard
          title="Total Points"
          value={stats?.totalPoints ?? 0}
          description="Points allocated across organizations"
          icon={TrendingUp}
          loading={statsLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            {orgsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No organizations yet.{' '}
                <Link href="/organizations" className="text-primary hover:underline">
                  Create your first organization
                </Link>{' '}
                to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {organizations.map((org) => (
                  <Link
                    key={org.id}
                    href={`/organizations/${org.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getSowLevelColor(org.sowLevel)}`}
                    >
                      {org.sowLevel}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
