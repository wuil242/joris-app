import Factory from '@ioc:Adonis/Lucid/Factory'
import user from 'App/Models/user'

export const UserFactory = Factory.define(user, ({faker}) => {
  return {
    lastname: faker.name.lastName(),
    firstname: faker.name.firstName(),
    tel: faker.phone.phoneNumber('06#######'),
    email: faker.internet.email(),
    password: '1234'
  }
}).build()