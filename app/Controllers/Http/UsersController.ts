import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import UserLoginValidator from 'App/Validators/UserLoginValidator'

export default class UsersController {

  
  public async store({response}:HttpContextContract) {
    return response.redirect('/')
  }
  
  public async login({request, auth, response}:HttpContextContract) {
      const remember_me = !!request.input('remember_me', false)
      const payload = await request.validate(UserLoginValidator)
      console.log('Remenber',   remember_me)
      await auth.use('web').attempt(payload.userId, payload.password)

      return response.redirect('/')
  }
}
