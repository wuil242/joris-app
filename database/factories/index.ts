import Factory from '@ioc:Adonis/Lucid/Factory'
import Adress from 'App/Models/Adress'
import Arrondissement from 'App/Models/Arrondissement'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    lastname: faker.name.lastName(),
    firstname: faker.name.firstName(),
    tel: faker.phone.phoneNumber('06#######'),
    email: faker.internet.email(),
    password: '1234',
  }
}).build()
