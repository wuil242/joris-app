import Mail from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env'
import twilio from 'twilio';
const accountSid = Env.get('TWILIO_ACCOUNT_ID'); 
const authToken = Env.get('TWILIO_AUTH_TOKEN');
const messagingServiceSid = Env.get('TWILIO_MESSAGING_SERVICE_SID'),
const client = twilio(accountSid, authToken);
      
interface TwilioMessage {
  to:string,
  body: string,
  error:any
}

export default async function sendMessage({to, body}: TwilioMessage) {
  const message = {to, body, messagingServiceSid}

  try {
    return client.messages.create(message)
  } catch (error) {
    //FIXME: verifier que le code 30001 est bien un entier dans la documentation
    if(error.code === 30001 || error.code === 'EAI_AGAIN') {
      //TODO:envoyer un email a l'administrateur
      Mail.sendLater(async message => {
        const res = {message: error.message, error}
        message.from('log@iprovider.cg')
          .to('dev@iprovider.cg')
          .subject('email log')
          .htmlView('email/error', {error: res})
      })
    }

    throw error
  }
}