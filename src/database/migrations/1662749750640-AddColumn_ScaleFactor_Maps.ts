import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnScaleFactorMaps1662749750640 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE IF EXISTS public.maps ADD COLUMN scale_factor real;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE IF EXISTS public.maps DROP COLUMN scale_factor;`);
    }

}
