const express = require('express');
const http = require('http');
const scrape = require('./scrape');
const sms = require('./sms');
const CronJob = require('cron').CronJob;

const bot = {
	wasAvailable: false,
	isRunning: false,
	lastRun: null,
	hasError: false
}

const job = new CronJob('1 * * * * *', async () => {
	console.log('Cron:: Job start.')

	try {

		// dont run the bot if it is already running or has an error
		if (bot.isRunning || bot.hasError) return

		// check when the bot last ran, allow X time to pass before running again
		if (bot.lastRun) {

			const diffInMillis = Date.now() - bot.lastRun
			const diffInSeconds = Math.floor(diffInMillis / 1000)

			if (diffInSeconds < 30) {
				console.log('Cron:: Wait to run bot.');
				return
			}
		}

		//
		bot.isRunning = true
		console.log('Cron:: Run bot.')

		// perform buy check
		const isAvailable = await scrape.checkForBuyButton()

		// if it was available but is no longer, send a text message
		if (bot.wasAvailable && !bot.isAvailable) {
			sms.send('You missed your shot. No longer available... womp womp.')
		}
		bot.wasAvailable = isAvailable
		
		// keep track of when the bot last ran
		bot.lastRun = Date.now()
		bot.isRunning = false

	} catch (error) {
		console.log('Cron:: Error with bot.', { error })
		sms.send('Error with bot.')
		bot.isRunning = false
		bot.hasError = error
		
	} finally {
		console.log('Cron:: Job end.')
		console.log('')
		console.log('')
	}
});

job.start()

// App Setup
const app = express();

// Initialize http server
const server = http.createServer(app)


