const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY



sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dev@shoebill.nl',
        subject: 'Welcome to the app!',
        html: '<h1>Wat een gelul</h1>'
    })

}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'dev@shoebill.nl',
        subject: 'We are sorry to see you go!',
        text: 'Is there anything we can do?'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}