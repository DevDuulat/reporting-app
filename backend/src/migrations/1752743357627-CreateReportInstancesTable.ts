import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReportInstancesTable1752743357627
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report_instances',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'report_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'summary',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'day',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'tags',
            type: 'varchar',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'minio_id',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['report_id'],
            referencedTableName: 'reports',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report_instances');
  }
}
