var Trakkr = {};

Trakkr.session = {};

Trakkr.currentSession = "default";

Trakkr.sessionNames = [];

for (var i = 0; i < localStorage.length; i++) {
	Trakkr.sessionNames.push(localStorage.key(i));
}

if (localStorage[Trakkr.currentSession]) {
	Trakkr.session = JSON.parse(localStorage[Trakkr.currentSession]);

	Trakkr.session.isRunning = false;
} else {
	Trakkr.session.tabs = [];

	Trakkr.session.isRunning = false;

	Trakkr.session.timeElapsed = 0;

	Trakkr.session.formattedTimeElapsed = "00:00:00";

	Trakkr.sessionNames.push("default");

	localStorage[Trakkr.currentSession] = JSON.stringify(Trakkr.session);
}

Trakkr.formatTime = function (s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
};

Trakkr.start = function () {
	if (!Trakkr.session.isRunning) {
		Trakkr.loop = setInterval(function () {

			chrome.tabs.getSelected(null, function(tab) {

				var currentTabTitle = tab.title,
					currentTabURL = tab.url,
					newTab = true;

				for (var i = 0; i < Trakkr.session.tabs.length; i++) {

					if (Trakkr.session.tabs[i].url === currentTabURL) {

					var currentTime = Trakkr.session.tabs[i].time,
						formattedTime;

						currentTime += 1;
						formattedTime = Trakkr.formatTime(currentTime);

						Trakkr.session.tabs[i].time = currentTime;
						Trakkr.session.tabs[i].formattedTime = formattedTime;

						newTab = false;
					}

				}

				if (newTab) {
					Trakkr.session.tabs.push({
						"url": currentTabURL,
						"title": currentTabTitle,
						"time": 1,
						"formattedTime": "00:00:01"
					});
				}
				
			});

			Trakkr.session.timeElapsed += 1;

			Trakkr.session.formattedTimeElapsed = Trakkr.formatTime(Trakkr.session.timeElapsed);

			Trakkr.saveSession();

		}, 1000);

		Trakkr.session.isRunning = true;
	}
};

Trakkr.stop = function () {
	clearInterval(Trakkr.loop);
	Trakkr.session.isRunning = false;

	Trakkr.saveSession();
};

Trakkr.clear = function () {
	Trakkr.session.tabs = [];
	Trakkr.session.timeElapsed = 0;
	Trakkr.session.formattedTimeElapsed = "00:00:00";
};

Trakkr.deleteEntry = function (index) {
	var entry = Trakkr.session.tabs[index],
		time = entry.time;

	console.log(entry);

	Trakkr.session.tabs.splice(index, 1);

	Trakkr.session.timeElapsed -= time;

	Trakkr.session.formattedTimeElapsed = Trakkr.formatTime(Trakkr.session.timeElapsed);

	Trakkr.saveSession();
};

Trakkr.changeSession = function (name) {

	if (Trakkr.session.isRunning) {
		Trakkr.stop();

		Trakkr.session.isRunning = false;
	}

	if (localStorage[name]) {
		Trakkr.session = JSON.parse(localStorage[name]);

		Trakkr.session.isRunning = false;
	} else {
		Trakkr.session.tabs = [];

		Trakkr.session.isRunning = false;

		Trakkr.session.timeElapsed = 0;

		Trakkr.session.formattedTimeElapsed = "00:00:00";

		localStorage[name] = JSON.stringify(Trakkr.session);

		Trakkr.sessionNames.push(name);
	}

	Trakkr.currentSession = name;

	Trakkr.saveSession();
};

Trakkr.saveSession = function () {
	localStorage[Trakkr.currentSession] = JSON.stringify(Trakkr.session);
};

Trakkr.deleteSession = function (name) {
	localStorage.removeItem(name);
};
