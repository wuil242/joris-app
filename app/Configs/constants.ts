import { schema, rules} from '@ioc:Adonis/Core/Validator'

const MESSAGE_LENGTH = {
  MIN: 15,
  MAX: 255
}

const NAME_REGEX = /^[a-zA-Z\-]+[a-zA-Z]$/

export const PHONE_NUMBER_REGEX = /^(\+242)*(06|05|04|22)\d{7}$/
export const COUNTRY_CODE = '+242'

export const PHONE_NUMBER_BAN_MESSAGE = `ce numero est bloquer contactez nous pour le debloquer`
export const EMAIL_BAN_MESSAGE = `cet adresse email est bloquer contactez nous pour le debloquer`

export const VALIDATION_SCHEMA = {
  LASTNAME: {
    lastname: schema.string({trim: true}, [rules.minLength(3), rules.maxLength(20), rules.regex(NAME_REGEX)])
  },
  FIRSTNAME: {
    firstname: schema.string({trim: true}, [rules.minLength(3), rules.maxLength(30), rules.regex(NAME_REGEX)])
  },
  ADDRESS: {
    address: schema.string({trim: true}, [rules.minLength(10), rules.maxLength(35)])
  },
  EMAIL: {
    email: schema.string({trim: true}, [rules.email()])
  },
  TEL: {
    tel: schema.string({trim: true}, [rules.regex(PHONE_NUMBER_REGEX)])
  },
  MESSAGE: {message: schema.string({trim: true}, [
    rules.minLength(MESSAGE_LENGTH.MIN), rules.maxLength(MESSAGE_LENGTH.MAX)
  ])}
}

export const VALIDATION_OPTIONAL_SCHEMA = {
  TEL: {tel: schema.string.optional({trim: true}, [rules.regex(PHONE_NUMBER_REGEX)])},
  EMAIL: {
    email: schema.string.optional({trim: true}, [rules.email()])
  }
}

export const VALIDATION_MESSAGE  = {
  DEFAULT: {
    required: 'ce champ est requis!',
    email: 'cet email n\'est pas valide!'
  },
  LASTNAME: {
    'lastname.minLength': `nom trop court, il doit contenir au moins ${MESSAGE_LENGTH.MIN} caratère`,
    'lastname.maxLength': `nom trop Long, il doit contenir au plus ${MESSAGE_LENGTH.MAX} caratère`,
    'lastname.regex': `le nom ne peu contenir que des letters et des tirets(-), mais pas de tiret à la fin.`
  },
  FIRSTNAME: {
    'firstname.minLength': `prénom trop court, il doit contenir au moins ${MESSAGE_LENGTH.MIN} caratère`,
    'firstname.maxLength': `prénom trop Long, il doit contenir au plus ${MESSAGE_LENGTH.MAX} caratère`,
    'firstname.regex': `le prénom ne peu contenir que des letters et des tirets(-), mais pas de tiret à la fin.`
  },
  TEL: {
    'tel.regex': `ce numero n'est pas valide, exemple: (${COUNTRY_CODE})XXXXXXXXX`
  },
  MESSAGE: {
    'message.minLength': `message trop court, il doit contenir au moins ${MESSAGE_LENGTH.MIN} caratère`,
    'message.maxLength': `message trop Long, il doit contenir au plus ${MESSAGE_LENGTH.MAX} caratère`
  },

}
