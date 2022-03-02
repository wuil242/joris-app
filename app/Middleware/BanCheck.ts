import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { EMAIL_BAN_MESSAGE, PHONE_NUMBER_BAN_MESSAGE } from 'App/Configs/constants'
import { formatNumberPhone } from 'App/Helpers/helpers'
import type { FormInputError } from 'App/types/form'

export default class BanCheck {
  public async handle ({ request, session, response }: HttpContextContract, next: () => Promise<void>) {
    const payload = {
      tel: request.input('tel'),
      email: request.input('email')
    }

    if(payload.tel) {
      payload.tel = formatNumberPhone(payload.tel)
      const banTel = await Database.from('blacklist_tel').where('tel', payload.tel).first()
      if(banTel) {
        const err: FormInputError = { message: PHONE_NUMBER_BAN_MESSAGE, link: true }
        session.flash('errors', {"tel": [ err ]})
        session.flashAll()
        return response.redirect().back()
      } 
    }

    if(payload.email) {
      const banEmail = await Database.from('blacklist_email').where('email', payload.email).first()
      if(banEmail) {
        const err: FormInputError = { message: EMAIL_BAN_MESSAGE, link: true }

        session.flash('errors', {"email": [ err ]})
        session.flashAll()
        return response.redirect().back()
      }
    }

    await next()
  }
}
