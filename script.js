var BG = chrome.extension.getBackgroundPage(),
	html = Handlebars.templates.url(BG.Trakkr),
	refreshTrakkr;

$("#time").append(html);

if (BG.Trakkr.isRunning) {
	$("#startTrakkr").hide();
	$("#stopTrakkr, #timeElapsed").show();
	refreshTrakkr = setInterval(function () {
		html = Handlebars.templates.url(BG.Trakkr);
		$("#time").empty().append(html);
		if (BG.Trakkr.isRunning) {
			$("#startTrakkr").hide();
			$("#stopTrakkr, #timeElapsed").show();
		}
	}, 1000);
} else if ($(".entry").length) {
	$("#timeElapsed, #clearTrakkr").show();
}

$("#startTrakkr").on("click", function () {

	window.close();

	$(".settings").hide();

	chrome.extension.sendRequest({
		msg: "startTrakkr"
	});

	chrome.browserAction.setIcon({
		path: "iconRunning.png"
	});

});

$("#stopTrakkr").on("click", function () {

	$(this).hide();

	$("#startTrakkr, #clearTrakkr, .settings").show();

	clearInterval(refreshTrakkr);

	chrome.extension.sendRequest({
		msg: "stopTrakkr"
	});

	chrome.browserAction.setIcon({
		path: "icon.png"
	});

});

$("#clearTrakkr").on("click", function () {
	$(this).hide();
	$("#time").empty();
	$("#timeElapsed").hide();
	chrome.extension.sendRequest({
		msg: "clearTrakkr"
	});
});

$("#wrapper").on("click", ".entry", function () {
	$(this).toggleClass("selected");
});

$("#wrapper").on("click", ".settings", function () {
	$(this).siblings(".controls").toggle();
});

$("#wrapper").on("click", ".delete", function () {
	var index = $(this).closest(".entry").prevAll().length;

	BG.Trakkr.deleteEntry(index);

	$(this).closest(".entry").fadeOut("slow", function () {
		html = Handlebars.templates.url(BG.Trakkr);
		$("#time").empty().append(html);
		$("#timeElapsed").show();
	});
});