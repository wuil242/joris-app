import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import City from './City'
import Arrondissement from './Arrondissement'
import ServiceProvider from './ServiceProvider'
import Quater from './Quater'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public numberAdress: number

  @column()
  public street: string

  @column()
  public serviceProviderId: number

  @column()
  public cityId: number

  @column()
  public arrondissementId: number

  @column()
  public quaterId?: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ServiceProvider)
  public serviceProvider: BelongsTo<typeof ServiceProvider>

  @belongsTo(() => City)
  public city: BelongsTo<typeof City>

  @belongsTo(() => Arrondissement)
  public arrondissement: BelongsTo<typeof Arrondissement>

  @belongsTo(() => Quater)
  public quater: BelongsTo<typeof Quater>

  public get full(): string {
    return `${this?.numberAdress} rue ${this?.street}, ${this?.arrondissement.name} ${this?.quater?.name}`
  }
}
