function RaiseNotfication(notficationValue) {
	new Notification(notficationValue);
}
function EnsureNotficationPermission(notficationValue) {
	if (!('Notification' in window)) {
	} else if (Notification.permission === 'granted') {
		RaiseNotfication(notficationValue);
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then(function(permission) {
			if (permission === 'granted') {
				RaiseNotfication(notficationValue);
			}
		});
	}
}
