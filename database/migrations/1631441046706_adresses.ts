import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Adresses extends BaseSchema {
  protected tableName = 'adresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('number_adress').notNullable()
      table.string('street', 255).notNullable()
      table
        .integer('service_provider_id')
        .unique()
        .unsigned()
        .references('service_providers.id')
        .onDelete('CASCADE')
      table.integer('city_id').unsigned().references('cities.id')
      table.integer('arrondissement_id').unsigned().references('arrondissements.id')
      table.integer('quater_id').unsigned().references('quaters.id')

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
