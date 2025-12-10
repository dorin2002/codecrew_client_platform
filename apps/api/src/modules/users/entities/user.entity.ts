import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { CoordinatorAssignment } from './coordinator-assignment.entity';
import { FileLink } from '../../files/entities/file-link.entity';
import { AuditLog } from './audit-log.entity';

export enum CcRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
}

export enum ClientRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: string;

  @ManyToOne(() => Organization, (org) => org.users)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({
    type: 'enum',
    enum: CcRole,
    name: 'cc_role',
    nullable: true,
  })
  ccRole: CcRole;

  @Column({
    type: 'enum',
    enum: ClientRole,
    name: 'client_role',
    nullable: true,
  })
  clientRole: ClientRole;

  @OneToMany(() => CoordinatorAssignment, (assignment) => assignment.user)
  coordinatorAssignments: CoordinatorAssignment[];

  @OneToMany(() => FileLink, (link) => link.createdBy)
  fileLinksCreated: FileLink[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
