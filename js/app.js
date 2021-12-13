var notes;

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

function init() {}

function addNote(n, t, cb) {
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
		notes.push({
			id: random_id,
			note: encodeURI(n),
			type: t,
			pinned: false,
			modified: Date.now(),
		});
		localforage
			.setItem('notes', notes)
			.then(() => (cb && typeof cb === 'function' ? cb() : false))
			.catch((e) => errorFound(e));
	}
	sortNotes();
	return notes;
}

function deleteNote(g, cb) {
	var index = notes.findIndex((p) => p.id == g);
	if (index != -1) {
		notes.splice(index, 1);
	} else {
		return 'ERROR ID NOT FOUND';
	}
	localforage
		.setItem('notes', notes)
		.then(() => (cb && typeof cb === 'function' ? cb() : false))
		.catch((e) => errorFound(e));
	sortNotes();
	return notes;
}

function deleteMultiple(arr) {
	if (arr.length == 0) return;
	var a = arr;
	var b = a.shift();
	deleteNote(b, () => {
		deleteMultiple(a);
	});
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
	localforage
		.setItem('notes', notes)
		.then(() => (cb && typeof cb === 'function' ? cb() : false))
		.catch((e) => errorFound(e));
	sortNotes();
	return notes;
}

function modifyNote(g, n, t, cb) {
	var index = notes.findIndex((p) => p.id == g);
	if (index != -1) {
		notes[index].note = encodeURI(n);
		notes[index].type = t;
		notes[index].modified = Date.now();
	} else {
		return 'ERROR ID NOT FOUND';
	}
	localforage
		.setItem('notes', notes)
		.then(() => (cb && typeof cb === 'function' ? cb() : false))
		.catch((e) => errorFound(e));
	sortNotes();
	return notes;
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

function errorFound(g) {
	console.log(g);
	alert('an error happened :(');
}
