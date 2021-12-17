var notes;

window.addEventListener('DOMContentLoaded', (e) => {
	localforage
		.getItem('notes')
		.then(function (value) {
			if (value == null) {
				localforage.setItem('notes', []);
				notes = [];
			} else {
				notes = value;
			}
			init();
		})
		.catch((e) => errorFound(e));

	function init() {
		var sn = SpatialNavigation;
		sn.init();
		sn.add({ selector: '.note', id: 'notes', rememberSource: true });
		parseNotes();
		sn.focus();
	}
});

function addNote(n, t, ti, c, cb) {
	var random_id;
	random_id = makeid(5);
	var ids;
	test();
	function test() {
		ids = [];
		for (let a of notes) {
			ids.push(a.id);
		}
		if (ids.includes(random_id)) {
			random_id = makeid(6);
			console.log(
				'WOW THATS SO UNLIKELY TO HAPPEN BUT IT HAPPENED WOW, YOU ARE VERY LUCKY BUY A LOTTO TICKET NOW'
			);
			test();
		} else {
			add();
		}
	}

	function add() {
		if (n == undefined) {
			n = 'New Note';
		}

		if (t == undefined) {
			t = 'default';
		}

		if (ti == undefined) {
			ti = 'New Note';
		}
		if (c == undefined) {
			c = 'yellow';
		}
		notes.push({
			id: random_id,
			note: encodeURI(n),
			type: t,
			title: ti,
			color: c,
			pinned: false,
			modified: Date.now(),
		});
		sortNotes();
		localforage
			.setItem('notes', notes)
			.then(() => (cb && typeof cb === 'function' ? cb() : false))
			.catch((e) => errorFound(e));
	}
	return notes;
}

function deleteNotes(g, cb) {
	notes = notes.filter((n) => !g.includes(n.id));
	sortNotes();
	localforage
		.setItem('notes', notes)
		.then(() => (cb && typeof cb === 'function' ? cb() : false))
		.catch((e) => errorFound(e));
	return notes;
}

function sortNotes() {
	notes.sort((a, b) => {
		if (a.pinned == b.pinned) {
			if (a.modified > b.modified) return -1;
			if (a.modified < b.modified) return 1;
		} else {
			return a.pinned ? -1 : 1;
		}
	});
	return notes;
}

function togglePin(g, cb) {
	var index = notes.findIndex((p) => p.id == g);
	if (index != -1) {
		if (notes[index].pinned == true) {
			notes[index].pinned = false;
		} else {
			notes[index].pinned = true;
		}
	} else {
		return 'ERROR ID NOT FOUND';
	}
	sortNotes();
	localforage
		.setItem('notes', notes)
		.then(() => (cb && typeof cb === 'function' ? cb() : false))
		.catch((e) => errorFound(e));
	return notes;
}

function modifyNote(g, n, t, ti, c, cb) {
	var index = notes.findIndex((p) => p.id == g);
	if (index != -1) {
		notes[index].note = encodeURI(n);
		notes[index].type = t;
		notes[index].title = ti;
		notes[index].color = c;
		notes[index].modified = Date.now();
	} else {
		return 'ERROR ID NOT FOUND';
	}
	sortNotes();
	localforage
		.setItem('notes', notes)
		.then(() => (cb && typeof cb === 'function' ? cb() : false))
		.catch((e) => errorFound(e));
	return notes;
}

function getNote(g) {
	var index = notes.findIndex((p) => p.id == g);
	if (index != -1) {
		return notes[index];
	} else {
		return 'ERROR ID NOT FOUND';
	}
}

function parseNotes(cb) {
	document.getElementById('home').innerHTML = '';
	for (let a of notes) {
		var note = document.createElement('div');
		note.className = 'note';
		note.tabIndex = -1;
		note.id = a.id;

		var candy = document.createElement('div');
		candy.className = 'note_candy';
		candy.setAttribute('color', a.color);

		var title = document.createElement('div');
		title.className = 'title';
		title.appendChild(document.createTextNode(a.title));

		candy.appendChild(title);

		var prev = document.createElement('div');
		prev.className = 'preview';
		prev.appendChild(
			document.createTextNode(
				convertToNiceDate(a.modified) +
					' · ' +
					decodeURI(a.note).substring(0, 26)
			)
		);

		candy.appendChild(prev);

		if (a.pinned) {
			candy.insertAdjacentHTML(
				'beforeend',
				`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"></path></svg>`
			);
		}

		note.appendChild(candy);
		document.getElementById('home').appendChild(note);
	}
	cb && typeof cb === 'function' ? cb() : false;
}
