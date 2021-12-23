import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InfosController {

  public async contact({view}: HttpContextContract) {
    return await view.renderRaw('<p>Contatc of site</p>')
  }

  public async about({view}: HttpContextContract) {
    return await view.renderRaw('<p>About  of site</p>')
  }

  public async policy({view}: HttpContextContract) {
    return await view.renderRaw('<p>About  of site</p>')
  }
}
