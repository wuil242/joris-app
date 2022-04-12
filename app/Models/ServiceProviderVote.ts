import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import ServiceProvider from './ServiceProvider'
import User from './User'

export default class ServiceProviderVote extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public note: number

  @column()
  public userId: number

  @column()
  public serviceProviderId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
