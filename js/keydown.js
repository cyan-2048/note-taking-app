// separating eventlisteners for keyboard purposes

document.addEventListener('click', (e) => {
	var a = e.target;

	if (a.className == 'note') {
		if (a.id != '') {
			if (getNote(a.id).type == 'html') {
				openHTML(getNote(a.id));
			}
		}
	}
});

var keydown_repeating = false;

document.addEventListener('keyup', (e) => {
	keydown_repeating = false;
});

function simulateSoftkeys(g, h) {
	var a;
	switch (g) {
		case 'right':
			a = 'SoftRight';
			break;
		case 'left':
			a = 'SoftLeft';
			break;
	}
	document.dispatchEvent(new KeyboardEvent(h, { key: a }));
}

document.addEventListener('keydown', (e) => {
	var a = document.activeElement;
	var k = e.key;
	var d = document;
	var qa = 'querySelectorAll';
	var niqa = d[qa]('.note[id]');
	var niqaX = niqa[niqa.length - 1];

	keydown_repeating = e.repeat;

	if ((k == 'ArrowLeft' && e.shiftKey) || k == 'AltGraph') {
		simulateSoftkeys('left', 'keydown');
	}
	if ((k == 'ArrowRight' && e.shiftKey) || k == 'Control') {
		simulateSoftkeys('right', 'keydown');
	}

	if (!e.shiftKey) {
		if (k == 'ArrowUp' && niqa[0] == a) {
			scrollActive(niqaX, 'smooth', () => {
				niqaX.focus();
			});
		} else if (k == 'ArrowDown' && niqaX == a) {
			scrollActive(niqa[0], 'smooth', () => {
				niqa[0].focus();
			});
		}

		if (a.classList.contains('note') && k == 'Enter') {
			a.click();
		}

		if (a.classList.contains('note') && k == 'SoftLeft') {
			var id = a.id;
			var index = getNoteIndex(id);
			togglePin(id, () => {
				parseNotes(() => {
					d[qa]('.note')[index].focus();
				});
			});
		}

		if (a.id == 'iframe_focus') {
			var iframe = document.querySelector('#iframe_browser iframe');
			iframe.contentWindow.eval(`
		(()=>{const event = new KeyboardEvent('keydown', {
			cancelable: true,
			key: '${k}'
		});
		
		let r = ${keydown_repeating};
		var s_l = 0;
		var s_u = 0
		var rep = 'smooth'

		if (r){
			rep = 'auto'
		}

		if (window.dispatchEvent(event)) {
			switch ('${k}') {
				case 'ArrowUp':
					s_u = -100
					break;
				case 'ArrowDown':
					s_u = 100
					break;
				case 'ArrowRight':
					s_l = 100
					break;
				case 'ArrowLeft':
					s_l = -100
					break;
			}
			if (s_u != 0){
				window.scrollBy({
					top: s_u,
					behavior: rep
				})
			} else if (s_l != 0){
				window.scrollBy({
					left: s_l,
					behavior: rep
				})
			}
		} 
		
	})()
		`);
		}
	}
});

document.addEventListener('sn:focused', (e) => {
	var a = e.target;
	var qa = 'querySelectorAll';

	if (a.classList.contains('note')) {
		scrollActive();
		isPinned();
	}
});
