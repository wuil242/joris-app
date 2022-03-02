/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

Route.get('/envoi-reussi', ({request, view }) => {
  const {title, description, message} = request.qs()
  return view.render('message', {title, description, type: 'success', message})
}).as('message.success')

Route.get('/envoi-echouer', ({request, view }) => {
  const {title, description, message} = request.qs()
  return view.render('message', {title, description, type: 'error', message})
}).as('message.error')

Route.group(() => {
  Route.get('/', async ({view}) => {
    const testimonies = await Database.from('testimonies').select('*').orderBy('id', 'desc').limit(4)
    return await view.render('home/index', {testimonies})
  })

  Route.get('/recherche', 'SearchesController.index').as('serviceProvider.find')

  Route.get('/devis/client', 'ClientDevisController.index').as('devis.client')
  Route.post('/devis/client', 'ClientDevisController.store')
       .middleware('BanCheck')
       .as('devis.client.submit')


  Route.get('/devis/entreprise', 'EntrepriseDevisController.index').as('devis.entreprise')
  Route.post('/devis/entreprise', 'EntrepriseDevisController.store')
       .middleware('BanCheck')
       .as('devis.entreprise.submit')


  Route.get('/prestataire/enrolement', 'ServiceProvidersController.index').as('serviceProvider.enroll')
  Route.get('/prestataire/plotique-de-confidentialite', 'ServiceProvidersController.policy').as('serviceProvider.policy')
  Route.post('/prestataire/enrolement', 'ServiceProvidersController.store')
       .middleware('BanCheck')
       .as('serviceProvider.enroll.submit')

  Route.get('/nous-contact%C3%A9', 'InfosController.contact').as('infos.contact-us')
  Route.get('/à-propos', 'InfosController.about').as('infos.about')
  Route.get('/politique-de-confidentialit%C3%A9e', 'InfosController.policy').as('infos.policy')

}).middleware('silentAuth')

Route.group(() => {
  Route.get('/inscription', 'AuthController.index').as('sign-up')
  Route.post('/inscription', 'UsersController.store').as('sign-up.submit')

  Route.get('/connexion', 'AuthController.login').as('login')
  Route.post('/connexion', 'UsersController.login').as('login.submit')

}).middleware(['userGuard', 'BanCheck'])

Route.group(() => {
  Route.post('/logout', 'UsersController.logout').as('logout')
}).middleware('auth')
