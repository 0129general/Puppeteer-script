const puppeteer = require('puppeteer');
const { actionSequences } = require('./actionSequence');

const { executeSequence } = require('./execute');

(async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 30 });

    const page = await browser.newPage();

    const session = await page.target().createCDPSession();
    await session.send('Browser.setWindowBounds', {
        windowId: (await session.send('Browser.getWindowForTarget')).windowId,
        bounds: { width: 1280, height: 720 },
    });

    await page.setViewport({
        width: 1280,   // Set the width of the viewport
        height: 720    // Set the height of the viewport
    });

    try {
        await page.goto('https://crowncoinscasino.com//');
        const actionSequence = actionSequences.Crown;
        for (let i = 0; i < actionSequence.length; i++) {
            await executeSequence(page, actionSequence[i]);
        }
    }
    catch (error) {
        console.log('Execution Failed.');
        console.error(error.message);
    }
    console.log('App Finished.');
})();