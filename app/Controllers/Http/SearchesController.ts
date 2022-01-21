import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Arrondissement from 'App/Models/Arrondissement'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'
import Address from 'App/Models/Address'
import { RelationSubQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

//TODO: mettre les limitte d'affichage exacte pour les prestataires 5 - 15

interface FilterLoactionOptions {
  cityId: number,
  arrondissementId: number,
  quaterId: number
}

export default class SearchesController {
  private LIMIT = {
    MAX: 15,
    MIN: 1
  }

  private ORDER = 'score'

  public async index({ request, view }: HttpContextContract) {
    const qs = request.qs()

    const jobId = Number.parseInt(qs.job, 10) || 0
    const cityId = Number.parseInt(qs.city, 10) || 0
    const arrondissementId = Number.parseInt(qs.arrondissement, 10) || 0
    const quaterId = Number.parseInt(qs.quater, 10) || 0
    const page =  Number.parseInt(qs.page, 10) || 1
    const limit =  Number.parseInt(qs.limit, 10)
    const perPage = qs.limit = this.limitation(limit) 

    const filterLocation:FilterLoactionOptions = {cityId, arrondissementId, quaterId}

    const jobs = await Job.query().orderBy('name', 'asc')
    const cities = await City.query().orderBy('name', 'asc')
    let serviceProviders: ServiceProvider[] = []
    let arrondissements: Arrondissement[] = []
    let quaters: Quater[] = []

    let job: Job | null = null

    if (jobId > 0) {
      job = await Job.find(jobId)
    }

    if(cityId > 0) {
      arrondissements = await Arrondissement.query().where('city_id', cityId)

      if(arrondissementId > 0) {
        quaters = await Quater.query().where('city_id', cityId)
          .where('arrondissement_id', arrondissementId) 
      }
    }

    if (job) {
      serviceProviders = await  ServiceProvider.query()
        .whereNotNull('subscription')
        .whereHas('address', addressQuery => {
          this.filterAddressQuery(addressQuery, filterLocation)
        })
        .whereHas('jobs', jobsQuery => jobsQuery.where('jobs_id', jobId))
        .preload('jobs').preload('address')
        .orderBy(this.ORDER, 'desc')
        .paginate(page, perPage)
    }
    else {
      serviceProviders = await  ServiceProvider.query()
        .whereNotNull('subscription')
        .whereHas('address', addressQuery => {
          this.filterAddressQuery(addressQuery, filterLocation)
        })
        .preload('jobs').preload('address')
        .orderBy(this.ORDER, 'desc')
        .paginate(page, perPage)
    }

    if(request.ajax()) {
      const count = qs?.count === ''
      const filter = await view.render('search/parts/search-fields', {
        jobs,
        cities,
        arrondissements,
        quaters,
        qs,
        LIMIT: {...this.LIMIT, VALUE: perPage},
      })

      if(count) {
        return {count: serviceProviders.length, filter}
      }

      const html = await view.render('service_provider/service_providers', {
        serviceProviders, qs
      })

      

      return {html, filter}
    }

    return view.render('search/index', {
      jobs,
      cities,
      arrondissements,
      quaters,
      qs,
      LIMIT: {...this.LIMIT, VALUE: perPage},
      serviceProviders
    })

  }

  private limitation(limit: number): number {
    return limit ?  
    (limit < this.LIMIT.MIN ? this.LIMIT.MIN : limit > this.LIMIT.MAX ? this.LIMIT.MAX : limit) 
    : this.LIMIT.MIN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  } 

  private filterAddressQuery
  (
    query: RelationSubQueryBuilderContract<typeof Address>,
    { cityId, arrondissementId, quaterId }: FilterLoactionOptions
  ): void {
  if (cityId > 0) {
    query.where('city_id', cityId)
  }
  
  if (arrondissementId > 0) {
    query.where('arrondissement_id', arrondissementId)
  }
  
  if (quaterId > 0) {
    query.where('quater_id', quaterId)
  }
}

}