/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  SESSION_DRIVER: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  DB_CONNECTION: Env.schema.string(),

  //smtp
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string() ,
  SMTP_PASSWORD: Env.schema.string() ,

  //nom de domain et port sur le quelle est servie le backoffice
  DIRECTUS_BASE_URL: Env.schema.string({format: 'url'}),
  DIRECTUS_FILES_URL: Env.schema.string({format: 'url'}),
  DIRECTUS_ASSETS_URL: Env.schema.string({format: 'url'}),
  DIRECTUS_ACCESS_TOKEN: Env.schema.string(),

  //twilio
  TWILIO_ACCOUNT_ID: Env.schema.string(),
  TWILIO_AUTH_TOKEN: Env.schema.string(),
  TWILIO_MESSAGING_SERVICE_SID: Env.schema.string(),
})
