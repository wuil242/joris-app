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

export const CityFactory = Factory.define(City, ({}) => {
  return {
    name: 'nkayi',
  }
}).build()

export const ArrondissementFactory = Factory.define(Arrondissement, async ({ faker }) => {
  const city = (await City.all())[0]
  if (!city) throw new Error('Not Found City')
  return {
    name: faker.lorem.word(4),
    cityId: city.id,
  }
}).build()

export const QuaterFactory = Factory.define(Quater, async ({ faker }) => {
  const city = (await City.all())[0]
  const arrondissement = (await Arrondissement.all())[0]

  if (!city) throw new Error('Not Found City')
  if (!arrondissement) throw new Error('Not Found arrondissement')

  return {
    name: faker.lorem.word(5),
    cityId: city.id,
    arrondissementId: arrondissement.id,
  }
}).build()

export const AdressFactory = Factory.define(Adress, async ({ faker }) => {
  const city = (await City.all())[0]
  const arrondissement = (await Arrondissement.all())[0]
  const quater = (await Quater.all())[0]
  const provider = (await ServiceProvider.all())[0]

  if (!city) throw new Error('Not Found City')
  if (!arrondissement) throw new Error('Not Found arrondissement')
  if (!quater) throw new Error('Not Found quater')

  return {
    street: faker.address.streetName(),
    numberAdress: faker.datatype.number({ min: 1, max: 100 }),
    cityId: city.id,
    arrondissementId: arrondissement.id,
    quaterId: quater.id,
    serviceProviderId: provider.id,
  }
}).build()

export const JobFactory = Factory.define(Job, ({ faker }) => {
  return {
    name: faker.name.jobType(),
    color: faker.internet.color(255, 255, 255),
    bgColor: faker.internet.color(255, 255, 255),
  }
}).build()

export const ServiceProviderFactory = Factory.define(ServiceProvider, ({ faker }) => {
  return {
    lastname: faker.name.lastName(),
    firstname: faker.name.firstName(),
    tel: faker.phone.phoneNumber('06#######'),
    secureTel: faker.phone.phoneNumber('05#######'),
    email: faker.internet.email(),
    description: faker.lorem.sentences(3),
    accrochSentence: faker.lorem.sentence(1),
    sexe: 'f' as SEXE,
    age: faker.datatype.number({ min: 18, max: 60 }),
  }
}).build()
