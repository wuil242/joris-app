import Factory from '@ioc:Adonis/Lucid/Factory'
import Arrondissement from 'App/Models/Arrondissement'
import City from 'App/Models/City'
import Quater from 'App/Models/Quater'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({faker}) => {
  return {
    lastname: faker.name.lastName(),
    firstname: faker.name.firstName(),
    tel: faker.phone.phoneNumber('06#######'),
    email: faker.internet.email(),
    password: '1234'
  }
}).build()

let cityNbre = 0
export const CityFactory = Factory.define(City, ({faker}) => {
  const cityTab = ['brazzaville', 'owesso']
  return {
    name: cityTab[cityNbre++]
  }
}).build()

let arrNbre = 0
export const ArrondissementFactory = Factory.define(Arrondissement, async ({faker}) => {
  const city = (await City.all())[1]
  if(!city) throw new Error('Not Found City')
  arrNbre++
  return {
    name: faker.lorem.word(6),
    cityId: city.id
  }
}).build()

export const QuaterFactory = Factory.define(Quater, async ({faker}) => {
  const city = (await City.all())[1]
  const arrondissement = (await Arrondissement.all())[1]

  if(!city) throw new Error('Not Found City')
  if(!arrondissement) throw new Error('Not Found arrondissement')

  return {
    name: faker.lorem.word(7),
    cityId: city.id,
    arrondissementId: arrondissement.id
  }
}).build()