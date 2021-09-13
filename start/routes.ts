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
  Route.get('/', async ({view }) => {
    return view.render('home/index')
  })

  Route.get('/search', 'ServiceProvidersController.index').as('serviceProvider.find')

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
