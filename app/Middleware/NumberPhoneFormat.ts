import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {formatNumberPhone} from 'App/Helpers/helpers'

export default class NumberPhoneFormat {
  public async handle ({request}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const tel = request.input('tel')
    if(tel) {
      const body = request.body()
      body.tel = formatNumberPhone(tel)
      request.updateBody(body)
    }

    await next()
  }
}