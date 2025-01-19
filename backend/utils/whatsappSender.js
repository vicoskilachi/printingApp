const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;

const client = twilio(accountSid, authToken);

const whatsappSender = (to, message) => {
  client.messages
    .create({
      from: `whatsapp:${fromWhatsApp}`,
      to: `whatsapp:${to}`,
      body: message,
    })
    .then((message) => console.log(`Message sent: ${message.sid}`))
    .catch((error) => console.error(`Error: ${error.message}`));
};

module.exports = whatsappSender;
