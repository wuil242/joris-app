import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Quater from 'App/Models/Quater'
import { QuaterFactory } from 'Database/factories'

export default class QuaterSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    // await Quater.truncate()
    await QuaterFactory.createMany(5)
  }
}
