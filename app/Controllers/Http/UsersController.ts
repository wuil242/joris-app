import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserLoginValidator from 'App/Validators/UserLoginValidator'
import UserSignInValidator from 'App/Validators/UserSignInValidator'

//TODO: ajouter une ref qui permet de savoir ou rediriger apres une connexion reussite
export default class UsersController {
  public async store({ request, view, response, session }: HttpContextContract) {
    const payload = await request.validate(UserSignInValidator)

    const policy = request.input('policy') === 'on'
    if (!policy) {
      for (const item in payload) {
        session.flash(item, payload[item])
      }
      session.flash('errors.policy', 'accepter la policy')
      return response.redirect().back()
    }
    //TODO: ajouter la confirmation par mail
    const user = await User.create(payload)

    return await view.render('user/confirmation', { user })
  }

  public async login({ request, auth, response, session }: HttpContextContract) {
    const rememberMe = !!request.input('remember_me', false)
    const payload = await request.validate(UserLoginValidator)
    const user = await auth.verifyCredentials(payload.userId, payload.password)

    if (!user.confirmed) {
      session.flash('errors.accout', 'not confirm')
      return response.redirect().back()
    }

    await auth.login(user, rememberMe)
    return response.redirect('/')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/')
  }
}
