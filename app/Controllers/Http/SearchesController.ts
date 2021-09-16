import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LucidModel, ModelObject } from '@ioc:Adonis/Lucid/Orm'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Arrondissement from 'App/Models/Arrondissement'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'

// interface searchQuery {
//   job: string,
//   city:string
// }

export default class SearchesController {
  private usersCount = 10
  
  public async index({view}:HttpContextContract) {
    const jobs = await Job.all()
    const cities = await City.all()
    return view.render('search/index', { jobs, cities })
  }

  
  public async search({request, view, session}:HttpContextContract) {
    const qs = request.qs()
    const cityName = qs.city  //parseInt(qs.city, 10)
    const jobName = qs.job //parseInt(qs.job, 10)
    const arrondissementName = qs.arrondissement
    const quaterName = qs.quater

    let serviceProvidersData:ServiceProvider[] = []

      try {
        const job = await Job.findByOrFail('name', jobName)
        serviceProvidersData = await job.related('serviceProviders').query()
          .select('*').orderBy('score', 'desc').limit(this.usersCount).preload('adress').preload('jobs')
      } catch (error) {
        if(jobName === '') {
          serviceProvidersData = await ServiceProvider.query()
            .select('*').orderBy('score', 'desc').limit(this.usersCount).preload('adress').preload('jobs')
        }
      }

      try {
        if(cityName) {
          serviceProvidersData = await this.fecthData(City, cityName, 'cityId', serviceProvidersData)
          if(arrondissementName) {
            serviceProvidersData = await this.fecthData(Arrondissement, arrondissementName, 'arrondissementId', serviceProvidersData)
            if(quaterName) {
              serviceProvidersData = await this.fecthData(Quater, quaterName, 'quaterId', serviceProvidersData)
            }  
          } 
        }
        
      } catch{}

    const normalisedData:ModelObject[] = []

    for (const sp of serviceProvidersData) {
      const adress = await sp.related('adress').query().preload('city')
        .preload('arrondissent').preload('quater').first()

      const serviceProviderFields = sp.serialize({fields: ['id', 'firstname', 'lastname', 
        'photo', 'description', 'accroch_sentence'
      ]})

      const jobs = sp.jobs.map(j => j.serialize({fields: ['name', 'color', 'bg_color']}))

      normalisedData.push( {
        ...serviceProviderFields,
        jobs,
        adress: adress?.full,
        city: adress?.city.name,
        arrondissement: adress?.arrondissent.name,
        quater: adress?.quater?.name,
      })
      
    }

    if(request.ajax()) {
      const html = await view.render('search/card', {sericeProviders: normalisedData})
      return { qs, method: 'POST', sp: normalisedData, html}
    }

    const jobs = await Job.all()
    const cities = await City.all()

    return view.render('search/index', {sericeProviders: normalisedData, jobs, cities, qs})

  }

  private async fecthData(model:LucidModel, name:string, modelId:string, serviceProvidersData: ServiceProvider[]):Promise<ServiceProvider[]> {
    const value = await model.findByOrFail('name', name) as City | Arrondissement | Quater
    const data = serviceProvidersData.filter(sp => {
      if(!sp.adress) return false
      return sp.adress[modelId] === value.id
    } )
    return Promise.resolve(data) 
  }

}
