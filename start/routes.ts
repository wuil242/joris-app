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

Route.get('/', async ({ view }) => {
  return view.render('home/index')
})

Route.get('/sign-up', 'AuthController.index').as('sign-up')
Route.get('/login', 'AuthController.login').as('login')

//connexion de l'utilisateur
Route.post('/login', 'UsersController.login')

//TODO: mettre en place l'inscription des utilisateurs
Route.post('/sign-up', 'UsersController.store')
