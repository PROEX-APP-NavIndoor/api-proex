import {MigrationInterface, QueryRunner} from "typeorm";

export class ForeignKeyAdjustment1669292241422 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE point_childs DROP CONSTRAINT "FKParentId";

            ALTER TABLE point_childs
                ADD CONSTRAINT "FKId" FOREIGN KEY (id) REFERENCES points(id) ON DELETE CASCADE ON UPDATE CASCADE;

            ALTER TABLE point_childs
                ADD CONSTRAINT "FKParentId" FOREIGN KEY (point_parent_id)
                REFERENCES points(id) ON DELETE CASCADE ON UPDATE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE point_childs DROP CONSTRAINT "FKId";

            ALTER TABLE point_childs DROP CONSTRAINT "FKParentId";

            ALTER TABLE point_childs
                ADD CONSTRAINT "FKParentId" FOREIGN KEY (point_parent_id)
                REFERENCES points (id) ON DELETE CASCADE ON UPDATE CASCADE;
        `)
    }

}
