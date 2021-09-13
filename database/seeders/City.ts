import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'
import { CityFactory } from 'Database/factories'
// import { ArrondissementFactory } from 'Database/factories'

export default class CitySeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    await City.truncate(true)

    await CityFactory.createMany(2)
    // await q.related('city').associate(city)
  }
}
