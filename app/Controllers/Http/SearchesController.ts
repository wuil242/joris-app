import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LucidModel, ModelObject } from '@ioc:Adonis/Lucid/Orm'
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
    const cityId = Number.parseInt(qs.city, 10)
    const jobId = Number.parseInt(qs.job, 10)

    const arrondissementId = Number.parseInt(qs.arrondissement, 10)
    const quaterId = Number.parseInt(qs.quater, 10)

    let serviceProvidersData: ServiceProvider[] = []

    const jobs = await Job.query().orderBy('name', 'asc')
    const cities = await City.query().orderBy('name', 'asc').preload('arrondissents')

    let arrondissements:Arrondissement[] = []
    let quaters:Quater[] = []

    if(cityId > 0) {
      const relation = (await City.findOrFail(cityId)).related('arrondissents')
      arrondissements = await relation.query().orderBy('name', 'asc')
    }


    if(arrondissementId > 0) {
      const relation = (await Arrondissement.findOrFail(arrondissementId)).related('quaters')
      quaters = await relation.query().orderBy('name', 'asc')
    }

    let serviceProviders

    //TODO: Mettre en place recherche des prestataire 
    try {
        serviceProviders = await (await Job.findOrFail(jobId)).related('serviceProviders').query().preload('adress', (q) => {
        if(cityId) {
          q.select('*').where('city_id', cityId)
        }
        
        if(arrondissementId) {
          q.select('*').where('arrondissement_id', arrondissementId)
        }
  
        if(quaterId) {
          q.select('*').where('quater_id', quaterId)
        }
      }).orderBy(this.ORDER, 'desc').limit(this.LIMIT).preload('jobs')
  
    } catch (error) {
      console.log('ALl')
      const adress = 
      serviceProviders = await ServiceProvider.query().where((providerQuery) => {
        providerQuery.preload('adress', (adressQuery) => {
          if(cityId) {
            adressQuery.select('*').where('city_id', cityId)
          }
          
          if(arrondissementId) {
            adressQuery.select('*').where('arrondissement_id', arrondissementId)
          }
          
          if(quaterId) {
            adressQuery.select('*').where('quater_id', quaterId)
          }
          adressQuery.preload('city').preload('arrondissement').preload('quater')
      }).orderBy(this.ORDER, 'desc').limit(this.LIMIT).preload('jobs')
    }


    return view.render('search/index', {
      jobs, 
      cities, 
      arrondissements,
      quaters,
      qs, 
      serviceProviders
    })


   /*
    try {
      const job = await Job.findByOrFail('name', jobName)
      serviceProvidersData = await job
        .related('serviceProviders')
        .query()
        .select('*')
        .orderBy('score', 'desc')
        .limit(this.usersCount)
        .preload('adress')
        .preload('jobs')
    } catch (error) {
      if (jobName === '') {
        serviceProvidersData = await ServiceProvider.query()
          .select('*')
          .orderBy('score', 'desc')
          .limit(this.usersCount)
          .preload('adress')
          .preload('jobs')
      }
    }

    try {
      if (cityName) {
        serviceProvidersData = await this.fecthData(City, cityName, 'cityId', serviceProvidersData)
        if (arrondissementName) {
          serviceProvidersData = await this.fecthData(
            Arrondissement,
            arrondissementName,
            'arrondissementId',
            serviceProvidersData
          )
          if (quaterName) {
            serviceProvidersData = await this.fecthData(
              Quater,
              quaterName,
              'quaterId',
              serviceProvidersData
            )
          }
        }
      }
    } catch {}

    const normalisedData: ModelObject[] = []

    for (const sp of serviceProvidersData) {
      const adress = await sp
        .related('adress')
        .query()
        .preload('city')
        .preload('arrondissent')
        .preload('quater')
        .first()

      const serviceProviderFields = sp.serialize({
        fields: ['id', 'firstname', 'lastname', 'photo', 'description', 'accroch_sentence'],
      })

      const jobs = sp.jobs.map((j) => j.serialize({ fields: ['name', 'color', 'bg_color'] }))

      normalisedData.push({
        ...serviceProviderFields,
        jobs,
        adress: adress?.full,
        city: adress?.city.name,
        arrondissement: adress?.arrondissent.name,
        quater: adress?.quater?.name,
      })
    }

    if (request.ajax()) {
      const html = await view.render('search/card', { sericeProviders: normalisedData })
      return { qs, method: 'POST', sp: normalisedData, html }
    }

    const jobs = await Job.all()
    const cities = await City.all()

    return view.render('search/index', { sericeProviders: normalisedData, jobs, cities, qs })
    */
  }

  private async fecthData(
    model: LucidModel,
    name: string,
    modelId: string,
    serviceProvidersData: ServiceProvider[]
  ): Promise<ServiceProvider[]> {
    const value = (await model.findByOrFail('name', name)) as City | Arrondissement | Quater
    const data = serviceProvidersData.filter((sp) => {
      if (!sp.adress) return false
      return sp.adress[modelId] === value.id
    })
    return Promise.resolve(data)
  }
}
