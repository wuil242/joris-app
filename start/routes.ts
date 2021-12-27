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

Route.group(() => {
  Route.on('/').render('home/index')

  Route.get('/recherche', 'SearchesController.index').as('serviceProvider.find')

  Route.get('/devis/client', 'DevisController.clientDevisIndex').as('devis.client')
  Route.post('/devis/client', 'DevisController.clientDevisSubmit').as('devis.client.submit')
  Route.get('/devis/entreprise', 'DevisController.entrepriseDevisIndex').as('devis.entreprise')

  Route.get('/prestataire/enrolement', 'ServiceProvidersController.enrole').as('serviceProvider.enrole')
  Route.get('/prestataire/plotique-de-confidentialite', 'ServiceProvidersController.policy').as('serviceProvider.policy')

  Route.get('/contact-us', 'InfosController.contact').as('infos.contact-us')
  Route.get('/a-propos', 'InfosController.about').as('infos.about')
  Route.get('/politique-de-confidentialite', 'InfosController.policy').as('infos.policy')

}).middleware('silentAuth')

Route.group(() => {
  Route.get('/inscription', 'AuthController.index').as('sign-up')
  Route.post('/inscription', 'UsersController.store').as('sign-up.submit')

  Route.get('/connexion', 'AuthController.login').as('login')
  Route.post('/connexion', 'UsersController.login').as('login.submit')
}).middleware('userGuard')

Route.group(() => {
  Route.post('/logout', 'UsersController.logout').as('logout')
}).middleware('auth')

//connexion de l'utilisateur

//TODO: mettre en place l'inscription des utilisateurs
