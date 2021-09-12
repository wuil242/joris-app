import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Arrondissement from './Arrondissement'
import City from './City'

export default class Quater extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public cityId: number
  
  @column()
  public arrondissementId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Arrondissement)
  public arrondissement: BelongsTo<typeof Arrondissement>

  @belongsTo(() => City)
  public city: BelongsTo<typeof City>
}
