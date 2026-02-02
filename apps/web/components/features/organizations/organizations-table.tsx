'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import type { Organization } from '@codecrew/shared';

interface OrganizationsTableProps {
  organizations: Organization[];
  isLoading: boolean;
  onEdit: (org: Organization) => void;
  onDelete: (org: Organization) => void;
}

const sowLevelColors: Record<string, string> = {
  GOLD: 'bg-yellow-500',
  SILVER: 'bg-gray-400',
  BRONZE: 'bg-amber-700',
};

export function OrganizationsTable({
  organizations,
  isLoading,
  onEdit,
  onDelete,
}: OrganizationsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No organizations found. Create your first one!
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead className="text-right">Points</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell className="text-gray-500">{org.slug}</TableCell>
            <TableCell>
              <Badge className={sowLevelColors[org.sowLevel]}>
                {org.sowLevel}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {org.totalPoints - org.usedPoints} / {org.totalPoints}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(org)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(org)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
