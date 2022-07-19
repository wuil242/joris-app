import { DateTime } from 'luxon'
import {
  beforeFind,
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Address from './Address'
import Job from './Job'
import ServiceProviderRealisation from './ServiceProviderRealisation'
import ServiceProviderVote from './ServiceProviderVote'

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
  public tel: string

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
  public addressId: number

  @column()
  public facebook_link: string | null

  @column()
  public instagram_link: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Address, {
    onQuery: query => query.preload('city').preload('arrondissement').preload('quater'),
  })
  public address: BelongsTo<typeof Address>

  @manyToMany(() => Job, {
    pivotTable: 'service_providers_jobs_1',
    pivotRelatedForeignKey: 'jobs_id',
    pivotForeignKey: 'service_providers_id'
  })
  public jobs: ManyToMany<typeof Job>

  @hasMany(() => ServiceProviderRealisation)
  public realisations: HasMany<typeof ServiceProviderRealisation>

  @hasMany(() => ServiceProviderVote)
  public votes: HasMany<typeof ServiceProviderVote>

  public get fullname() { return this.lastname + ' ' + this.firstname }

  public get full_address() { 
      return this.address.numberAdress + ', rue ' +  this.address.street + ' ' + 
             this.address.arrondissement.name + ' ' + this.address.quater.name
  }

  public get note() {
    if(this.votes.length <= 0) {
      return 1
    }

    const average = this.votes.map(v => v.note).reduce((a, b) => a + b) / this.votes.length
    return average <= 0 ? 1 : (average > 5 ? 5 : average) 
  }
}
