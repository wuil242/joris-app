import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import City from 'App/Models/City'
import { sendMessage } from 'App/Services/twilio'
import EntrepriseDeviValidator from 'App/Validators/EntrepriseDeviValidator'
import { COUNTRY_CODE } from 'Config/config'

export default class EntrepriseDevisController {

  public async index({ view }: HttpContextContract) {
    const cities = await City.query().orderBy('name', 'asc')
    return await view.render('devis/entreprise/index', {cities})
  }

  public async store({session, request, view, response}: HttpContextContract) {
    const payload = await request.validate(EntrepriseDeviValidator)

    payload.tel = payload.tel.includes(COUNTRY_CODE) ? payload.tel : COUNTRY_CODE + payload.tel

    const city = await City.findOrFail(payload.cityId)

    const contact = await Database.from('entreprise_devis_contact').select('tel')
      .where('city_id', city.id).first()

    if(!contact) {
      session.flash('alert', {type: 'info', message: 'ville non pris en charge'})
      session.flashAll()
      return response.redirect().back()
    }

    const date = new Date().toLocaleDateString('fr-FR', {
      month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
    })
    const body = await view.render('sms/entreprise_devis', {date, city, ...payload})

    

    try {
      await sendMessage({to: contact.tel as string, body})
      Database.table('entreprise_devis').insert({
        email: payload.email,
        tel: payload.tel,
        message: payload.message,
        'city_id': payload.cityId
      }).then()
      
      return response.redirect().toRoute('devis.entreprise.success')
    } catch (error) {
     

      return response.redirect().toRoute('devis.entreprise.error')
    }
  }

  public async success({view}:HttpContextContract) {
    return await view.render('devis/message', { type: 'success' })
  }
  
  public async error({view}:HttpContextContract) {
    return await view.render('devis/message', { type: 'error' })
  }
}
