import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Arrondissement from 'App/Models/Arrondissement'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import ServiceProvider from 'App/Models/ServiceProvider'

export default class ApisController {
  
  public async getAllArrs({params}:HttpContextContract) {
    try {
      const city = await City.findByOrFail('name', params.name)
      return city.related('arrondissents').query().orderBy('name', 'asc')
    } catch (error) {
      return {error}
    }
  }

  
  public async getAllQuaters({params}:HttpContextContract) {
    try {
      const arrondissement = await Arrondissement.findByOrFail('name', params.name)
      return arrondissement.related('quaters').query().orderBy('name', 'asc')
    } catch (error) {
      return {error}
    }
  }
}
