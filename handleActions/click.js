async function performClick(page, options) {
	const {
		element,
		textContents,
		attribute,
		selectorText,
		parentElement,
		parentAttribute,
		parentSelectorText,
	} = options;
	let clicked = false;
	async function clickElements(elements) {
		el = elements[0];
		await el.click();
		clicked = true;
	}

	async function findElementsWithParent(parentSelector, childSelector) {
		const parents = await page.$$(parentSelector);
		for (const parentEl of parents) {
			const childElements = await parentEl.$$(childSelector);
	
			const filteredElements = await filterElementsByTextContent(childElements);
			if (filteredElements.length > 0) {
				await clickElements(filteredElements);
				break;
			}
		}
	}

	async function filterElementsByTextContent(elements) {
		if (textContents) {
			const filtered = [];
			for (const el of elements) {
				const textContent = await el.evaluate(el => el.textContent.trim().toLowerCase());
				if (textContent.includes(textContents.trim().toLowerCase())) {
					filtered.push(el);
				}
			}
			return filtered;
		}
		return elements;
	}

	function buildSelector() {
		if (element && attribute && selectorText) {
			return `${element}[${attribute}*="${selectorText}"]`;
		} else if (element && attribute) {
			return `${element}[${attribute}]`;
		} else if (element) {
			return element;
		}
		return "*"; // Default to selecting all elements if no specific element type is provided
	}

	const childSelector = buildSelector();

	if (parentElement && parentAttribute && parentSelectorText) {
		const parentSelector = `${parentElement}[${parentAttribute}*="${parentSelectorText}"]`;
		// console.log(parentSelector, childSelector);
		await findElementsWithParent(parentSelector, childSelector);
	} else {
		const elements = await page.$$(childSelector);
		const filteredElements = await filterElementsByTextContent(elements);
		console.log(childSelector);
		if (filteredElements.length > 0) {
			await clickElements(filteredElements);
		}
	}
	if(!clicked)
		throw new Error('Button Click Failed.');
}

module.exports = {
	performClick,
}
