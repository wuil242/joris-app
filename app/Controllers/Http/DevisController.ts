import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Arrondissement from 'App/Models/Arrondissement'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import ServiceProvider from 'App/Models/ServiceProvider'

export default class ApisController {
  public async clientDevisIndex({ params, view }: HttpContextContract) {
    const serviceProviders = await ServiceProvider.query().where('id', params.id)
      .preload('address').preload('jobs').first()


    return await view.render('devis/client/index', {serviceProviders})
  }

  public async entrepriseDevisIndex({ params, view }: HttpContextContract) {
    const jobs = await Job.all()

    return await view.render('devis/entreprise/index', {jobs})
  }
}
