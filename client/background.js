const bannedSites = [ 'FACEBOOK.COM', 'YOUTUBE.COM', 'REDDIT.COM', 'STACKOVERFLOW.COM' ];
const serverAddress = Utils.GetServerAdress();
alert(serverAddress);
async function RaiseNotfication() {
	let message = await fetch(`${serverAddress}/giveMeSomeThingToSay`);
	message = await message.text();
	const sound = new Audio('notificationSound.mp3');
	sound.muted = true;
	sound.play();
	let options = {
		body: message,
		silent: true,
		icon: '/icon.png'
	};
	return new Notification('your jewish mother says: ', options);
}

function SendNotification() {
	if (!('Notification' in window)) {
	} else if (Notification.permission === 'granted') {
		RaiseNotfication();
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then(function(permission) {
			if (permission === 'granted') {
				RaiseNotfication();
			}
		});
	}
}

function GetRandomInterval() {
	return Math.floor(Math.random() * 6000 + 3000);
}

function GenerateRandomMessages() {
	setTimeout(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
			if (tabs[0]) {
				let isBlackSite = await fetch(`${serverAddress}/isBlackSite`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: window.location.href })
				});
				if (isBlackSite) {
					SendNotification(tabs[0].url);
					GenerateRandomMessages();
				}
			}
		});
	}, GetRandomInterval());
}
GenerateRandomMessages();
