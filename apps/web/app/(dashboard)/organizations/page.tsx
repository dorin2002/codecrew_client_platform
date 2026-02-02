'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { OrganizationsTable } from '@/components/features/organizations/organizations-table';
import { OrganizationForm } from '@/components/features/organizations/organization-form';
import { useOrganizations } from '@/lib/hooks/use-organizations';
import { organizationsApi } from '@/lib/api/organizations';
import type { Organization, CreateOrganizationDto } from '@codecrew/shared';
import { toast } from 'sonner';

export default function OrganizationsPage() {
  const { organizations, pagination, isLoading, error, refetch, setPage } = useOrganizations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | undefined>();
  const [deleteOrg, setDeleteOrg] = useState<Organization | null>(null);

  const handleCreate = () => {
    setSelectedOrg(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setSelectedOrg(org);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: CreateOrganizationDto) => {
    if (selectedOrg) {
      await organizationsApi.update(selectedOrg.id, data);
      toast.success('Organization updated successfully');
    } else {
      await organizationsApi.create(data);
      toast.success('Organization created successfully');
    }
    setIsFormOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteOrg) return;

    try {
      await organizationsApi.delete(deleteOrg.id);
      toast.success('Organization deleted successfully');
      setDeleteOrg(null);
      refetch();
    } catch (err) {
      toast.error('Failed to delete organization');
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organizations and their settings.
          </p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organizations and their settings.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationsTable
            organizations={organizations}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={setDeleteOrg}
          />

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {organizations.length} of {pagination.total} organizations
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOrg ? 'Edit Organization' : 'Create Organization'}
            </DialogTitle>
          </DialogHeader>
          <OrganizationForm
            organization={selectedOrg}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteOrg} onOpenChange={() => setDeleteOrg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate {deleteOrg?.name}. This action can be undone by an administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
