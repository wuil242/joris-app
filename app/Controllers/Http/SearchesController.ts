import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract, ModelQueryBuilderContract, RelationQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Arrondissement from 'App/Models/Arrondissement'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'
import Address from 'App/Models/Address'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SearchesController {
  private LIMIT = 10
  private ORDER = 'score'

  public async index({view }: HttpContextContract) {
    const jobs = await Job.query().orderBy('name', 'asc')
    let cities = await City.query().orderBy('name', 'asc')

    return await view.render('search/index', {
      jobs, cities, arrondissements: [], quaters: [], qs: {}
    })
  }

  public async form({request, view}:HttpContextContract) {
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