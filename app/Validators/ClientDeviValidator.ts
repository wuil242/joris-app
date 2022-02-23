import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { VALIDATION_MESSAGE, VALIDATION_SCHEMA } from 'App/Configs/constants'

export default class ClientDeviValidator {
  constructor (protected ctx: HttpContextContract) {
  }

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
  public schema = schema.create({
		serviceProviderIds: schema.array().members(schema.number([rules.unsigned()])),
		...VALIDATION_SCHEMA.LASTNAME,
		...VALIDATION_SCHEMA.FIRSTNAME,
		...VALIDATION_SCHEMA.TEL,
		...VALIDATION_SCHEMA.MESSAGE,
		
  })

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
  public messages = {
		...VALIDATION_MESSAGE.DEFAULT,
		...VALIDATION_MESSAGE.FIRSTNAME,
		...VALIDATION_MESSAGE.LASTNAME,
		...VALIDATION_MESSAGE.TEL,
		...VALIDATION_MESSAGE.MESSAGE,
	}
}
