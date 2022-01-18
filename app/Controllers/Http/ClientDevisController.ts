import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceProvider from 'App/Models/ServiceProvider'
import twilio from 'twilio'
import Env from '@ioc:Adonis/Core/Env'
import ClientDeviValidator from 'App/Validators/ClientDeviValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import { COUNTRY_CODE } from 'App/Configs/constants'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class ClientDevisController {

  public async index({ request, view }: HttpContextContract) {
    const qs = request.qs()
    const serviceProviderId = +qs.sp || 0
    const serviceProvider = await ServiceProvider.query().where('id', serviceProviderId)
      .preload('address').preload('jobs').first()

    return await view.render('devis/client/index', {serviceProvider})
  }

  
  public async store({request, view, response, session, auth}:HttpContextContract) {

    const payload = await request.validate(ClientDeviValidator)
    
    try {
      const tel = payload.tel.includes(COUNTRY_CODE) ? payload.tel : COUNTRY_CODE + payload.tel

      const denyTel = await Database.from('blacklist_tel').where('tel', tel).first()

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
      
      const date = new Date().toLocaleDateString('fr-FR', {
        month: 'long', day: 'numeric', year: 'numeric', 'formatMatcher': 'best fit'
      })
      const body = await view.render('sms/client_devis', {
        ...payload, 
        city: sp.address.city, 
        date
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
