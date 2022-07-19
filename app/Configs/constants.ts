import { schema, rules } from '@ioc:Adonis/Core/Validator'


export const COUNTRY_CODE = '+242'

export const LOGIN_ERROR_MESSAGE = 'connexion impossible! l\'email, le numero de telephone ou le mot de passe est incorect, veuillez ressayer svp!'

const MESSAGE_LENGTH = { MIN: 15, MAX: 255 }

export const NAME_REGEX = /^[a-zA-Z\-]+[a-zA-Z]$/
export const NAME_MIN_LENGHTH = 3
export const NAME_MAX_LENGTH = 30

export const ADDRESS_MIN_LENGTH = 10
export const ADDRESS_MAX_LENGTH = 30

export const PHONE_NUMBER_REGEX = /^(\+242)?(06|05|04|22)\d{7}$/

export const PHONE_NUMBER_BAN_MESSAGE = `ce numero est bloquer contactez nous pour le debloquer`
export const EMAIL_BAN_MESSAGE = `cet adresse email est bloquer contactez nous pour le debloquer`

export const PASSWORD_MIN_LENGHT = 8
export const PASSWORD_MAX_LENGHT = 24
export const PASSWORD_REGEX = /^[a-zA-Z0-9\-]+$/ //FIXME: trouver une meilleur regex pour les password
export const PASSWORD_CONFIRM_FILED_NAME = 'password_confirm'

export const COMMENT_MAX_LENGTH = 255

export const VALIDATION_SCHEMA = {
  LASTNAME: {
    lastname: schema.string({ trim: true }, [
      rules.minLength(NAME_MIN_LENGHTH),
      rules.maxLength(NAME_MAX_LENGTH),
      rules.regex(NAME_REGEX)
    ])
  },
  FIRSTNAME: {
    firstname: schema.string({ trim: true }, [
      rules.minLength(NAME_MIN_LENGHTH),
      rules.maxLength(NAME_MAX_LENGTH),
      rules.regex(NAME_REGEX)
    ])
  },
  ADDRESS: {
    address: schema.string({ trim: true }, [
      rules.minLength(ADDRESS_MIN_LENGTH),
      rules.maxLength(ADDRESS_MAX_LENGTH)
    ])
  },
  EMAIL: {
    email: schema.string({ trim: true }, [rules.email()])
  },
  TEL: {
    tel: schema.string({ trim: true }, [rules.regex(PHONE_NUMBER_REGEX)])
  },
  MESSAGE: {
    message: schema.string({ trim: true }, [
      rules.minLength(MESSAGE_LENGTH.MIN),
      rules.maxLength(MESSAGE_LENGTH.MAX)
    ])
  },
  PASSWORD: {
    password: schema.string({ trim: true }, [
      rules.minLength(PASSWORD_MIN_LENGHT),
      rules.maxLength(PASSWORD_MAX_LENGHT),
      rules.regex(PASSWORD_REGEX)
    ])
  },
  PASSWORD_WITH_CONFIRM: {
    password: schema.string({ trim: true }, [
      rules.minLength(PASSWORD_MIN_LENGHT),
      rules.maxLength(PASSWORD_MAX_LENGHT),
      rules.regex(PASSWORD_REGEX),
      rules.confirmed(PASSWORD_CONFIRM_FILED_NAME),
    ])
  },
  POLICY: {
    policy: schema.boolean()
  },
  NOTE: { note: schema.number([rules.unsigned()]) },
}

export const VALIDATION_OPTIONAL_SCHEMA = {
  TEL: { tel: schema.string.optional({ trim: true }, [rules.regex(PHONE_NUMBER_REGEX)]) },
  EMAIL: { email: schema.string.optional({ trim: true }, [rules.email()]) },
  REMEMBER_ME: { remember_me: schema.boolean.optional() },
  COMMENT: { comment: schema.string.optional({ trim: true }, [rules.maxLength(COMMENT_MAX_LENGTH)]) }
}

export const VALIDATION_MESSAGE = {
  DEFAULT: {
    required: 'ce champ est requis!',
    email: 'cet email n\'est pas valide!',
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
    'tel.regex': `ce numero n'est pas valide, exemple: (${COUNTRY_CODE})XXXXXXXXX`,
    'tel.unique': `ce numero deja utiliser, saisissez un autre numero valide`
  },
  EMAIL: {
    'email.unique': 'cet email est deja utilise, veuillez saisir un autre email valide'
  },
  MESSAGE: {
    'message.minLength': `message trop court, il doit contenir au moins ${MESSAGE_LENGTH.MIN} caratère`,
    'message.maxLength': `message trop Long, il doit contenir au plus ${MESSAGE_LENGTH.MAX} caratère`
  },
  PASSWORD: {
    'password.minLength': `mot de passe trop court, il doit contenir au moisns ${PASSWORD_MIN_LENGHT} caractere`,
    'password.maxLength': `mot de passe trop long, il doit contenir au plus ${PASSWORD_MAX_LENGHT} caractere`,
    'password.regex': 'votre mot de passe non valide, doit contenir au moins des lettres et des chiffres',
    // 'password.confirmed': ,
    [PASSWORD_CONFIRM_FILED_NAME + '.confirmed']: 'mot de passe de confiramtion inccorect'
  },
  POLICY: {
    'policy.required': 'acceptez les condition d\'utilisation'
  },
  COMMENT: {
    'comment.maxLength': `commentaire trop long! ${COMMENT_MAX_LENGTH} caractères maximum`
  }
}
