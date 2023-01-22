import puppeteer from 'puppeteer';

const selectors = {
	customerId: '#customerid',
	username: 'div.form-group:nth-child(2) > div:nth-child(2) > input:nth-child(2)',
	password: '#login_normale > div:nth-child(3) > div > input',
	buttonSubmit: 'button.blue:nth-child(1)',
	buttonRegistro: 'div.tile:nth-child(3) > div:nth-child(1) > div:nth-child(1)',
	buttonVoti: '.blue-soft > a:nth-child(3)',
	select: 'select.form-control:nth-child(1)',
	table: '#table-voti > tbody'
};

export interface Mark {
	mark: string;
	subject: string;
	weight: number;
}

export async function scrape(
	customerId: string,
	username: string,
	password: string
): Promise<Mark[]> {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://scuoladigitale.axioscloud.it/Pages/SD/SD_Login.aspx');

	await page.waitForNetworkIdle();
	await page.waitForSelector(selectors.customerId).then((el) => el?.type(customerId));
	await page.waitForSelector(selectors.username).then((el) => el?.type(username));
	await page.waitForSelector(selectors.password).then((el) => el?.type(password));
	await page.waitForSelector(selectors.buttonSubmit).then((el) => el?.click());

	await page.waitForNetworkIdle();
	await page.waitForSelector(selectors.buttonRegistro).then((el) => el?.click());

	await page.waitForNetworkIdle();
	await page.waitForSelector(selectors.buttonVoti).then((el) => el?.click());

	await page.waitForSelector(selectors.select).then((el) => el?.select('-1'));

	await page.waitForNetworkIdle();

	const table = await page.waitForSelector(selectors.table);
	const marks = await table?.evaluate((el) => {
		const result: Mark[] = [];

		el.querySelectorAll('tr').forEach((tr) => {
			const td = tr.querySelectorAll('td');
			const subject = td[1].innerText;
			const mark = td[3].innerText.replaceAll(',', '.');
			const attr = td[3].querySelector('span')?.getAttribute('data-original-title');
			let weight = 100;
			if (attr) {
				const match = attr.match(/\d?\d?\d?%/);
				if (match) weight = Number(match[0].slice(0, -1));
			}

			result.push({
				subject,
				mark,
				weight
			});
		});

		return result;
	});

	browser.close();

	if (!marks) {
		throw new Error('Marks are undefined!');
	}
	return marks;
}
