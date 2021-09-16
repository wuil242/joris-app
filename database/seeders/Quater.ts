import Factory from '@ioc:Adonis/Lucid/Factory'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Quater from 'App/Models/Quater'

export default class QuaterSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    // await Quater.truncate()
    const mfilouQuater = {
      cityId: 1,
      arrId: 3,
      content: ['la base', 'mouhoumi']
    }

    const moungaliQuater = {
      cityId: 1,
      arrId: 5,
      content: ['moukondo']
    }

    let quaterCount = 0
    const factory = Factory.define(Quater, ({}) => {
      return {
        name: moungaliQuater.content[quaterCount++],
        cityId: 1,
        arrondissementId: moungaliQuater.arrId 
      }
    }).build()

    await factory.createMany(moungaliQuater.content.length)
  }
}
