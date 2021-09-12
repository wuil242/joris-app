import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Arrondissement from './Arrondissement'
import Quater from './Quater'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Arrondissement)
  public arrondissents: HasMany<typeof Arrondissement>

  @hasMany(() => Quater)
  public quaters: HasMany<typeof Quater>
}
