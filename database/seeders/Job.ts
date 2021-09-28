import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Job from 'App/Models/Job'
import { JobFactory } from 'Database/factories'

export default class JobSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Job.truncate()
    await JobFactory.createMany(5)
  }
}
