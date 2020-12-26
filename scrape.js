const {
    SCRAPE_FIND_TEXT,
    SCRAPE_URL
} = process.env
const puppeteer = require('puppeteer')

module.exports = {
    /**
     * return `true` = available
     * return `false` = unavailable
     * return `null` = couldn't determine
     */
    checkForBuyButton: async () => {
        try {

            // launch browser
            const browser = await puppeteer.launch()
            console.log('Bot:: Launched browser.')

            // new tab
            const page = await browser.newPage()
            page.setViewport({
                width: 1920,
                height: 1080
            })
            console.log('Bot:: New page.')
            console.log('Bot:: Going to URL...', SCRAPE_URL)

            // handle page load errors gracefully
            try {
                // go to url
                await page.goto(SCRAPE_URL)
                console.log('Bot:: Page loaded.')
            } catch (error) {
                console.log('Bot:: Failed to load webpage.')
                // close browser
                await browser.close();
                console.log('Bot:: Browser closed.')
                return null
            }

            let isAvailableToBuy = false
            try {
                // find "buy now" text on the page
                console.log('Bot:: Searching page for...', SCRAPE_FIND_TEXT)
                // run the following function in the browser
                isAvailableToBuy = await page.waitForFunction(
                    // only search a specific portion of the page for text
                    text => document.querySelector().innerText.includes(text),
                    {},
                    SCRAPE_FIND_TEXT,
                );
            } catch (error) {
                return null
            }
            console.log('Bot:: Available to buy...', !!isAvailableToBuy)

            // create a screenshot
            const date = new Date()
            const dateString = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'_'+date.toLocaleTimeString("en-US").split(':').join('-').replace(' ', '')
            await page.screenshot({ path: `./screenshots/${isAvailableToBuy ? '_AVAILABLE_' : 'UNAVAILABLE_'}${dateString}.png` });
            console.log('Bot:: Saved Screenshot.')

            // close the browser
            await browser.close();
            console.log('Bot:: Browser closed.')

            return isAvailableToBuy
            
        } catch (error) {
            throw error
        }
    }
}
