import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('lastname', 255).notNullable()
      table.string('firstname', 255).notNullable()
      table.string('tel', 255).unique().nullable()
      table.string('email', 255).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('confirmed', {useTz: true}).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
