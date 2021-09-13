import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Adress from './Adress'
import Job from './Job'
import ServiceProviderRealisation from './ServiceProviderRealisation'


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
  public introduceVideo?: string

  @column()
  public sexe: SEXE

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Adress)
  public adress: HasOne<typeof Adress>

  @manyToMany(() => Job, {
    pivotTable: 'service_provider_jobs'
  })
  public jobs: ManyToMany<typeof Job>

  @hasMany(() => ServiceProviderRealisation)
  public realisations: HasMany<typeof ServiceProviderRealisation>
}
