const { performClick } = require('./handleActions/click');
const { performFindText } = require('./handleActions/findText');
const { navigateToURL } = require('./handleActions/navigate');
const { inputCredentials } = require('./handleActions/typing');

async function executeSequence(page, action) {
    //await waitForInternetConnection();

    const delay = Math.random() * 2 * 1000;
    // Mimic human-like interaction delay
    await new Promise((resolve) =>
        setTimeout(resolve, action.duration || 3000 + delay)
    );

    // Map action types to their corresponding functions
    const actionMap = {
        clickButton: async () => {
            console.log("Clicking button...");
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 })
                    .then(() => {
                        console.log('Navigation occurred');
                    })
                    .catch(() => {
                        console.log('Navigation did not occur');
                        if (action.isLogin === true) {
                            throw new Error("Login Failed.");
                        }
                    }),
                performClick(page, action)
            ]);
            console.log("Click Finished.");
        },
        findVal: async () => {
            console.log("Finding value...");
            await performFindText(page, action);
        },
        navigate: async () => {
            console.log("Navigating to URL...");
            await navigateToURL(page, action);
            console.log("Navigation Finished.");
        },
        windowClose: async () => {
            console.log("Closing window...");
            //chrome.tabs.remove(tabId);
            return;
        },
        type: async () => {
            console.log("Typing credentials...");
            await inputCredentials(page, 'jiahw315@gmail.com', 'Techguru1!', action.userSelector, action.passSelector);
        },
        switchTab: async () => {
            console.log(`Switching to OAuth tab...`);

            try {
                //const newTabId = await switchTab(action, originalTabId);
                //console.log("Switched to tab with ID:", newTabId);

                // Perform actions on the new tab using newTabId
                // After the new tab is closed, the tab will automatically switch back to originalTabId
            } catch (error) {
                console.error("Error switching tabs:", error.message);
            }
        },
    };
    // Execute the action if it exists in the map
    if (actionMap[action.action]) {
        await actionMap[action.action]();
    } else {
        throw new Error(`Unknown action type: ${action.action}`);
    }

    // Proceed to the next action in the sequence
}

//Helper function check if internet connection is available
const checkInternetConnection = () => {
    return fetch("https://www.google.com", {
        mode: "no-cors",
        cache: "no-store",
    })
        .then(() => true)
        .catch(() => false);
};

// Helper function to wait for internet connection
const waitForInternetConnection = async (maxAttempts = 10, interval = 5000) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (await checkInternetConnection()) {
            //console.log("Internet connection established.");
            return;
        }
        console.log(
            `No internet connection. Retrying in ${interval / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error(
        "Failed to establish internet connection after multiple attempts."
    );
};

module.exports = {
    executeSequence,
}