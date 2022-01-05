import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import { COUNTRY_CODE, PHONE_NUMBER_REGEX } from 'Config/config'

export default class BanCheck {
  public async handle ({request, session, response, view}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const payload = await request.validate({
      schema: schema.create({
        tel: schema.string.optional({trim: true}, [rules.regex(PHONE_NUMBER_REGEX)]),
        email: schema.string.optional({trim: true}, [rules.email()])
      })
    })

    if(payload.tel) {
      payload.tel = payload.tel.includes(COUNTRY_CODE) ? payload.tel : COUNTRY_CODE + payload.tel
      const banTel = await Database.from('blacklist_tel').where('tel', payload.tel).first()
      if(banTel) {
        const data = {
          value: payload.tel,
          message: 'Le numero'
        }
        session.flash('alert', {type: 'error', message: await view.render('alert/ban', {...data})})
        session.flashAll()
        return response.redirect().back()
      } 
    }

    if(payload.email) {
      const banEmail = await Database.from('blacklist_email').where('email', payload.email).first()
      if(banEmail) {
        const data = {
          value: payload.email,
          message: 'L\' email'
        }
        session.flash('message',{message: await view.render('alert/ban', {...data})})
        session.flashAll()
        return response.redirect().back()
      }
    }

    await next()
  }
}
