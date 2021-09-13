import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Arrondissement from 'App/Models/Arrondissement'
import { ArrondissementFactory } from 'Database/factories'

export default class ArrondissementSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    // await Arrondissement.truncate(true)

    await ArrondissementFactory.createMany(5)
  }
}
