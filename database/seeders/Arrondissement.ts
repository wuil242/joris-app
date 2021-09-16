import Factory from '@ioc:Adonis/Lucid/Factory'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Arrondissement from 'App/Models/Arrondissement'

export default class ArrondissementSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    // await Arrondissement.truncate(true)

    const brazzavilleArrondissent = {
      cityId: 1,
      content: ['makelekele', 'bakongo',
        'mfilou', 'kintele', 'moungali', 'poto-poto']
    }

    const pointNoireArrs = {
      cityId: 2,
      content: ['loumumba']
    }

    let arrsCount = 0
    const factory = Factory.define(Arrondissement, ({ }) => {
      return {
        name: pointNoireArrs.content[arrsCount++],
        cityId: pointNoireArrs.cityId
      }
    }).build()

    await factory.createMany(pointNoireArrs.content.length)
  }
}
