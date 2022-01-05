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

    Mail.sendLater(async message => {
      const res = {message: error.toSource(), to, body}
      message.from('log@iprovider.cg')
        .to('dev@iprovider.cg')
        .subject('email log')
        .htmlView('email/error', {error: res})
    })

    console.error(error)
    throw error
  }
}
