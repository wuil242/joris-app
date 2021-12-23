import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Adress from './Adress'
import Job from './Job'
import ServiceProviderRealisation from './ServiceProviderRealisation'
import {attachment, AttachmentContract} from '@ioc:Adonis/Addons/AttachmentLite'

export default class ServiceProvider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public lastname: string

  @column()
  public firstname: string

  @column()
  public age: number

  @column()
  public tel: String

  @column()
  public secureTel: string

  @column()
  public email: string

  @column()
  public photo?: string

  @column()
  public description: string

  @column()
  public accrochSentence?: string

  @column()
  public gender: string

  @column()
  public address_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Adress, {
    foreignKey: 'address_id',
    onQuery: query => query.preload('city').preload('arrondissement').preload('quater'),
  })
  public address: BelongsTo<typeof Adress>

  @manyToMany(() => Job, {
    pivotTable: 'service_providers_jobs',
    pivotRelatedForeignKey: 'jobs_id',
    pivotForeignKey: 'service_providers_id'
  })
  public jobs: ManyToMany<typeof Job>

  @hasMany(() => ServiceProviderRealisation)
  public realisations: HasMany<typeof ServiceProviderRealisation>
}
