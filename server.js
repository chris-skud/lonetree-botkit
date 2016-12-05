const Botkit = require('botkit')
const twilio = require('twilio')
const controller = Botkit.slackbot({debug: false})
const client = new twilio.RestClient(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const fromNum = process.env.TWILIO_FROM_NUMBER

controller.spawn({
  token: process.env.SLACK_VERIFY_TOKEN,
}).startRTM()

controller.hears('^sms',['direct_message'], function(bot, msg) {
  let parts = msg.text.split(' ')
  if (parts[1].length !== 10) {
    bot.reply(msg, 'invalid phone number')
  }

  client.sms.messages.create({
    to: `+1${parts[1]}`,
    from: `+1${fromNum}`,
    body: `${parts[2]}`
  }, function(error, message) {
    if (!error) {
      bot.reply(msg, 'message sent')
      console.log(message)
    } else {
      console.log(error)
    }
  })
})

controller.hears('pug me',['direct_message'], function(bot, msg) {
  var reply_with_attachments = {
    'username': 'Pug Bot' ,
    'text': 'Here comes the Pug',
    'attachments': [
      {
        'image_url': 'http://d21vu35cjx7sd4.cloudfront.net/dims3/MMAH/thumbnail/645x380/quality/90/?url=http%3A%2F%2Fs3.amazonaws.com%2Fassets.prod.vetstreet.com%2F3a%2F54%2F5ae8bfcc41b381c27a792e0dd891%2FAP-KWDHXS-645sm8113.jpg',
        'title': 'Here comes the Pug',
        'color': '#7CD197'
      }
    ],
  }

  bot.reply(msg, reply_with_attachments);
})
