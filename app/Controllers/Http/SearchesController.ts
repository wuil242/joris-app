import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Arrondissement from 'App/Models/Arrondissement'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import { HasMany, HasManyQueryBuilderContract, RelationQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

//TODO: gererer le fitrage par nobre de sp a afficher (limit)
//TODO: slider et un champ de type nbre pour selectionner du nombre de sp a afficher

interface FilterLoactionOptions {
  cityId: number,
  arrondissementId: number,
  quaterId: number
}

export default class SearchesController {
  private LIMIT = {
    MAX: 50,
    MIN: 1
  }

  private ORDER = 'score'

  public async index({ request, view, session }: HttpContextContract) {
    const qs = request.qs()

    const jobId = Number.parseInt(qs.job, 10) || 0
    const cityId = Number.parseInt(qs.city, 10) || 0
    const arrondissementId = Number.parseInt(qs.arrondissement, 10) || 0
    const quaterId = Number.parseInt(qs.quater, 10) || 0
    const page =  Number.parseInt(qs.page, 10) || 1
    const limit =  Number.parseInt(qs.limit, 10)
    const perPage = this.limitation(limit) 

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
        .preload('jobs').orderBy(this.ORDER).paginate(page, perPage)
    }
    else {
      serviceProviders = await ServiceProvider.query()
        .preload('address', query => this.filterAddressQuery(query, filterLocation))
        .preload('jobs').orderBy(this.ORDER).paginate(page, perPage)
    }

    serviceProviders = await this.filterServiceProvider(serviceProviders, filterLocation)

    if(request.ajax()) {

      const filter =  await view.render('search/parts/search-fields', {
        qs, 
        LIMIT: {...this.LIMIT, VALUE: perPage}
      })

      const data = await view.render('search/service-providers', {
        serviceProviders
      })

      return {
        html: {
          filter,
          serviceProviders: data,
        },
        serviceProviders
      }
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


  public async getPerPage({ request, view }: HttpContextContract) {
    const qs = request.qs()
    const jobId = Number.parseInt(qs.job, 10) || 0
    const cityId = Number.parseInt(qs.city, 10) || 0
    const arrondissementId = Number.parseInt(qs.arrondissement, 10) || 0
    const quaterId = Number.parseInt(qs.quater, 10) || 0
    const filterLocation:FilterLoactionOptions = {cityId, arrondissementId, quaterId}
    const page =  Number.parseInt(qs.page, 10) || 2
    const limit =  Number.parseInt(qs.limit, 10)
    const perPage = this.limitation(limit)

    let serviceProviders: ServiceProvider[] = []
    let job: Job | null = null

    if (jobId > 0) {
      job = await Job.find(jobId)
    }

    if (job) {
      serviceProviders = await job.related('serviceProviders').query()
        .preload('address', query => this.filterAddressQuery(query, filterLocation))
        .preload('jobs').orderBy(this.ORDER).paginate(page, perPage)
    }
    else {
      serviceProviders = await ServiceProvider.query()
        .preload('address', query => this.filterAddressQuery(query, filterLocation))
        .preload('jobs').orderBy(this.ORDER).paginate(page, perPage)                                                                                                                                                                                                    
    }

    serviceProviders = await this.filterServiceProvider(serviceProviders, filterLocation)

    return view.render('search/service-providers', {
      serviceProviders
    })
  }

  private limitation(limit: number): number {
    return limit || (limit < this.LIMIT.MAX && limit > this.LIMIT.MIN) ? limit : this.LIMIT.MIN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
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

}