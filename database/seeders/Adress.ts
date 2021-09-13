import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Adress from 'App/Models/Adress'
import { AdressFactory } from 'Database/factories'

export default class AdressSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Adress.truncate()
    await AdressFactory.query()
  }
}
