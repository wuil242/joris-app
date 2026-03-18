import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceProvider from 'App/Models/ServiceProvider'
import ClientDeviValidator from 'App/Validators/ClientDeviValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import { formatNumberPhone, getFormatedDateTime } from 'App/Helpers/helpers'
import { string, types } from '@ioc:Adonis/Core/Helpers'
import { sendMessage } from 'App/Services/Twilio'

// FIXME: retrailler le processus de soumission des devis des clients et des entreprise

export default class ClientDevisController {

  public async index({ request, view}: HttpContextContract) {
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

    return await view.render('devis/client/index', {serviceProviders})
  }

  
  public async store({request, view, response, session, auth}:HttpContextContract) {

    const payload = await request.validate(ClientDeviValidator)
    
    try {
      payload.tel = formatNumberPhone(payload.tel)

      const denyTel = await Database.from('blacklist_tel').where('tel', payload.tel).first()

      if(denyTel) {
        const data = {
          value: payload.tel,
          message: 'Le numero'
        }
        session.flash('alert', {type: 'error', message: await view.render('alert/ban', {...data})})
        session.flashAll()
        return response.redirect().toRoute('devis.client', undefined, {
          qs: {sp: payload.serviceProviderIds}
        })
      }

      const ServiceProviders = await ServiceProvider.query().where('id', payload.serviceProviderIds)
        .preload('address')
      
      if(!ServiceProviders || ServiceProviders.length <= 0) {
        throw `Aucun prestaire trouver avec les ids ${payload.serviceProviderIds.join(',')}`
      }
      
      payload.message = string.condenseWhitespace(payload.message)

      for await (const sp of ServiceProviders) {
        const body = await view.render('sms/client_devis', {
          ...payload, 
          city: sp.address.city, 
          date: getFormatedDateTime()
        })
        
        sendMessage({
          body,
          to: sp.tel
        })

        Database.table('client_devis').insert({
          firstname: payload.firstname,
          lastname: payload.lastname,
          tel: payload.tel,
          'user_id':  auth.user?.id
        }).returning('id').then(async () => {
          await ServiceProvider.query().increment('score', 1).where('id', sp.id)
        })

        return response.redirect().toRoute('devis.client.success')
      }

    }
    catch(err) {
      console.error(err)
      
      return response.redirect().toRoute('devis.client.error')
    }

  }

  public async success({view}:HttpContextContract) {
    return await view.render('devis/message', { type: 'success' })
  }
  
  public async error({view}:HttpContextContract) {
    return await view.render('devis/message', { type: 'error' })
  }
}
