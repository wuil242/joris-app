import Factory from '@ioc:Adonis/Lucid/Factory'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Adress from 'App/Models/Adress'

export default class AdressSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    // await Adress.truncate(true)

    let cityID = 1
    let arrId = 5
    let quaterId = 3
    let providerId = 2
    const factory = Factory.define(Adress, ({ faker }) => {
      return {
        street: faker.address.streetName(),
        numberAdress: faker.datatype.number({ min: 1, max: 100 }),
        cityId: cityID,
        arrondissementId: arrId,
        quaterId: quaterId,
        serviceProviderId: providerId,
      }
    }).build()

    await factory.create()
  }
}
