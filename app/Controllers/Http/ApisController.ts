import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Job from 'App/Models/Job'
import ServiceProvider from 'App/Models/ServiceProvider'

export default class ApisController {
  
  public async getSp({params}:HttpContextContract) {
    const id = params.id
    const job = await Job.findBy('id', parseInt(id, 10))
    const sp = await job?.related('serviceProviders').query().first()
    return {sp: sp?.serialize()}
  }
}
