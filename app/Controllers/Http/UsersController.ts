import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LOGIN_ERROR_MESSAGE, PHONE_NUMBER_REGEX } from 'App/Configs/constants'
import { formatNumberPhone } from 'App/Helpers/helpers'
import User from 'App/Models/User'
import UserLoginValidator from 'App/Validators/UserLoginValidator'
import UserSignInValidator from 'App/Validators/UserSignInValidator'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import got, { Method } from 'got'
import FormData from 'form-data'
import Drive from '@ioc:Adonis/Core/Drive'
import UserUpdateValidator from 'App/Validators/UserUpdateValidator'
import { AlertMesage } from 'App/types/app'

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
    const ref = request.qs().ref || '/'

    const payload = await request.validate(UserLoginValidator)

    let user: User | null = null


    if(PHONE_NUMBER_REGEX.test(payload.userId)) {
      payload.userId = formatNumberPhone(payload.userId)
    }

    try {
      user = await auth.verifyCredentials(payload.userId, payload.password)
    } catch(err) {
      session.flash('form_global_error', LOGIN_ERROR_MESSAGE)
      return response.redirect().toRoute('login', {qs: {ref}})
    }

    await auth.login(user, payload.remember_me)
    return response.redirect(ref)
  }

  public async logout({ request, auth, response }: HttpContextContract) {
    const ref = request.qs().ref || '/'
    await auth.logout()
    return response.redirect(ref)
  }

  public async profil({view}: HttpContextContract) {
    return view.render('user/profil')
  }

  public async resetPassword({view}: HttpContextContract) {
    return view.render('user/reset_password')
  }

  public async update({request, auth, session, response}: HttpContextContract) {
    const payload = await request.validate(UserUpdateValidator)
    
    try {
      await auth.user?.merge(payload)
      await auth.user?.save()
      const message: AlertMesage = {message: 'Profil mise a jour', type: 'success'}
      session.flash('alert', message)
    } catch (error) {
      //TODO: alerter l'admin lors de l'erreur
      const message: AlertMesage = {message: 'Erreur inconnu', type: 'error'}
      session.flash('alert', message)
    }
    
    return response.redirect().back()
  }

  //FIXME: upload correct des images
  public async imageUpdate({request, response, session, auth}: HttpContextContract) {
    //FIXME: Nullabe file
    const validation = schema.create({
      profil_image: schema.file.optional(
        { size: '2mb', extnames: ['jpg', 'jpeg', 'png'] }, 
        )
    })
    
    const messages = {
      'file.extname': 'Le fichier envoyer doit etre une image au format {{options.extnames}}',
      'file.size': 'Le fichier envoyer est trop volumineux, l\'image doit avoir un poids d\'aumoins {{options.size}}'
    }

    const payload = await request.validate({schema: validation, messages})
   
    if(!payload.profil_image) {
      // TODO: remove image profil
      session.flash('msg', 'TODO: Reset File')
    }
    else {
      session.flash('msg', 'FIXME: upload correct des images')
    }

    return response.redirect().back()
  }
}
