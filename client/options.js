let server = Utils.GetServerAdress();
document.addEventListener('DOMContentLoaded', () => {
	BindUninterestingEvents();
	GetBlackSites();
});

async function GetBlackSites() {
	let blackSites = await fetch(`${server}/GetBlackSites`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});
	let blackSitesJsoned = await blackSites.json();
	if (blackSitesJsoned.length > 0) {
		PopulateBlackList(blackSitesJsoned);
	}
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
