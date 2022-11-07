import { MigrationInterface, QueryRunner } from "typeorm";

export class LowerCaseEnumTypes1667861953994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {      
        await queryRunner.query(`
            BEGIN TRANSACTION;

            ALTER TABLE users
                ALTER COLUMN role TYPE VARCHAR(255);
            
            UPDATE users SET role =
            CASE
                WHEN role = 'SUPER' THEN 'super'
                WHEN role = 'EMPLOYEE' THEN 'employee'
                WHEN role = 'NORMAL' THEN 'normal'
                ELSE role
            END;

            DROP TYPE users_role_enum;

            CREATE TYPE users_role_enum AS ENUM('super', 'employee', 'normal');

            ALTER TABLE users
            ALTER COLUMN role TYPE users_role_enum
                USING(role::text::users_role_enum);

            ALTER TABLE point_parents
                ALTER COLUMN type TYPE VARCHAR(255);
            
            UPDATE point_parents SET type =
            CASE
                WHEN type = 'COMMON' THEN 'common'
                WHEN type = 'ENTRANCE' THEN 'entrance'
                WHEN type = 'PASSAGE' THEN 'passage'
                ELSE type
            END;

            CREATE TYPE points_type_enum AS ENUM('common', 'entrance', 'passage');

            ALTER TABLE point_parents
            ALTER COLUMN type TYPE points_type_enum
                USING(type::text::points_type_enum);

            COMMIT;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        BEGIN TRANSACTION;

        ALTER TABLE users
                ALTER COLUMN role TYPE VARCHAR(255);

        UPDATE users SET role = CASE
            WHEN role = 'super' THEN 'SUPER'
            WHEN role = 'employee' THEN 'EMPLOYEE'
            WHEN role = 'normal' THEN 'NORMAL'
            ELSE role
        END;

        DROP TYPE users_role_enum;

        CREATE TYPE users_role_enum AS ENUM('SUPER', 'EMPLOYEE', 'NORMAL');

        ALTER TABLE users
            ALTER COLUMN role TYPE users_role_enum
                USING(role::text::users_role_enum);

        ALTER TABLE point_parents
            ALTER COLUMN type TYPE VARCHAR(255);

        UPDATE point_parents SET type =
            CASE
                WHEN type = 'common' THEN 'COMMON'
                WHEN type = 'entrance' THEN 'ENTRANCE'
                WHEN type = 'passage' THEN 'PASSAGE'
                ELSE type
            END;

        DROP TYPE points_type_enum;
        
        COMMIT;
    `)
    }

}
