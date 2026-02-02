'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Organization, CreateOrganizationDto, SowLevel } from '@codecrew/shared';

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: (data: CreateOrganizationDto) => Promise<void>;
  onCancel: () => void;
}

export function OrganizationForm({
  organization,
  onSubmit,
  onCancel,
}: OrganizationFormProps) {
  const [name, setName] = useState(organization?.name ?? '');
  const [sowLevel, setSowLevel] = useState<SowLevel>(organization?.sowLevel ?? 'BRONZE');
  const [totalPoints, setTotalPoints] = useState(organization?.totalPoints?.toString() ?? '0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name,
        sowLevel,
        totalPoints: parseInt(totalPoints, 10),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sowLevel">Service Tier</Label>
        <Select value={sowLevel} onValueChange={(v) => setSowLevel(v as SowLevel)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BRONZE">Bronze</SelectItem>
            <SelectItem value="SILVER">Silver</SelectItem>
            <SelectItem value="GOLD">Gold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalPoints">Total Points</Label>
        <Input
          id="totalPoints"
          type="number"
          min="0"
          value={totalPoints}
          onChange={(e) => setTotalPoints(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : organization ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
