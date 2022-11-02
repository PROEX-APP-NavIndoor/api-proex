import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class NewPointModelTables1666033578357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'point_parents',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'type',
                        type: 'varchar'
                    },
                    {
                        name: 'neighbor',
                        type: 'varchar'
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FKId',
                        referencedTableName: 'points',
                        referencedColumnNames: ['id'],
                        columnNames: ['id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    }
                ]
            })
        )

        await queryRunner.createTable(
            new Table({
                name: 'point_childs',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'point_parent_id',
                        type: 'uuid'
                    },
                    {
                        name: 'is_obstacle',
                        type: 'boolean'
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FKParentId',
                        referencedTableName: 'points',
                        referencedColumnNames: ['id'],
                        columnNames: ['point_parent_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    }
                ]
            })
        )

        await queryRunner.query(`
            INSERT INTO point_parents (
                id,
                type,
                neighbor
            )
            SELECT
                p.id,
                'COMMON',
                p.neighbor
            FROM points p

        `)

        await queryRunner.query(`
        ALTER TABLE points
        DROP COLUMN "breakPoint",
        DROP COLUMN neighbor`
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const queryBuilder = queryRunner.manager.createQueryBuilder();

        queryRunner.query(`ALTER TABLE IF EXISTS public.points ADD COLUMN IF NOT EXISTS neighbor VARCHAR(255);`);
        queryRunner.query(`ALTER TABLE IF EXISTS public.points ADD COLUMN IF NOT EXISTS "breakPoint" boolean DEFAULT false;`);
        queryRunner.query(`
            UPDATE points
            SET
                neighbor = point_parents.neighbor
            FROM point_parents
            WHERE
                points.id = point_parents.id
        `)

        await queryRunner.dropTable('point_parents');
        await queryRunner.dropTable('point_childs');
    }

}
