import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import user from 'App/Models/user'
import { UserFactory } from 'Database/factories'


export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    (await user.all()).forEach(usr => usr.delete())
    await UserFactory.createMany(2)
  }
}
