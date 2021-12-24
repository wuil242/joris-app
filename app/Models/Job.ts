import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import ServiceProvider from './ServiceProvider'

export default class Job extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public color: string

  @column()
  public bgColor?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => ServiceProvider, {
    
    pivotTable: 'service_providers_jobs',
    pivotRelatedForeignKey: 'service_providers_id',
    pivotForeignKey: 'jobs_id'
  })
  public serviceProviders: ManyToMany<typeof ServiceProvider>
}
