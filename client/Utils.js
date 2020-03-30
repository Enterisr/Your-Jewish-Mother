const Utils = {
	GetServerAdress: function GetServerAdress() {
		if (window.location.href.includes('localhost')) {
			const uri = new URL(window.location.href);
			uri;
			uri.port = '6969';
			return uri.origin;
		} else if (window.location.href.includes('file:///') || window.location.href.includes('chrome-extension://')) {
			return 'http://localhost:6969';
		}
		return document.location.origin;
	}
};
