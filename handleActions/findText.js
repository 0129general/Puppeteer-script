const puppeteer = require('puppeteer');

async function performFindText(page, options) {
	const {
		element,
		attribute,
		selectorText,
		textContents,
		slug,
		parentElement,
		parentAttribute,
		parentSelectorText,
	} = options;
	let texts = [];

	async function extractTexts(elements) {
		for (const el of elements) {
			const html = await el.evaluate(el => el.outerHTML);
			console.log(html);
			const text = await el.evaluate(el => el.textContent.trim());
			if (
				textContents
					? text.toLowerCase().includes(textContents.toLowerCase())
					: true
			) {
				texts.push(text);
			}
		}
	}

	async function findElementsWithParent(parentSelector, childSelector) {
		const parents = await page.$$(parentSelector);
		for (const parent of parents) {
			const children = await parent.$$(childSelector);
			console.log(parentSelector, childSelector);
			await extractTexts(children);
		}
	}

	if (parentElement && parentAttribute && parentSelectorText) {
		console.log(`${parentElement}[${parentAttribute}*="${parentSelectorText}"]`, element);
		await findElementsWithParent(
			`${parentElement}[${parentAttribute}*="${parentSelectorText}"]`,
			element || "*"
		);
	} else if (element && attribute && selectorText) {
		console.log(`${element}[${attribute}*="${selectorText}"]`);
		const elements = await page.$$(
			`${element}[${attribute}*="${selectorText}"]`
		);
		await extractTexts(elements);
	} else if (element) {
		const elements = await page.$$(element);
		await extractTexts(elements);
	}

	console.log(`Texts found for ${slug}:`, texts);
	const finalSum = universalFilter(texts, slug);
	console.log("Collected: ", finalSum);
	return finalSum;
}

// Filters and finds the smallest non-zero number from the text content
function universalFilter(texts, slug) {

	texts.forEach((text) => {
		// Match "SC" optionally surrounded by spaces, or numbers followed/preceded by "SC"
		const regex = /(SC\s?\d+(\.\d+)?|\d+(\.\d+)?\s?SC)/i;
		const match = text.match(regex);

		if (match) {
			// Remove "SC" and spaces, then parse the numeric value
			const scValue = match[0].replace(/SC/i, "").trim();
			console.log(`SC number found: ${smallestNumber}`);
			return parseFloat(scValue);
		}
	});

	console.log("No valid non-zero numbers found.");
	return 0;
}

module.exports = {
	performFindText,
};
