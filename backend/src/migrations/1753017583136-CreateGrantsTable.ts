import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGrantsTable1753017583136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'grants',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'report_instance_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'token_limit',
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: 'access_token',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['report_instance_id'],
            referencedTableName: 'report_instances',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('grants');
  }
}
