import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Quater from './Quater'
import City from './City'

export default class Arrondissement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @belongsTo(() => City)
  public city: BelongsTo<typeof City>

  @hasMany(() => Quater)
  public quaters: HasMany<typeof Quater>
}
