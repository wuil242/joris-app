import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Arrondissement from 'App/Models/Arrondissement'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import ServiceProvider from 'App/Models/ServiceProvider'

export default class ApisController {
  public async clientDevisIndex({ request, view }: HttpContextContract) {
    const qs = request.qs()
    const serviceProviderId = +qs.sp || 0
    const lastSearchUrl = this.createLastSearchUrl(qs.lastSearchQuery)
    const serviceProvider = await ServiceProvider.query().where('id', serviceProviderId)
      .preload('address').preload('jobs').first()

    return await view.render('devis/client/index', {serviceProvider, lastSearchUrl})
  }

  private createLastSearchUrl(lastSearchQuery: string): string {
    try {
      const {job, city, arrondissement, quater, limit} = JSON.parse(lastSearchQuery)
      if(!job || !city || !arrondissement || !quater || !limit) {
        return '/recherche'
      }

      return `/recherche/?job=${job}&city=${city}&arrondissement=${arrondissement}&quater=${quater}&limit=${limit}`
    } catch (error) {
      return '/recherche'
    }
  }

  
  public async clientDevisSubmit({}:HttpContextContract) {
    
  }

  public async entrepriseDevisIndex({ params, view }: HttpContextContract) {
    const jobs = await Job.all()

    return await view.render('devis/entreprise/index', {jobs})
  }
}
