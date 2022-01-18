import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PHONE_NUMBER_REGEX } from 'App/Configs/constants'

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
		serviceProviderId: schema.number([rules.unsigned()]),
		lastname: schema.string({trim: true}, [rules.maxLength(20)]),
		firstname: schema.string({trim: true}, [rules.maxLength(30)]),
		tel: schema.string({trim: true}, [rules.regex(PHONE_NUMBER_REGEX)]),
		message: schema.string({trim: true}, [rules.maxLength(230)]),
		address: schema.string({trim: true}, [rules.maxLength(35)])
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
  public messages = {}
}
