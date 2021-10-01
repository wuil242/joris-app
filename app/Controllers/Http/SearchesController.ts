import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RelationQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Arrondissement from 'App/Models/Arrondissement'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'
import Adress from 'App/Models/Adress'

// interface searchQuery {
//   job: string,
//   city:string
// }

export default class SearchesController {
  private LIMIT = 10
  private ORDER = 'score'

  public async index({ request, view, session }: HttpContextContract) {
    const qs = request.qs()
    const page = Number.parseInt(qs.page, 10) || 1
    const jobId = Number.parseInt(qs.job, 10) || 0
    
    let cityId = Number.parseInt(qs.city, 10) || 0
    let arrondissementId = Number.parseInt(qs.arrondissement, 10) || 0
    let quaterId = Number.parseInt(qs.quater, 10) || 0
    
    const jobs = await Job.query().orderBy('name', 'asc')
    let cities = await City.query().orderBy('name', 'asc')
    let serviceProviders: ServiceProvider[] = []
    let arrondissements:Arrondissement[] = []
    let quaters:Quater[] = []

    if(cityId > 0) {
      try {
        const relation = (await City.findOrFail(cityId)).related('arrondissents')
        arrondissements = await relation.query().orderBy('name', 'asc')

        if(arrondissementId > 0) {
          const relation = (await Arrondissement.findOrFail(arrondissementId)).related('quaters')
          quaters = await relation.query().orderBy('name', 'asc')
        }

      } catch (error) {
        arrondissements  = []
        quaters = []

        cityId = 0
        arrondissementId = 0
        quaterId = 0
      }
    }

    try {
      const job = await Job.findOrFail(jobId)
      serviceProviders = await job.related('serviceProviders').query().preload('adress', this.adressQuery)
        .preload('jobs').orderBy(this.ORDER, 'desc').paginate(page, this.LIMIT)

    } catch (error) {
      serviceProviders = await ServiceProvider.query().preload('adress', this.adressQuery)
        .preload('jobs').orderBy(this.ORDER, 'desc').paginate(page, this.LIMIT)
    }

    if(cityId > 0) {
     serviceProviders = await this.filterServicePrividersData('cityId', cityId, serviceProviders)
     if(arrondissementId > 0) {
       serviceProviders = await this.filterServicePrividersData('arrondissementId', arrondissementId, serviceProviders)
       if(quaterId > 0) {
         serviceProviders = await this.filterServicePrividersData('quaterId', quaterId, serviceProviders)
       }
     }
    }

    return view.render('search/index', {
      jobs, 
      cities, 
      arrondissements,
      quaters,
      qs, 
      serviceProviders
    })

  }

  private adressQuery(query:RelationQueryBuilderContract<typeof Adress, any>):void {
    query.preload('city').preload('arrondissement').preload('quater')
  }

  private async filterServicePrividersData(
    modelName: 'cityId' | 'arrondissementId' | 'quaterId',
    modelId: number,
    serviceProvidersData: ServiceProvider[]
  ): Promise<ServiceProvider[]> {
    const data =  serviceProvidersData.filter(sp => sp.adress[modelName] === modelId)
    return Promise.resolve(data)
  }
}
