let updateCount = 0;
let timeoutCount = 0;
async function RaiseNotfication() {
	const serverAddress = Utils.GetServerAdress();
	let message = await fetch(`${serverAddress}/giveMeSomeThingToSay`);
	message = await message.text();
	alert(message);
	const sound = new Audio('notificationSound.mp3');
	sound.muted = true;
	//sound.play();
	let options = {
		body: message,
		silent: true,
		icon: '/icon.png'
	};
	return new Notification('your jewish mother says: ', options);
}
function NotificationsCallback() {
	if (!('Notification' in window)) {
	} else if (Notification.permission === 'granted') {
		RaiseNotfication();
		InitNotifications();
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then(function(permission) {
			if (permission === 'granted') {
				RaiseNotfication();
				InitNotifications();
			}
		});
	}
}
function InitNotifications(assertivness) {
	timeoutCount++;
	setTimeout(NotificationsCallback, GetRandomInterval(assertivness));
}

function GetRandomInterval(assertivness) {
	/*let min = 1 / assertivness * 60000; //for the softest - once every 10 minutes
	let max = 1 / assertivness * 1800000; //for the softest  - once half an hour
	return Math.floor(Math.random() * min + max);*/
	return 5000;
}
async function OnChangeHandler() {
	const serverAddress = Utils.GetServerAdress();
	let timeOutId = setTimeout(() => {}, 0);
	while (timeOutId > 0) {
		clearTimeout(timeOutId);
		timeOutId--;
	}
	chrome.tabs.getSelected(null, async function(tab) {
		if (tab) {
			let res = await fetch(`${serverAddress}/isBlackSite`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: tab.url })
			});
			let { isBlackSite, assertivness } = await res.json();

			if (isBlackSite) {
				InitNotifications(assertivness);
			}
		}
	});
}
function CheckIfBlackSite() {
	chrome.tabs.onActivated.addListener(OnChangeHandler);
	chrome.webNavigation.onHistoryStateUpdated.addListener(OnChangeHandler);
}

CheckIfBlackSite();
