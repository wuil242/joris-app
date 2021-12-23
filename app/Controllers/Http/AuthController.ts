import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async index({ view }: HttpContextContract) {
    return await view.render('auth/sign-up')
  }
  public async login({ view }: HttpContextContract) {
    return await view.render('auth/login')
  }
}
