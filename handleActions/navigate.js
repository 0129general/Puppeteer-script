async function navigateToURL(page, action) {
    await page.goto(action.URL, { waitUntil: 'networkidle2' }); // Wait for the page to load
}

module.exports = {
    navigateToURL,
}