import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1765314260345 implements MigrationInterface {
    name = 'InitialSchema1765314260345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calendar_links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_id" uuid NOT NULL, "name" character varying NOT NULL, "google_sheet_id" character varying NOT NULL, "google_sheet_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a01cdd1bb80468b37810f29f6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."file_links_link_type_enum" AS ENUM('GOOGLE_DRIVE', 'FIGMA', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "file_links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_id" uuid NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "link_type" "public"."file_links_link_type_enum" NOT NULL, "description" character varying, "created_by_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6808e16bdb1613f8b6d7d0bbd7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."organizations_sow_level_enum" AS ENUM('BRONZE', 'SILVER', 'GOLD')`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "total_points" integer NOT NULL DEFAULT '0', "used_points" integer NOT NULL DEFAULT '0', "sow_level" "public"."organizations_sow_level_enum" NOT NULL DEFAULT 'BRONZE', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "action" character varying NOT NULL, "entity_type" character varying NOT NULL, "entity_id" character varying, "details" jsonb, "ip_address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2cd10fda8276bb995288acfbfb" ON "audit_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_7421efc125d95e413657efa3c6" ON "audit_logs" ("entity_type", "entity_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_cc_role_enum" AS ENUM('ADMIN', 'COORDINATOR')`);
        await queryRunner.query(`CREATE TYPE "public"."users_client_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "organization_id" uuid, "cc_role" "public"."users_cc_role_enum", "client_role" "public"."users_client_role_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coordinator_assignments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "organization_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_303cf4cc2696839ef3c8d1ecb66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d72df8db9327ad96fc407c3094" ON "coordinator_assignments" ("user_id", "organization_id") `);
        await queryRunner.query(`ALTER TABLE "calendar_links" ADD CONSTRAINT "FK_7ae0289ee4e6c567671dba6688b" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_links" ADD CONSTRAINT "FK_9a66c0a189d81943d83a0d270bc" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_links" ADD CONSTRAINT "FK_909b8e00632d4ae951522c4348c" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_21a659804ed7bf61eb91688dea7" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_assignments" ADD CONSTRAINT "FK_7587c971746d01cabe171451451" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_assignments" ADD CONSTRAINT "FK_a7a79c540385e538144967a5b0d" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_assignments" DROP CONSTRAINT "FK_a7a79c540385e538144967a5b0d"`);
        await queryRunner.query(`ALTER TABLE "coordinator_assignments" DROP CONSTRAINT "FK_7587c971746d01cabe171451451"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_21a659804ed7bf61eb91688dea7"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0"`);
        await queryRunner.query(`ALTER TABLE "file_links" DROP CONSTRAINT "FK_909b8e00632d4ae951522c4348c"`);
        await queryRunner.query(`ALTER TABLE "file_links" DROP CONSTRAINT "FK_9a66c0a189d81943d83a0d270bc"`);
        await queryRunner.query(`ALTER TABLE "calendar_links" DROP CONSTRAINT "FK_7ae0289ee4e6c567671dba6688b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d72df8db9327ad96fc407c3094"`);
        await queryRunner.query(`DROP TABLE "coordinator_assignments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_client_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_cc_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7421efc125d95e413657efa3c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2cd10fda8276bb995288acfbfb"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TYPE "public"."organizations_sow_level_enum"`);
        await queryRunner.query(`DROP TABLE "file_links"`);
        await queryRunner.query(`DROP TYPE "public"."file_links_link_type_enum"`);
        await queryRunner.query(`DROP TABLE "calendar_links"`);
    }

}
