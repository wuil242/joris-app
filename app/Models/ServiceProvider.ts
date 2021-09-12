import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Adress from './Adress'
import Job from './Job'

export default class ServiceProvider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Adress)
  public adress: HasOne<typeof Adress>

  @manyToMany(() => Job)
  public jobs: ManyToMany<typeof Job>
}
