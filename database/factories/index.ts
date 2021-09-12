import Factory from '@ioc:Adonis/Lucid/Factory'
import Arrondissement from 'App/Models/Arrondissement'
import City from 'App/Models/City'
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

export const CityFactory = Factory.define(City, ({faker}) => {
  return {
    name: faker.lorem.word(5)
  }
})