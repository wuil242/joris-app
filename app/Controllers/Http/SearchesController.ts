import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract, ModelQueryBuilderContract, RelationQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import City from 'App/Models/City'
import Job from 'App/Models/Job'
import Arrondissement from 'App/Models/Arrondissement'
import Quater from 'App/Models/Quater'
import ServiceProvider from 'App/Models/ServiceProvider'
import Adress from 'App/Models/Adress'
import Database from '@ioc:Adonis/Lucid/Database'

// interface searchQuery {
//   job: string,
//   city:string
// }

export default class SearchesController {
  private LIMIT = 10
  private ORDER = 'score'

  public async index({ request, view, session }: HttpContextContract) {
    const jobs = await Job.query().orderBy('name', 'asc')
    let cities = await City.query().orderBy('name', 'asc')
    
    return view.render('search/index', {
      jobs, cities
    })
  }

}