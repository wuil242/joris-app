import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    ;(await User.all()).forEach((usr) => usr.delete())
    await UserFactory.createMany(2)
  }
}
