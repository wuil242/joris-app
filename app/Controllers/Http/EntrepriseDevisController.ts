import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'

export default class EntrepriseDevisController {

  public async index({ view }: HttpContextContract) {
    const cities = await City.query().orderBy('name', 'asc')
    return await view.render('devis/entreprise/index', {cities})
  }

  public async store({response}: HttpContextContract) {

  }

  public async success({view}:HttpContextContract) {
    
  }
  
  public async error({view}:HttpContextContract) {
    
  }
}
