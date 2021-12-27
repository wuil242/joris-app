import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Arrondissement from 'App/Models/Arrondissement'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import ServiceProvider from 'App/Models/ServiceProvider'

export default class ApisController {
  public async clientDevisIndex({ request, view }: HttpContextContract) {
    const serviceProviderId = +request.qs().sp || 0
    const serviceProvider = await ServiceProvider.query().where('id', serviceProviderId)
      .preload('address').preload('jobs').first()

    return await view.render('devis/client/index', {serviceProvider})
  }

  public async entrepriseDevisIndex({ params, view }: HttpContextContract) {
    const jobs = await Job.all()

    return await view.render('devis/entreprise/index', {jobs})
  }
}
