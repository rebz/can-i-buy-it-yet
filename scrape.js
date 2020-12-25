const puppeteer = require('puppeteer')
const sms = require('./sms');

module.exports = {
    checkForBuyButton: async () => {
        try {

            const browser = await puppeteer.launch()
            console.log('Bot:: Launched browser.')

            const page = await browser.newPage()
            page.setViewport({
                width: 1920,
                height: 1080
            })
            console.log('Bot:: New page.')
            console.log('Bot:: Going to webpage...', process.env.SCRAPE_URL)

            await page.goto(process.env.SCRAPE_URL)
            console.log('Bot:: Went to webpage.')
            console.log('Bot:: Searching page for...', process.env.SCRAPE_FIND_TEXT)

            let isAvailableToBuy = false
            try {
                // find "buy now" text on the page
                isAvailableToBuy = await page.waitForFunction(
                    `() => document.querySelector('.product-details').innerText.includes(${process.env.SCRAPE_FIND_TEXT})`,
                    {},
                    null,
                );
            } catch (error) {
                isAvailableToBuy = false
            }
            console.log('Bot:: Available to buy...', !!isAvailableToBuy)
            
            const date = new Date()
            const dateString = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'_'+date.toLocaleTimeString("en-US").split(':').join('-').replace(' ', '')

            await page.screenshot({ path: `./screenshots/${isAvailableToBuy ? '_AVAILABLE_' : 'UNAVAILABLE_'}${dateString}.png` });
            console.log('Bot:: Saved Screenshot.')

            await browser.close();
            console.log('Bot:: Browser closed.')

            if (!isAvailableToBuy) return isAvailableToBuy

            await sms.send('Available to buy.')

            return isAvailableToBuy
            
        } catch (error) {
            throw error
        }
    }
}
