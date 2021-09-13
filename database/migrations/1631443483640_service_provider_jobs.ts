import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServiceProviderJobs extends BaseSchema {
  protected tableName = 'service_provider_jobs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('service_provider_id')
        .references('service_providers.id')
        .unsigned()
        .notNullable()
        .onDelete('CASCADE')
      table.integer('job_id').references('jobs.id').unsigned().notNullable().onDelete('CASCADE')
      table.unique(['service_provider_id', 'job_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
