const server = Utils.GetServerAdress();
document.addEventListener('DOMContentLoaded', () => {
	BindUninterestingEvents();
	GetBlackSites();
});
function PaintText(levels, currentAssertivness) {
	const span = document.querySelector('#assertiveness-span');

	if (levels.length == currentAssertivness + 1) {
		span.classList.add('slide-p-redText');
		span.classList.remove('slide-p-BlueText');
	} else {
		span.classList.add('slide-p-BlueText');
		span.classList.remove('slide-p-redText');
	}
}
function InitSlider(levels, currentAssertivness) {
	const slider = document.querySelector('.obsses-slider');
	const assertiveLevelText = document.querySelector('.slide-p-BlueText');
	currentAssertivness = currentAssertivness - 1;
	slider.value = parseInt(100 * currentAssertivness / (levels.length - 1));
	assertiveLevelText.textContent = levels[currentAssertivness];
	PaintText(levels, currentAssertivness);
	slider.addEventListener('change', async function() {
		let assertivnessPrecent = parseInt(slider.value);
		let assertivnessIdx = parseInt(levels.length / 101 * assertivnessPrecent); //101 so it won't ever get to non existing index..
		assertiveLevelText.textContent = levels[assertivnessIdx];
		PaintText(levels, assertivnessIdx);

		await fetch(`${server}/UpdateAssertivness`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ assertivness: assertivnessIdx + 1 })
		});
	});
}
async function GetBlackSites() {
	let data = await fetch(`${server}/GetUserInfo`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});
	let { user, levels } = await data.json();
	console.table(user);
	if (user.black_sites.length > 0) {
		PopulateBlackList(user.black_sites);
	}
	InitSlider(levels, user.assertivness);
}
function PopulateBlackList(sites) {
	sites.forEach((site) => {
		let newLi = document.createElement('li');
		let node = document.createTextNode(site);
		newLi.appendChild(node);
		document.querySelector('.sites-box-ul').appendChild(newLi);
	});
}
function AddSite() {
	let newBlackSite = document.querySelector('.add-site-input').value;
	let isValidSite = false;
	let normalizedURL;
	try {
		normalizedURL = new URL(newBlackSite);
		isValidSite = true;
	} catch (ex) {
		normalizedURL = null;
		document.querySelector('.add-site-input').classList.add('input-error');
		document.querySelector('.explenation-p').textContent = 'you need to enter valid url';
		setTimeout(() => {
			document.querySelector('.add-site-input').classList.remove('input-error');
			document.querySelector('.explenation-p').innerHTML = ` <p class='explenation-p'>
        Enter in the box below the sites you want your mother to be 
        <b>mad</b>
         about!
        </p>`;
		}, 1000);
	} finally {
		document.querySelector('.add-site-input').value = 'http://';
	}
	if (isValidSite) {
		let newLi = document.createElement('li');
		let node = document.createTextNode(normalizedURL);
		newLi.appendChild(node);
		document.querySelector('.sites-box-ul').appendChild(newLi);
		fetch(`${server}/PostNewBlackSite`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: normalizedURL })
		});
	}
}
function BindUninterestingEvents() {
	document.addEventListener('keydown', (event) => {
		if (event.key == 'Enter') {
			AddSite();
		}
	});
	document.querySelector('.add-site-button').addEventListener('click', () => {
		AddSite();
	});
}
