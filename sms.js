const {
    ACCOUNT_SID,
    AUTH_TOKEN,
    TO_NUMBER,
    FROM_NUMBER,
} = process.env

const twilio = require('twilio');

module.exports = {
    send: async (message) => {
        if (!message) throw '`message` not provided'

        try {
            const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);
            const msg = await client.messages.create({
                body: message,
                to: TO_NUMBER,
                from: FROM_NUMBER
            })

            console.log('SMS:: Sent SMS Message', { msg })
            
        } catch (error) {
            console.log('SMS:: Failed to send SMS message.', { error })
            throw error
        }
    }
}
