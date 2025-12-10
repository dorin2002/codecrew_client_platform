import AppDataSource from '../data-source';
import { User, CcRole, ClientRole } from '../../modules/users/entities/user.entity';
import { Organization, SowLevel } from '../../modules/organizations/entities/organization.entity';
import { CoordinatorAssignment } from '../../modules/users/entities/coordinator-assignment.entity';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const orgRepo = AppDataSource.getRepository(Organization);
  const assignmentRepo = AppDataSource.getRepository(CoordinatorAssignment);

  // Create CC Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  let ccAdmin = await userRepo.findOne({ where: { email: 'admin@codecrew.com' } });

  if (!ccAdmin) {
    ccAdmin = userRepo.create({
      email: 'admin@codecrew.com',
      passwordHash: adminPassword,
      name: 'CC Admin',
      ccRole: CcRole.ADMIN,
    });
    await userRepo.save(ccAdmin);
    console.log('✅ Created CC Admin');
  }

  // Create CC Coordinator
  const coordPassword = await bcrypt.hash('coord123', 10);
  let ccCoord = await userRepo.findOne({ where: { email: 'coordinator@codecrew.com' } });

  if (!ccCoord) {
    ccCoord = userRepo.create({
      email: 'coordinator@codecrew.com',
      passwordHash: coordPassword,
      name: 'CC Coordinator',
      ccRole: CcRole.COORDINATOR,
    });
    await userRepo.save(ccCoord);
    console.log('✅ Created CC Coordinator');
  }

  // Create test organization
  let testOrg = await orgRepo.findOne({ where: { slug: 'acme-corp' } });

  if (!testOrg) {
    testOrg = orgRepo.create({
      name: 'Acme Corporation',
      slug: slugify('Acme Corporation', { lower: true, strict: true }),
      totalPoints: 100,
      usedPoints: 25,
      sowLevel: SowLevel.GOLD,
    });
    await orgRepo.save(testOrg);
    console.log('✅ Created Acme Corporation');
  }

  // Assign coordinator to org
  const existingAssignment = await assignmentRepo.findOne({
    where: {
      userId: ccCoord.id,
      organizationId: testOrg.id,
    },
  });

  if (!existingAssignment) {
    const assignment = assignmentRepo.create({
      userId: ccCoord.id,
      organizationId: testOrg.id,
    });
    await assignmentRepo.save(assignment);
    console.log('✅ Assigned coordinator to Acme Corp');
  }

  // Create client admin
  const clientAdminPassword = await bcrypt.hash('client123', 10);
  let clientAdmin = await userRepo.findOne({ where: { email: 'admin@acme.com' } });

  if (!clientAdmin) {
    clientAdmin = userRepo.create({
      email: 'admin@acme.com',
      passwordHash: clientAdminPassword,
      name: 'Acme Admin',
      clientRole: ClientRole.ADMIN,
      organizationId: testOrg.id,
    });
    await userRepo.save(clientAdmin);
    console.log('✅ Created Acme Admin user');
  }

  console.log('\n🎉 Seed completed successfully!\n');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
