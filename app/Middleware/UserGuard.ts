import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserGuard {
  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const isLoggedIn = await auth.check()

    if(isLoggedIn) {
      return response.redirect('/profil/dashboard')
    }

    await next()
  }
}
