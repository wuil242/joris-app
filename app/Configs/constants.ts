import { schema, rules} from '@ioc:Adonis/Core/Validator'

const MESSAGE_LENGTH = {
  MIN: 15,
  MAX: 255
}

export const PHONE_NUMBER_REGEX = /^(\+242)*(06|05|04|22)\d{7}$/
export const COUNTRY_CODE = '+242'

export const VALIDATION_SCHEMA = {
  EMAIL: {email: schema.string({trim: true}, [rules.email()])},
  TEL: {tel: schema.string({trim: true}, [rules.regex(PHONE_NUMBER_REGEX)])},
  MESSAGE: {message: schema.string({trim: true}, [
    rules.minLength(MESSAGE_LENGTH.MIN), rules.maxLength(MESSAGE_LENGTH.MAX)
  ])}
}

export const VALIDATION_MESSAGE  = {
  DEFAULT: {
    required: 'ce champ ne peut pas être vide!',
    email: 'cet email n\'est pas valide'
  },
  TEL: {
    'tel.regex': `ce numero n'est pas valide, exemple: (${COUNTRY_CODE})XXXXXXXXX`
  },
  MESSAGE: {
    'message.minLength': `message trop court, il doit contenir au moins ${MESSAGE_LENGTH.MIN} caratère`,
    'message.maxLength': `message trop Long, il doit contenir au plus ${MESSAGE_LENGTH.MAX} caratère`
  }
}