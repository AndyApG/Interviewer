var gui = require('nw.gui');
var moment = require('moment');
var fs = require('fs');

var win = gui.Window.get().enterFullscreen();

// Set the global debug level
window.debugLevel = 10;

// Initialise the menu system – other modules depend on it being there.
window.menu = new Menu({});

// Set up a new session
window.session = new Session({});

// Create a log
window.eventLog = new Logger();

// Build a new network
window.network = new Network();

$('.arrow-next').click(function() {
    session.nextStage();
});
$('.arrow-prev').click(function() {
    session.prevStage();
});