var BG = chrome.extension.getBackgroundPage(),
	Trakkr = BG.Trakkr,
	html = Handlebars.templates.url(Trakkr),
	refreshTrakkr;

$("#time").append(html);

if (Trakkr.isRunning) {
	$("#startTrakkr").hide();
	$("#stopTrakkr, #timeElapsed").show();
	refreshTrakkr = setInterval(function () {
		html = Handlebars.templates.url(Trakkr);
		$("#time").empty().append(html);
		if (Trakkr.isRunning) {
			$("#startTrakkr").hide();
			$("#stopTrakkr, #timeElapsed").show();
		}
	}, 1000);
} else if ($(".entry").length) {
	$("#timeElapsed, #clearTrakkr").show();
}

$("#startTrakkr").on("click", function () {

	window.close();

	chrome.extension.sendRequest({
		msg: "startTrakkr"
	});

	chrome.browserAction.setIcon({
		path: "iconRunning.png"
	});

});

$("#stopTrakkr").on("click", function () {

	$(this).hide();

	$("#startTrakkr, #clearTrakkr").show();

	clearInterval(refreshTrakkr);

	chrome.extension.sendRequest({
		msg: "stopTrakkr"
	});

	chrome.browserAction.setIcon({
		path: "icon.png"
	});

});

$("#clearTrakkr").on("click", function () {
	var confirm = window.confirm("Clear Trakkr times?");

	if (confirm) {
		$(this).hide();
		$("#time").empty();
		$("#timeElapsed").hide();
		chrome.extension.sendRequest({
			msg: "clearTrakkr"
		});
	}

});