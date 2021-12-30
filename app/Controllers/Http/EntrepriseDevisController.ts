import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'
import Job from 'App/Models/Job'

export default class EntrepriseDevisController {

  public async index({ view }: HttpContextContract) {
    const jobs = await Job.all()
    const cities = await City.all()

    return await view.render('devis/entreprise/index', {jobs, cities})
  }
}
