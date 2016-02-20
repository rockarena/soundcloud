module.exports = {
  save: function(searches,viewType) {
    localStorage.searches = JSON.stringify(searches);
    localStorage.viewType = JSON.stringify(viewType);
  },

  load: function(searches,viewType) {
    var data = {};
    data.viewType = '';
    data.searches = [];

    if (localStorage.hasOwnProperty('searches') && localStorage.searches.length) {
      data.searches = JSON.parse(localStorage.searches);
    }
    if (localStorage.hasOwnProperty('viewType') && localStorage.viewType.length) {
      data.viewType = JSON.parse(localStorage.viewType);
    }
    return data;
  }
};