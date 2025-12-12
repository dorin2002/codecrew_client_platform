import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CalendarLink } from '../../calendar/entities/calendar-link.entity';
import { FileLink } from '../../files/entities/file-link.entity';
import { CoordinatorAssignment } from '../../users/entities/coordinator-assignment.entity';

export enum SowLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
}

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'total_points', default: 0 })
  totalPoints: number;
  
  @Column({ name: 'used_points', default: 0 })
  usedPoints: number;

  @Column({
    type: 'enum',
    enum: SowLevel,
    name: 'sow_level',
    default: SowLevel.BRONZE,
  })
  sowLevel: SowLevel;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => CalendarLink, (link) => link.organization)
  calendarLinks: CalendarLink[];

  @OneToMany(() => FileLink, (link) => link.organization)
  fileLinks: FileLink[];

  @OneToMany(() => CoordinatorAssignment, (assignment) => assignment.organization)
  coordinatorAssignments: CoordinatorAssignment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
