import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InfosController {

  public async contact({view}: HttpContextContract) {
    return await view.render('infos/contact_us')
  }

  public async about({view}: HttpContextContract) {
    return await view.render('infos/about')
  }

  public async policy({view}: HttpContextContract) {
    return await view.render('infos/policy')
  }
}
