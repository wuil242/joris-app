import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Arrondissement from 'App/Models/Arrondissement'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import { HasMany, HasManyQueryBuilderContract, RelationQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

interface FilterLoactionOptions {
  cityId: number,
  arrondissementId: number,
  quaterId: number
}

export default class SearchesController {
  private LIMIT = 10
  private ORDER = 'score'

  public async index({ request, view, session }: HttpContextContract) {
    const qs = request.qs()

    const jobId = Number.parseInt(qs.job, 10) || 0
    const cityId = Number.parseInt(qs.city, 10) || 0
    const arrondissementId = Number.parseInt(qs.arrondissement, 10) || 0
    const quaterId = Number.parseInt(qs.quater, 10) || 0
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
      serviceProviders = await job.related('serviceProviders').query()
        .preload('address', query => this.filterAddressQuery(query, filterLocation))
        .orderBy(this.ORDER).limit(this.LIMIT)
    }
    else {
      serviceProviders = await ServiceProvider.query()
        .preload('address', query => this.filterAddressQuery(query, filterLocation))
        .orderBy(this.ORDER).paginate(1, this.LIMIT)
    }

    serviceProviders = await this.filterServiceProvider(serviceProviders, filterLocation)

    return view.render('search/index', {
      jobs,
      cities,
      arrondissements,
      quaters,
      qs,
      serviceProviders
    })

  }

  private async filterServiceProvider
  (serviceProviders:ServiceProvider[], 
    { cityId, arrondissementId, quaterId }: FilterLoactionOptions
  ): Promise<ServiceProvider[]> {
    return new Promise((resolve, reject) => {
      if(cityId > 0 && arrondissementId > 0 && quaterId > 0) {
        serviceProviders = serviceProviders.filter(sp => {
          return sp.address?.city.id === cityId && 
            sp.address?.arrondissement.id === arrondissementId &&
            sp.address?.quater.id === quaterId
        })
      }
      else if(cityId > 0 && arrondissementId > 0) {
        serviceProviders = serviceProviders.filter(sp => {
          return sp.address?.city.id === cityId && 
            sp.address?.arrondissement.id === arrondissementId
        })
      }
      else if(cityId > 0) {
        serviceProviders = serviceProviders.filter(sp => {
          return sp.address?.city.id === cityId
        })
      }
      resolve(serviceProviders)
    })
  }

  private filterAddressQuery
    (
      query: RelationQueryBuilderContract<typeof Address, any>,
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

  public async form({ request, view }: HttpContextContract) {
    const jobs = await Job.query().orderBy('name', 'asc')
    let cities = await City.query().orderBy('name', 'asc')

    const qs = request.qs()
    console.log(qs)
    const cityId = Number.parseInt(qs.city, 10) || 0
    const arrondissementId = Number.parseInt(qs.arrondissement, 10) || 0

    const arrondissements = await Database.from('arrondissements').where('city_id', cityId)

    const quaters = await Database.from('quaters').where('city_id', cityId)
      .where('arrondissement_id', arrondissementId)

    return await view.render('search/parts/search-fields-selection', {
      jobs, cities, arrondissements, quaters, qs
    })
  }

}