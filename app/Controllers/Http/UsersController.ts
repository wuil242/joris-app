import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LOGIN_ERROR_MESSAGE } from 'App/Configs/constants'
import User from 'App/Models/User'
import UserLoginValidator from 'App/Validators/UserLoginValidator'
import UserSignInValidator from 'App/Validators/UserSignInValidator'

//TODO: ajouter une ref qui permet de savoir ou rediriger apres une connexion reussite
export default class UsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    //FIXME: formatter correctement le numero de telephone pendant la verification
    const {lastname, firstname, email, password, tel, remember_me} = await request.validate(UserSignInValidator)
    const ref = request.qs().ref || '/'
    //TODO: ajouter la confirmation par mail

    const user = await User.create({lastname, firstname, email, password, tel})

    await auth.login(user, remember_me)

    return await response.redirect(ref)
  }

  public async login({ request, auth, response, session }: HttpContextContract) {
    const ref = request.qs().ref || '/'
    //FIXME: formatter correctement le numero de telephone pendant la verification
    const payload = await request.validate(UserLoginValidator)
    console.log(payload)
    let user: User | null = null

    try {
      user = await auth.verifyCredentials(payload.userId, payload.password)
    } catch(err) {
      session.flash('form_global_error', LOGIN_ERROR_MESSAGE)
      return response.redirect().back()
    }

    await auth.login(user, payload.remember_me)
    return response.redirect(ref)
  }

  public async logout({ request, auth, response }: HttpContextContract) {
    const ref = request.qs().ref || '/'
    await auth.logout()
    return response.redirect(ref)
  }
}
