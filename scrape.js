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
            console.log('Bot:: Going to URL...', process.env.SCRAPE_URL)

            // handle page load errors gracefully
            try {
                await page.goto(process.env.SCRAPE_URL)
                console.log('Bot:: Page loaded.')
            } catch (error) {
                console.log('Bot:: Failed to load webpage.')
                await browser.close();
                console.log('Bot:: Browser closed.')
                return false
            }
            
            let isAvailableToBuy = false
            try {
                // find "buy now" text on the page
                console.log('Bot:: Searching page for...', process.env.SCRAPE_FIND_TEXT)
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

            if (error.message) {

            }

            throw error
        }
    }
}
