var BG = chrome.extension.getBackgroundPage(),
	refreshTrakkr,
	UI = {};

/**
 * UI Bootstrap
 */
UI.bootstrap = function () {
	if (BG.Trakkr.session.isRunning) {
		BG.Trakkr.start();
		UI.startTimer();
		chrome.browserAction.setIcon({
			path: "iconRunning.png"
		});
	} else if ($(".entry").length) {
		$("#stopTrakkr").hide();
		$("#timeElapsed, #startTrakkr, #clearTrakkr, .settings").show();
		chrome.browserAction.setIcon({
		path: "icon.png"
	});
	}
};

/**
 * UI Select Session
 */
UI.selectSession = function () {
	$("#changeSession option").each(function () {
		if ($(this).val() === BG.Trakkr.currentSession) {
			$(this).attr("selected", "selected");
		}
	});
};

/**
 * UI Start Timer
 */
UI.startTimer = function () {
	chrome.browserAction.setIcon({
		path: "iconRunning.png"
	});

	$("#startTrakkr, #clearTrakkr").hide();
	$("#stopTrakkr, #timeElapsed").show();

	refreshTrakkr = setInterval(function () {
		UI.render.urlTemplate();
		if (BG.Trakkr.session.isRunning) {
			$("#startTrakkr").hide();
			$("#stopTrakkr, #timeElapsed").show();
		}
	}, 1000);
};

/**
 * UI Stop Timer
 */
UI.stopTimer = function () {
	clearInterval(refreshTrakkr);
};

UI.render = {};

/**
 * UI Render URL Template
 */
UI.render.urlTemplate = function () {
	urlHTML = Handlebars.templates.url(BG.Trakkr);
	$("#time").empty().append(urlHTML);
};

/**
 * UI Render Settings Template
 */
UI.render.settingsTemplate = function () {
	settingsHTML = Handlebars.templates.settings(BG.Trakkr);
	$("#trakkrSettings").empty().append(settingsHTML);
};

// Render templates
UI.render.urlTemplate();
UI.render.settingsTemplate();

UI.bootstrap();

/**
 * Show Trakkr Settings
 */
$("#globalSettings").on("click", function () {
	UI.render.settingsTemplate();
	UI.selectSession();
	$("#trakkrSettings").toggle();
});

/**
 * Select Session
 */
$("#wrapper").on("change", "#changeSession", function () {
	console.log($(this).val());
	if ($(this).val() === "new") {
		console.log("New session");
		$("#newSessionName").show();
	} else {
		$("#newSessionName").hide();
	}
});

/**
 * Change Session
 */
$("#wrapper").on("click", "#submitChangeSession", function () {
	if ($("#changeSession").val() === "new") {
		if ($("#newSessionName") !== "") {
			BG.Trakkr.changeSession($("#newSessionName").val());
		} else {
			// Error handling
		}
	} else {
		BG.Trakkr.changeSession($("#changeSession").val());
	}

	$("#newSessionName").val("").hide();

	UI.render.urlTemplate();
	UI.render.settingsTemplate();

	UI.selectSession();

	UI.bootstrap();
});

/**
 * Delete Session
 */
$("#wrapper").on("click", "#submitDeleteSession", function () {
	var name = $("#deleteSession").val();

	BG.Trakkr.deleteSession(name);

	if (BG.Trakkr.currentSession === name) {
		BG.Trakkr.changeSession("default");

		UI.render.urlTemplate();
		UI.render.settingsTemplate();
	}
});

/**
 * Start Trakkr
 */
$("#startTrakkr").on("click", function () {

	UI.startTimer();

	BG.Trakkr.start();

	chrome.browserAction.setIcon({
		path: "iconRunning.png"
	});

});

/**
 * Stop Trakkr
 */
$("#stopTrakkr").on("click", function () {

	$(this).hide();

	$("#startTrakkr, #clearTrakkr, .settings").show();

	UI.stopTimer();

	BG.Trakkr.stop();

	chrome.browserAction.setIcon({
		path: "icon.png"
	});

});

/**
 * Clear Trakkr
 */
$("#clearTrakkr").on("click", function () {
	$(this).hide();
	$("#time").empty();
	$("#timeElapsed").hide();
	
	BG.Trakkr.clear();
});

/**
 * Select Item
 */
$("#wrapper").on("click", ".settings", function (event) {
	$(this).closest(".entry").toggleClass("selected");
});

/**
 * Edit Entry
 */
$("#wrapper").on("click", ".settings", function () {
	$(this).siblings(".controls").toggle();
});

/**
 * Delete Entry
 */
$("#wrapper").on("click", ".delete", function () {
	var index = $(this).closest(".entry").prevAll().length - 1;

	console.log(index);

	BG.Trakkr.deleteEntry(index);

	$(this).closest(".entry").fadeOut("slow", function () {
		UI.render.urlTemplate();
		$("#timeElapsed").show();
	});
});