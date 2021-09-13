import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserSignInValidator {
  constructor(protected ctx: HttpContextContract) {}

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
    lastname: schema.string({ trim: true }, [rules.minLength(4), rules.maxLength(60)]),
    firstname: schema.string({ trim: true }, [rules.minLength(4), rules.maxLength(60)]),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    tel: schema.string.optional({}, [
      rules.minLength(9),
      rules.maxLength(9),
      rules.unique({ table: 'users', column: 'tel' }),
      //FIXME: verififier que le numero est bien un nombre a 9 chiffre
      rules.regex(/^0(6|5|4)[0-9]+$/),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
      rules.maxLength(60),
      rules.confirmed('password_confirm'),
    ]),
    // policy: schema.string({}, [rules.equalTo('on')])
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
