import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import { VALIDATION_SCHEMA, VALIDATION_OPTIONAL_SCHEMA, VALIDATION_MESSAGE } from 'App/Configs/constants'
import ROLES from 'App/Configs/roles'
import { formatNumberPhone, getFormatedDateTime } from 'App/Helpers/helpers'
import { sendMessage } from 'App/Services/Twilio'
import {string} from '@ioc:Adonis/Core/Helpers'
import ServiceProviderVote from 'App/Models/ServiceProviderVote'

export default class ServiceProvidersController {
  private COMMENT_LIMIT = 5

  public async index({ view }: HttpContextContract) {
    return await view.render('service_provider/enroll')
  }

  public async policy({ view }: HttpContextContract) {
    return await view.render('service_provider/policy')
  }

  public async store({ request, view, response }: HttpContextContract) {
    const validator = schema.create({
      ...VALIDATION_SCHEMA.FIRSTNAME,
      ...VALIDATION_SCHEMA.LASTNAME,
      ...VALIDATION_SCHEMA.TEL,
      ...VALIDATION_OPTIONAL_SCHEMA.EMAIL
    })

    const messages = {
      ...VALIDATION_MESSAGE.FIRSTNAME,
      ...VALIDATION_MESSAGE.LASTNAME,
      ...VALIDATION_MESSAGE.TEL,
      ...VALIDATION_MESSAGE.DEFAULT
    }

    const validation = await request.validate({ schema: validator, messages })

    const formatedTel = formatNumberPhone(validation.tel)
    validation.tel = formatedTel

    try {
      //FIXME: trouver le numero d'administrateur de facon plus correct

      const role = await Database.from('admin_roles').select('*')
        .where('name', ROLES.SMS_RECEIVER_PROVIDER_ENROLL).firstOrFail()

      const admins = await Database.from('admin_roles_directus_users')
        .select('*')
        .join('directus_users', 'admin_roles_directus_users.directus_users_id', 'directus_users.id')
        .where('admin_roles_id', role.id)


      if (admins.length <= 0) throw 'E_ROLE_NOT_EXIST'
      
      const enroll_code = string.generateRandom(7).replace('-', '')
      const date = getFormatedDateTime()
      const body = await view.render('sms/service_provider_enroll', {date, ...validation, enroll_code})
      for await (const admin of admins) {
        await sendMessage({ to: admin.tel_1, body })
      }

      await Database.table('service_provider_enrolments')
        .insert({...validation, enroll_code})
        .returning('id')

      const message = 'Votre demande d\'enrolement a ete envoi avec success'
      const description = 'enrolement reussi'
      return response.redirect().toRoute('message.success', {
        qs: { description, message }
      })

    } catch (error) {
      // throw error
      const message = 'Votre demande d\'enrolement n\'a pas pu etre envoyer'
      const description = 'enrolement echouer'
      return response.redirect().toRoute('message.error', {
        qs: { description, message }
      })
    }
  }

  public async vote({request, response, auth}: HttpContextContract) {

    const validation = schema.create({
      serviceProviderId: schema.number([rules.unsigned()]),
      ...VALIDATION_SCHEMA.NOTE,
      ...VALIDATION_OPTIONAL_SCHEMA.COMMENT
    })

    const messages = {...VALIDATION_MESSAGE.COMMENT}
    console.log('IN', request.all())
    const payload = await request.validate({schema: validation, messages})

    if(payload.note < 1) {
      payload.note = 1
    } else if(payload.note > 5) {
      payload.note = 5
    }

    await ServiceProviderVote.create({...payload, userId: auth.user?.id})

    return response.redirect().back()
  }

  public async comments({view, params, response}: HttpContextContract) {
    const id = params.serviceProviderId
    let page = params.page || 1

    if(page <= 0) page = 1
    
    const votes = await ServiceProviderVote.query()
                    .where('serviceProviderId', id)
                    .whereNotNull('comment')
                    .preload('user')
                    .orderBy('id', 'desc')
                    .paginate(page, this.COMMENT_LIMIT)
                    
    const html = await view.render('service_provider/comments', {votes})
    return response.json({html})
  }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
