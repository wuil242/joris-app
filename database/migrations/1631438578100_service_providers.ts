import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServiceProviders extends BaseSchema {
  protected tableName = 'service_providers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('lastname', 255).notNullable()
      table.string('firstname', 255).notNullable()
      table.integer('age', 65).unsigned().notNullable()
      table.string('tel', 14).unique().notNullable()
      table.string('secure_tel', 14).unique().notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('photo', 255).defaultTo('/assets/avatar_service_provider.png').notNullable()
      table.string('description', 255).notNullable()
      table.integer('score').unsigned().defaultTo(10).notNullable()
      table.enum('sexe', ['m', 'f']).notNullable()
      table.string('accroch_sentence', 255).nullable()
      table.string('introduce_video', 255).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('subscription', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
