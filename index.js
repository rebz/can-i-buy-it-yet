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
		if (bot.wasAvailable && !isAvailable) {
			await sms.send('You missed your shot. No longer available... womp womp.')
		}

		// if now available, send a text message
		if (isAvailable && !bot.wasAvailable) {
			await sms.send('Available to buy.')
		}

		bot.wasAvailable = isAvailable
		
		// keep track of when the bot last ran
		bot.lastRun = Date.now()
		bot.isRunning = false
		console.log('Cron:: Bot end.')
		console.log('')
		console.log('')

	} catch (error) {
		sms.send('Error with bot.')
		console.log('Cron:: Error with bot.', { error })
		console.log('')
		console.log('')
		bot.isRunning = false
		bot.hasError = error
	}
});

job.start()

// App Setup
const app = express();

// Initialize http server
const server = http.createServer(app)


