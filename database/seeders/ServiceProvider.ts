import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import ServiceProvider from 'App/Models/ServiceProvider'
import { AdressFactory, ArrondissementFactory, CityFactory, JobFactory, QuaterFactory, ServiceProviderFactory } from 'Database/factories'

export default class ServiceProviderSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await ServiceProvider.truncate(true)
    await City.truncate(true)
    await Job.truncate(true)

    await CityFactory.create()
    await ArrondissementFactory.createMany(2)
    await QuaterFactory.createMany(3)

    const jobs = await JobFactory.createMany(4)
    const provider = await ServiceProviderFactory.create()

    provider.related('jobs').attach([jobs[0].id])

    await AdressFactory.create()
  }
}
