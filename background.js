if (localStorage["default"]) {
	var Trakkr = JSON.parse(localStorage["default"]);
} else {
	var Trakkr = {};

	Trakkr.currentSession = "default";

	Trakkr.tabs = [];

	Trakkr.isRunning = false;

	Trakkr.timeElapsed = 0;

	Trakkr.formattedtimeElapsed = "00:00:00";

	localStorage[Trakkr.currentSession] = JSON.stringify(Trakkr);
}

Trakkr.formatTime = function (s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
};

Trakkr.start = function () {
	Trakkr.loop = setInterval(function () {

		chrome.tabs.getSelected(null, function(tab) {

			var currentTabTitle = tab.title,
				currentTabURL = tab.url,
				newTab = true;

			for (var i = 0; i < Trakkr.tabs.length; i++) {

				if (Trakkr.tabs[i].url === currentTabURL) {

				var currentTime = Trakkr.tabs[i].time,
					formattedTime;

					currentTime += 1;
					formattedTime = Trakkr.formatTime(currentTime);

					Trakkr.tabs[i].time = currentTime;
					Trakkr.tabs[i].formattedTime = formattedTime;

					newTab = false;
				}

			}

			if (newTab) {
				Trakkr.tabs.push({
					"url": currentTabURL,
					"title": currentTabTitle,
					"time": 1,
					"formattedTime": "00:00:01"
				});
			}
			
		});

		Trakkr.timeElapsed += 1;

		Trakkr.formattedTimeElapsed = Trakkr.formatTime(Trakkr.timeElapsed);

	}, 1000);

	Trakkr.isRunning = true;
};

Trakkr.stop = function () {
	clearInterval(Trakkr.loop);
	Trakkr.isRunning = false;
};

Trakkr.clear = function () {
	Trakkr.tabs = [];
	Trakkr.timeElapsed = 0;
	Trakkr.formattedtimeElapsed = "00:00:00";
};

Trakkr.deleteEntry = function (index) {
	var entry = Trakkr.tabs[index],
		time = entry.time;

	Trakkr.tabs.splice(index, 1);

	Trakkr.timeElapsed -= time;

	Trakkr.formattedTimeElapsed = Trakkr.formatTime(Trakkr.timeElapsed);

};

Trakkr.changeSession = function (name) {

	if (localStorage[name]) {
		Trakkr = JSON.parse(localStorage[name]);

		Trakkr.currentSession = name;
	} else {

		Trakkr.currentSession = name;

		Trakkr.tabs = [];

		Trakkr.isRunning = false;

		Trakkr.timeElapsed = 0;

		Trakkr.formattedtimeElapsed = "00:00:00";

		localStorage[name] = JSON.stringify(Trakkr);
	}
};

Trakkr.updateSession = function () {
	localStorage[Trakkr.currentSession] = JSON.stringify(Trakkr);
};

chrome.extension.onRequest.addListener(
	function (request, sender, sendResponse) {
		switch (request.msg) {
		case "startTrakkr":
			Trakkr.start();
			break;
		case "stopTrakkr":
			Trakkr.stop();
			break;
		case "clearTrakkr":
			Trakkr.clear();
			break;
		}
	}
);