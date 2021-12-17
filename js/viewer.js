// separating things for viewing/editing notes

function openHTML(n) {
	var iframe_browser = document.querySelector('#iframe_browser');
	var iframe = document.querySelector('#iframe_browser iframe');
	iframe.src = iframe.src;

	iframe_browser.setAttribute('color', n.color);
	iframe_browser.className = 'open';
	var slime = new Blob([decodeURI(n.note)], { type: 'text/html' });
	iframe.src = URL.createObjectURL(slime);
	//	iframe.contentWindow.eval(`document.write(${note_decoded})`);
	//	failure, i'll use blobs instead

	document.querySelector('iframe').addEventListener('load', (e) => {
		iframe.contentWindow.eval(
			`document.querySelector("html").insertAdjacentHTML( 'beforeend', "<style>body{background-color:${window
				.getComputedStyle(iframe_browser)
				.getPropertyValue('background-color')};}</style>" )`
		);
	});
	document.getElementById('iframe_focus').focus();
}

function closeHTML() {
	var iframe_browser = document.querySelector('#iframe_browser');
	var iframe = document.querySelector('#iframe_browser iframe');
	URL.revokeObjectURL(iframe_browser.src);
	iframe.src = iframe.src;
	iframe_browser.className = 'close';
	document.getElementById('iframe_focus').blur();
	setTimeout(() => {
		SpatialNavigation.focus();
	}, 500);
}
