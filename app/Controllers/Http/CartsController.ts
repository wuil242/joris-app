import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {types} from '@ioc:Adonis/Core/Helpers'
import ServiceProvider from 'App/Models/ServiceProvider'

export default class CartsController {

  
  public async index({request, view}:HttpContextContract) {
    const ids = request.qs().sp
    let serviceProviderIds:number[] = []
    if(types.isArray(ids)) {
      serviceProviderIds = ids.map(id => +id)
      const allId = serviceProviderIds.every(id => !Number.isNaN(id))
      if(!allId) {
        throw 'id de prestaire non valide' 
      }
    }
    else if(types.isString(ids)) {
      serviceProviderIds.push(+ids)
    }

    const serviceProviders = await ServiceProvider.query().whereIn('id', serviceProviderIds)
    .preload('address').preload('jobs')

    if(serviceProviders.length <= 0) {
      return ''
    }

    return await view.render('components/service_provider_box', {serviceProviders})
  }
}
