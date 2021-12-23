import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'
import Job from 'App/Models/Job'

export default class ServiceProvidersController {
  public async enrole({ view }: HttpContextContract) {
    return await view.renderRaw('<p> Enrole Service Provider</p>')
  }

  public async policy({view}: HttpContextContract) {
    return await view.renderRaw('<p>Policy of ServiceProvider')
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
