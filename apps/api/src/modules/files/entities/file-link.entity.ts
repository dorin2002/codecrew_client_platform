import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';

export enum FileLinkType {
  GOOGLE_DRIVE = 'GOOGLE_DRIVE',
  FIGMA = 'FIGMA',
  OTHER = 'OTHER',
}

@Entity('file_links')
export class FileLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization, (org) => org.fileLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: FileLinkType,
    name: 'link_type',
  })
  linkType: FileLinkType;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: string;

  @ManyToOne(() => User, (user) => user.fileLinksCreated, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
