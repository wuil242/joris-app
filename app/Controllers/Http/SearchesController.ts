import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract, ModelQueryBuilderContract, RelationQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
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
    let arrondissements:Arrondissement[] = []
    let quaters:Quater[] = []
    let serviceProviders: ModelPaginatorContract<ServiceProvider>|null = null 

    const city = await City.find(cityId) || {id: 0}

    const arr = await Arrondissement.query().where('city_id', city.id)
      .where('id', arrondissementId).first()|| {id: 0}

    const quater = await Quater.query().where('city_id', city.id)
      .where('arrondissement_id', arr.id).where('id', quaterId).first()

    if(city) {
      arrondissements = await Arrondissement.query().where('city_id', city.id)
    }

    if(arr) {
      const id = city ? city.id : 0 
      quaters = await Quater.query().where('city_id', id).where('arrondissement_id', arr.id)
    }

    let query:ModelQueryBuilderContract<typeof ServiceProvider>|null = null

    const job = await Job.find(jobId)

    if(job) {
      query = ServiceProvider.query().where('jobs_id', job.id)
    }
    else {
      query = ServiceProvider.query()
    }



    const data = await query.paginate(page, this.LIMIT)

    return view.render('search/index', {
      qs, jobs, cities, arrondissements, quaters
    })
  }

}
