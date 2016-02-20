require('./css/bootstrap.min.css');
require('./css/app.less');
var $ = require('jquery');
var soundCloud = require('./js/soundCloud');
var app = require('./js/app');
require('../../node_modules/toastr/build/toastr.min.css');

/**
 * Start Application
 */
document.addEventListener("DOMContentLoaded", function(event) {
  app.bindControls();
  app.loadUserData();
  if (app.searches.length) {
    app.getHistoryView();
  }
  $('body').fadeIn();
});

/**
 * Load SoundCloud
 * @return {script} embed script to DOM
 */
(function() {
  soundCloud
    .loadScript()
    .then(function(result) {
      toastr.success(result);
      soundCloud.initSoundCloud();
    })
    .fail(function(error) {
      toastr.error(error);
    });
})();
