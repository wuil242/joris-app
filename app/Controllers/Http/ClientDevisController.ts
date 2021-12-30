import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Arrondissement from 'App/Models/Arrondissement'
import ServiceProvider from 'App/Models/ServiceProvider'
import twilio from 'twilio'
import Env from '@ioc:Adonis/Core/Env'
import ClientDeviValidator from 'App/Validators/ClientDeviValidator'

export default class ClientDevisController {

  public async index({ request, view }: HttpContextContract) {
    const qs = request.qs()
    const serviceProviderId = +qs.sp || 0
    const serviceProvider = await ServiceProvider.query().where('id', serviceProviderId)
      .preload('address').preload('jobs').first()

    return await view.render('devis/client/index', {serviceProvider})
  }

  
  public async store({request, view, response}:HttpContextContract) {

    const payload = await request.validate(ClientDeviValidator)
    
    try {
      const date = new Date().toLocaleDateString('fr-FR', {
        month: 'long', day: 'numeric', year: 'numeric', 'formatMatcher': 'best fit'
      })

      
      const sp = await ServiceProvider.query().where('id', payload.serviceProviderId)
        .preload('address').first()
      
      if(!sp) {
        throw `Aucun prestaire trouver avec l'id[${payload.serviceProviderId}]`
      }

      const message = await view.render('sms/client_devis', {
        ...payload, 
        address: sp.address, 
        date
      })
  
      const accountSid = Env.get('TWILIO_ACCOUNT_ID'); 
      const authToken = Env.get('TWILIO_AUTH_TOKEN'); 
      const client = twilio(accountSid, authToken);
      const messagingServiceSid = Env.get('TWILIO_MESSAGING_SERVICE_SID')
      
      try {
        await client.messages.create({body: message, messagingServiceSid, to: sp.tel})
      } catch (error) {
        //FIXME: verifier que le code 30001 est bien un entier dans la documentation
        if(error.code === 30001 || error.code === 'EAI_AGAIN') {
          //TODO:envoyer un email a l'administrateur
        }

        throw error
      }
  
      return response.redirect().toRoute('devis.client.success')
    }
    catch(err) {
      console.error(err)
      
      return response.redirect().toRoute('devis.client.error')
    }

  }

  
  public async success({view}:HttpContextContract) {
    return await view.render('devis/client/success')
  }

  
  public async error({view}:HttpContextContract) {
    return await view.render('devis/client/error')
  }
}
