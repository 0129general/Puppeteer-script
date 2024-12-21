async function simulateTypingElement(elementHandle, text) {
    const element = await elementHandle.asElement();
    if (!element) {
        throw new Error("Element not found");
    }

    // Clear the input field
    await element.evaluate(el => el.value = "");

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Dispatch keydown event
        await element.evaluate((el, char) => {
            const event = new KeyboardEvent("keydown", {
                key: char,
                code: `Key${char.toUpperCase()}`,
                bubbles: true,
            });
            el.dispatchEvent(event);
        }, char);

        // Update the input field's value
        await element.evaluate((el, char) => el.value += char, char);

        // Dispatch input event
        await element.evaluate(el => {
            const event = new Event("input", { bubbles: true });
            el.dispatchEvent(event);
        });

        // Dispatch keyup event
        await element.evaluate((el, char) => {
            const event = new KeyboardEvent("keyup", {
                key: char,
                code: `Key${char.toUpperCase()}`,
                bubbles: true,
            });
            el.dispatchEvent(event);
        }, char);

        // Mimic human typing speed
        await new Promise(resolve => setTimeout(resolve, Math.random() * 10 + 20));
    }
}

async function simulateTyping(page, selector, text) {
    const elements = await page.$$(selector);
    if (elements.length === 0) {
        throw new Error(`Elements not found for selector: ${selector}`);
    }

    for (const element of elements) {
        await simulateTypingElement(element, text);
    }

    console.log(`Typing completed for selector: ${selector}`);
}

// Handles typing user and password credentials into input fields
async function inputCredentials(page, userText, passText, userSelector, passSelector) {
    try {
        await simulateTyping(page, userSelector, userText);
    } catch (error) {
        console.error(`Error typing user credentials: ${error.message}`);
    }

    try {
        await simulateTyping(page, passSelector, passText);
    } catch (error) {
        console.error(`Error typing password credentials: ${error.message}`);
    }
}

module.exports = {
    inputCredentials,
};