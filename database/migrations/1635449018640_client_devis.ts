import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClientDevis extends BaseSchema {
  protected tableName = 'client_devis'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').nullable().unsigned()
      table.string('lastname', 255).nullable()
      table.string('firstname', 255).nullable()
      table.integer('service_provider_id').references('service_providers.id').unsigned().notNullable()
      table.string('message').notNullable()
      // table.date('due_date').notNullable()
      table.string('email', 255).nullable()
      table.string('tel', 14).notNullable()
      table.string('tel2', 14).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
