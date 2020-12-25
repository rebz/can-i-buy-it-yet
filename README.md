# Bot to Check if a Product is Available

> Using Twilio and Puppeteer, send me a text message when a "BUY NOW" button appears on the page.

* Will send a text if there is an error.
* Will send a text if it was available and is no longer.
* Creates a screenshot called `UNAVAILABLE_{datetime}.png` if not available. May want to tone this down...
* Creates a screenshot called `_AVAILABLE_{datetime}.png` if it is available.

## Setup and Run

1. `npm i`
1. Clone `cp .env.example .env`
1. Setup a twilio account
1. Update ENV variables
1. `npm run dev`