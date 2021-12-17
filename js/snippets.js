// separating snippets aka functions that will be used a lot by other functions or functions stolen from other websites

function convertToNiceDate(time) {
	var date = new Date(time),
		diff = (new Date().getTime() - date.getTime()) / 1000,
		daydiff = Math.floor(diff / 86400);

	if (isNaN(daydiff) || daydiff < 0) return '';

	if (daydiff >= 31) {
		return date.toLocaleDateString(undefined, {
			weekday: undefined,
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}

	return (
		(daydiff == 0 &&
			((diff < 60 && 'Just now') ||
				(diff < 120 && '1 minute ago') ||
				(diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
				(diff < 7200 && '1 hour ago') ||
				(diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
		(daydiff == 1 && 'Yesterday') ||
		(daydiff < 7 && daydiff + ' days ago') ||
		(daydiff < 31 && Math.ceil(daydiff / 7) + ' week(s) ago')
	);
}

function scrollActive(g, e, cb) {
	var a = 'smooth';
	var b = 200;

	if (keydown_repeating) {
		a = 'auto';
		b = 3;
	}

	const rect = (g || document.activeElement).getBoundingClientRect();
	const elY =
		rect.top - document.body.getBoundingClientRect().top + rect.height / 2;

	(g || document.activeElement).parentNode.scrollBy({
		left: 0,
		top: elY - window.innerHeight / 2,
		behavior: e || a,
	});

	let position = null;
	var checkIfScrollIsStatic = setInterval(() => {
		if (position === rect.y) {
			clearInterval(checkIfScrollIsStatic);
			cb && typeof cb === 'function' ? cb() : false;
		}
		position = rect.y;
	}, b);
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function errorFound(g) {
	console.error(g);
	alert('an error happened :(');
}

function makeid(length) {
	var result = '';
	var characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function getNoteIndex(g) {
	return notes.findIndex((p) => p.id == g);
}

function isPinned() {
	if (document.activeElement.querySelectorAll('svg').length > 0) {
		document.querySelector('.softkey-left').innerText = 'Unpin';
	} else {
		document.querySelector('.softkey-left').innerText = 'Pin';
	}
}
