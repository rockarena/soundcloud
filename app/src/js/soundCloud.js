var config = require('./config');

var Q = require('q');
var $ = require('jquery');

function loadScript() {
  var deferred = Q.defer();
  var body = document.getElementsByTagName('body')[0];
  var script = document.createElement('script');

  script.onload = function() {
    deferred.resolve('SoundCloud API Loaded');
  };
  script.onerror = function() {
    deferred.reject('Failed to load SoundCloud API');
  };
  script.src = config.script;
  body.appendChild(script);

  return deferred.promise;
}

function initSoundCloud(id, limit) {
  SC.initialize({
    client_id: config.clientId
  });
}


function search(phrase, next) {
  var url = 'https://api.soundcloud.com/tracks';
  if (next){
    return $.get(next);
  } else{
    return $.get(url ,{
      q:phrase,
      limit:config.pageLimit,
      linked_partitioning:1,
      client_id:config.clientId,
      filter: 'public'
    });
  }
}

function oEmbed(url){
  return SC.oEmbed(url, { auto_play: true, maxheight:166 });
}

module.exports = {
  initSoundCloud: initSoundCloud,
  loadScript: loadScript,
  search: search,
  oEmbed: oEmbed
};
