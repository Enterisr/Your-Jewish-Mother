const bannedSites = [ 'FACEBOOK.COM', 'YOUTUBE.COM', 'REDDIT.COM', 'STACKOVERFLOW.COM' ];
const messages = [
	"I'm taking you out of my last will",
	'Your teacher was right about you',
	'you will end as a trash collector',
	'please study, I suffered you 9 months in my belly for that',
	'I will tell dad!',
	'at least you are handsome....',
	'I will take your xbox!',
	"Ladies don't like idlers...",
	'You are a shame to our people.',
	'how do you expect get out of this town?',
	'no more vanilla icecream for you!',
	'I love you even if you are a lazy bummer',
	"Exit this site now, or I'm gonna call to gossip about aunt Tova",
	'With what money you will buy me a grave?',
	'there is a life outside you know!',
	"open your windows, It's like a cave here!",
	"It's carpe diem, don't dm crap",
	'You know that your cousin is a doctor already?',
	'When I was in your age I had 3 children, house, dog and master degree',
	"Titsc'es are temporary, A doctor degree is forever",
	"It's just numbers, nothing to be afraid of",
	'at least dust your room!',
	'What would grandpa said?',
	'I should have spanked you harder',
	'You know I love you no matter what...',
	'Your teacher from 8 grade was right apparently...',
	'When You will be like your brother?'
];
function selectRandomFromArray(arr) {
	const rnd = Math.floor(Math.random() * arr.length);
	return arr[rnd];
}
function RaiseNotfication(url) {
	let normalizedURL = url.toUpperCase();
	url = new URL(normalizedURL);
	site = url.host;
	let isForbbidenSite = bannedSites.find((forbiddenSite) => {
		return normalizedURL.search(forbiddenSite) != -1;
	});
	if (isForbbidenSite) {
		let message = selectRandomFromArray(messages);
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
}
function EnsureNotficationPermission(notficationValue) {
	if (!('Notification' in window)) {
	} else if (Notification.permission === 'granted') {
		RaiseNotfication(notficationValue);
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then(function(permission) {
			alert(permission);
			if (permission === 'granted') {
				RaiseNotfication(notficationValue);
			}
		});
	}
}

function GetRandomInterval() {
	return Math.floor(Math.random() * 6000 + 3000);
}

function GenerateRandomMessages() {
	setTimeout(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			if (tabs[0]) {
				EnsureNotficationPermission(tabs[0].url);
				GenerateRandomMessages();
			}
		});
	}, GetRandomInterval());
}
GenerateRandomMessages();
