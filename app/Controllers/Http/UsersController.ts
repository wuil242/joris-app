import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserLoginValidator from 'App/Validators/UserLoginValidator'
import UserSignInValidator from 'App/Validators/UserSignInValidator'

//TODO: ajouter une ref qui permet de savoir ou rediriger apres une connexion reussite
export default class UsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const {lastname, firstname, email, password, tel, remember_me} = await request.validate(UserSignInValidator)
    const ref = request.qs().ref || '/'
    //TODO: ajouter la confirmation par mail

    const user = await User.create({lastname, firstname, email, password, tel})

    await auth.login(user, remember_me)

    return await response.redirect(ref)
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
