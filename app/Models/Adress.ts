import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import City from './City'
import Arrondissement from './Arrondissement'
import Quater from './Quater'
import ServiceProvider from './ServiceProvider'

export default class Adress extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ServiceProvider)
  public serviceProvider: BelongsTo<typeof ServiceProvider>

  @hasOne(() => City)
  public city:HasOne<typeof City>

  @hasOne(() => Arrondissement)
  public arrondissent:HasOne<typeof Arrondissement>

  @hasOne(() => Quater)
  public quater:HasOne<typeof Quater>
}
