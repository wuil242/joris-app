import Mail from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env'
import twilio from 'twilio';
const accountSid = Env.get('TWILIO_ACCOUNT_ID'); 
const authToken = Env.get('TWILIO_AUTH_TOKEN');
const messagingServiceSid = Env.get('TWILIO_MESSAGING_SERVICE_SID')
const client = twilio(accountSid, authToken);
      
interface TwilioMessage {
  to:string,
  body: string,
}

export async function sendMessage({to, body}: TwilioMessage) {
  const message = {to, body, messagingServiceSid}

  try {
    const result = await client.messages.create(message)
    return Promise.resolve(result)
  } catch (error) {

    try {
      Mail.sendLater(async message => {
        const res = {message: error.message, stack: error.stack, to}
        message.from('log@iprovider.cg')
          .to('dev@iprovider.cg')
          .subject('email log')
          .htmlView('email/twillio_error', {error: res, body})
      })
    } catch (error) {
      console.error(error)
      throw error      
    }

    throw error
  }
}
