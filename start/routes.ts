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

  // Route.get('/recherche/q', 'SearchesController.getSearch').as('serviceProvider.search')
  // Route.get('/recherche/q', 'SearchesController.search').as('serviceProvider.search')

  Route.group(() => {
    Route.get('/city/:name/arrs', 'ApisController.getAllArrs')
    Route.get('/arrondissement/:name/quaters', 'ApisController.getAllQuaters')
  }).prefix('api')
}).middleware('silentAuth')

Route.group(() => {
  Route.post('/logout', 'UsersController.logout').as('logout')
}).middleware('auth')

Route.group(() => {
  Route.get('/inscription', 'AuthController.index').as('sign-up')
  Route.post('/sign-up', 'UsersController.store')

  Route.get('/connexion', 'AuthController.login').as('login')
  Route.post('/login', 'UsersController.login')
}).middleware('userGuard')

//connexion de l'utilisateur

//TODO: mettre en place l'inscription des utilisateurs
