var $ = require('jquery');
var soundCloud = require('./soundCloud');
var userData = require('./user');
var toastr = require('toastr');
var config = require('./config');
toastr.options.timeOut = 1000;

var app = {
  searchPhrase: '',
  nextPage : '',
  playlist : {},
  searches : [],
  viewType : 'list',
  controls : {
    search       : $('#sc-search'),
    searchBtn    : $('#sc-search-btn'),
    nextBtn      : $('#sc-next-btn'),
    thumbsView   : $('#sc-view-thumbs'),
    listView     : $('#sc-view-list'),
    form         : $('#sc-search-form'),
    results      : $('#sc-search-results'),
    history      : $('#sc-history-list'),
    coverArt     : $('#sc-cover-art'),
    viewControls : $('#sc-controls'),
    scembed      : $('#sc-embed')
  },

  search: function(searchPhrase, next) {
    var searchFieldValue = app.controls.search.val();
    if (!searchPhrase && searchFieldValue.length > 0) {
      app.addToHistory(searchFieldValue);
      app.saveUserData();
    }

    app.searchPhrase = searchPhrase || searchFieldValue;
    app.nextPage = '';
    app.controls.search.val('');

    if(app.searchPhrase.length > 0){
      app.executeSearch();
    }
  },

  executeSearch: function() {
    app.playlist = {};
    soundCloud
      .search(app.searchPhrase, app.nextPage)
      .then(function(results) {
        if (results.hasOwnProperty('next_href') && results.next_href) {
          app.nextPage = results.next_href;
        }
        results.collection.forEach(function(result) {
          app.playlist[result.id] = result;
        });
        app.showResults();
        app.getHistoryView();
      })
      .fail(function(error) {
        toastr.error('Search Result Error', error.message);
      });
  },

  showResults: function() {
    app.controls.results.hide();
    app.controls.results.html('');
    var htmlView = '';

    if (Object.keys(app.playlist).length) {
      app.controls.viewControls.show();
    } else {
      app.controls.viewControls.hide();
    }

    for (var track in app.playlist) {
      htmlView += app.getResultsView(track);
    }

    if (app.viewType === 'grid') {
      htmlView = '<div class="row">' + htmlView + '</div>';
    } else {
      htmlView = '<ul>' + htmlView + '</ul>';
    }

    app.controls.results.append(htmlView);
    app.controls.results.fadeIn();
  },

  getResultsView: function(track) {
    var html;
    switch (app.viewType) {
      case 'list':
        html = '<li class="sc-track"';
        html += 'data-id="' + track + '">';
        html += '<span class="glyphicon glyphicon-music" aria-hidden="true"></span>&nbsp;';
        html += app.playlist[track].title;
        html += '</li>';
        break;
      case 'grid':
        var img = app.playlist[track].artwork_url ? app.playlist[track].artwork_url : require('../images/music-icon.png');
        html = '<div class="col-xs-4" data-id="' + track + '">';
        html += '<img src="' + img + '" width=80 height=80 class="img-thumbnail"/>';
        html += '</div>';
        break;
    }
    return html;
  },

  getHistoryView: function() {
    app.controls.history.html('');
    app.searches.forEach(function(search) {
      var html = '';
      html = '<li class="sc-search"';
      html += 'data-search="' + escape(search) + '">';
      html += '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>&nbsp;';
      html += search;
      html += '</li>';
      app.controls.history.append(html);
    });
  },

  bindControls: function() {
    app.controls.form.on('submit', function(event) {
      event.preventDefault();
      app.search();
    });

    app.controls.searchBtn.on('click', app.search);

    app.controls.thumbsView.on('click', function() {
      app.viewType = 'grid';
      app.saveUserData();
      app.showResults();

    });

    app.controls.listView.on('click', function() {
      app.viewType = 'list';
      app.saveUserData();
      app.showResults();
    });

    app.controls.coverArt.on('click', function() {
      app.preparePlayer();
    });

    app.controls.results.delegate('li, div div', 'click', function() {
      app.showCoverArt(this.getAttribute('data-id'));
    });

    app.controls.history.delegate('li', 'click', function() {
      app.search(this.getAttribute('data-search'));
    });

    app.controls.nextBtn.on('click', function() {
      app.executeSearch();
    });

  },

  preparePlayer: function() {
    app.loadEmbed(app.controls.coverArt.attr('data-id'));
  },

  loadEmbed: function(track) {
    soundCloud.oEmbed(app.playlist[track].uri)
      .then(function(embedObj) {
        app.controls.scembed.html(embedObj.html);
      })
      .catch(function(error) {
        toastr.error('Can\'t load track', error);
      });
  },

  loadUserData: function(){
    var data = userData.load();
    app.searches = data.searches;
    app.viewType = data.viewType ? data.viewType : app.viewType;
  },

  saveUserData: function(){
    userData.save(app.searches,app.viewType);
  },

  addToHistory: function(phrase) {
    app.searches.unshift(phrase);
    if (app.searches.length > config.historyLimit - 1) {
      var itemsToRemove =app.searches.length - config.historyLimit;
      app.searches.splice(config.historyLimit,itemsToRemove);
    }
  },

  showCoverArt: function(id) {
    var placeholder = require('../images/music-placeholder.png');
    var cover = app.playlist[id].artwork_url;
    var coverSrc = app.controls.coverArt;
    coverSrc.attr('data-id', id);
    coverSrc.hide();
    if (cover) {
      coverSrc.fadeIn().attr('src', cover);
    } else {
      coverSrc.fadeIn().attr('src', placeholder);
    }
  },

};

module.exports = app;