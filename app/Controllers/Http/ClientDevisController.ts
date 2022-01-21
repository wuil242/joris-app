import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceProvider from 'App/Models/ServiceProvider'
import twilio from 'twilio'
import Env from '@ioc:Adonis/Core/Env'
import ClientDeviValidator from 'App/Validators/ClientDeviValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import Mail from '@ioc:Adonis/Addons/Mail'
import { formatNumberPhone, getFormatedDateTime } from 'App/Helpers/helpers'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class ClientDevisController {

  public async index({ request, view}: HttpContextContract) {
    const ids = request.qs().sp
    let serviceProviderIds:number[] = []
    if(Array.isArray(ids)) {
      serviceProviderIds = ids.map(id => +id)
      const allId = serviceProviderIds.every(id => !Number.isNaN(id))
      if(!allId) {
        throw 'id de prestaire non valide' 
      }
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
          qs: {sp: payload.serviceProviderId}
        })
      }

      const sp = await ServiceProvider.query().where('id', payload.serviceProviderId)
        .preload('address').first()
      
      if(!sp) {
        throw `Aucun prestaire trouver avec l'id[${payload.serviceProviderId}]`
      }
      
      payload.message = string.condenseWhitespace(payload.message)

      const body = await view.render('sms/client_devis', {
        ...payload, 
        city: sp.address.city, 
        date: getFormatedDateTime()
      })

      const message = {
        body,
        messagingServiceSid: Env.get('TWILIO_MESSAGING_SERVICE_SID'),
        to: sp.tel
      }

      const accountSid = Env.get('TWILIO_ACCOUNT_ID'); 
      const authToken = Env.get('TWILIO_AUTH_TOKEN'); 
      const client = twilio(accountSid, authToken);
      
      try {
        await client.messages.create(message)
       
      } catch (error) {
        //FIXME: verifier que le code 30001 est bien un entier dans la documentation
        if(error.code === 30001 || error.code === 'EAI_AGAIN') {
          //TODO:envoyer un email a l'administrateur
          Mail.sendLater(async message => {
            const res = {message: error.message, payload}
            message.from('log@iprovider.cg')
              .to('dev@iprovider.cg')
              .subject('email log')
              .htmlView('email/error', {error: res})
          })

        }

        throw error
      }

      
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
