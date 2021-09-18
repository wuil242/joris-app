import Factory from '@ioc:Adonis/Lucid/Factory'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'
// import { CityFactory } from 'Database/factories'
// import { ArrondissementFactory } from 'Database/factories'

export default class CitySeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    await City.truncate(true)

    const cities = ['brazzaville', 'pointe-Noire', 'oyo']
    let cityCount = 0
    const factory = Factory.define(City, ({}) => {
      return {
        name: cities[cityCount++],
      }
    }).build()

    await factory.createMany(cities.length)
    // await q.related('city').associate(city)
  }
}
