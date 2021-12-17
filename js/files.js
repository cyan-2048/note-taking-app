/// separating the functions that's mostly for files

function exportDataJSON() {
	var blob = new Blob([JSON.stringify(notes, null, 2)], {
		type: 'octet/stream',
	});
	window.saveAs(blob, `Notoj ${new Date().toISOString().split('T')[0]}.json`);
}

function importDataJSON(cb) {
	var m = new MozActivity({ name: 'pick' });
	m.onsuccess = () => {
		var fr = new FileReader();
		fr.onload = function () {
			console.log(fr.result);
			if (!tryJSON(fr.result)) {
				console.error('NOT A JSON FILE');
			} else {
				arr = JSON.parse(fr.result);
				if (arr instanceof Array != true) {
					console.error('NOT A NOTOJ DATA FILE');
				} else {
					for (let n of arr) {
						if (
							arraysEqual(Object.keys(n), [
								'id',
								'note',
								'type',
								'title',
								'color',
								'pinned',
								'modified',
							])
						) {
							var a = n;
							a.id = makeid(5);
							notes.push(a);
						}
					}
					sortNotes();
					localforage
						.setItem('notes', notes)
						.then(() => (cb && typeof cb === 'function' ? cb(true) : false))
						.catch((e) => errorFound(e));
				}
			}
		};

		fr.readAsText(m.result.blob);
	};

	m.onerror = () => {
		cb && typeof cb === 'function' ? cb(false) : false;
	};

	function tryJSON(jsonString) {
		try {
			var o = JSON.parse(jsonString);
			if (o && typeof o === 'object') {
				return true;
			}
		} catch (e) {}

		return false;
	}
}
