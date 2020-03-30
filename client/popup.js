function OpenOptions() {
	chrome.tabs.create({ url: '/options.html' });
}
document.addEventListener('DOMContentLoaded', function() {
	let button = document.querySelector('#my-butt');
	// onClick's logic below:
	button.addEventListener('click', function() {
		OpenOptions();
	});
});
