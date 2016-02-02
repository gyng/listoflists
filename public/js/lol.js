(function () {
  'use strict';

  $(document).ready(function () {
    new UI();
  });

  function UI() {
    window.onpopstate = this.onPopState.bind(this);

    if (window.location.hash) {
      this.navigate(window.location.hash.replace(/^#/, ''));
    }

    this.createNavLinks();
    this.setStatistics();

    $('.list-link').click(this.linkClick.bind(this));
  }

  UI.prototype.linkClick = function (e) {
    e.preventDefault();
    $('.active-page').removeClass('active-page');

    var el = $(e.target);
    el.addClass('active-page');
    this.navigate(el.attr('data-url'), {
      'updateState': true
    });
  };

  UI.prototype.createNavLinks = function () {
    $.getJSON('nav_links.json', function (data) {
      data.map(function (e) {
        $('.nav-links').append(this.createLink('#dummy-nav-link', e));
      }.bind(this));
    }.bind(this));
  };

  UI.prototype.setStatistics = function () {
    $.getJSON('latest.json', function (data) {
      data.map(function (e) {
        $('.latest-uploads').append(this.createLink('#dummy-latest-entry', e));
      }.bind(this));
    }.bind(this));

    $.getJSON('statistics.json', function (data) {
      $('.total-uploads').text(data.uploads);
    });
  };

  // For window.onpopstate.
  UI.prototype.onPopState = function (e) {
    if (e.state) {
      this.navigate(e.state.url);

      if (e.state.activePage) {
        $('.active-page').removeClass('active-page');
        $('.page[data-url="' + e.state.activePage + '').addClass('active-page');
      }
    } else if (!window.location.hash) {
      // We don't have a list loaded, display landing
      $('.active-page').removeClass('active-page');
      $('.list').hide();
      $('.landing').show();
    }
  };

  UI.prototype.navigate = function (url, options) {
    if (typeof options === 'undefined') options = {};

    $.getJSON(url, function (data) {
      if (options.updateState === true) {
        var state = {};
        state.url = url;
        state.activePage = $('.active-page').attr('data-url');
        window.location.hash = url;
        // window.location.hash creates a history item so we modify that
        window.history.replaceState(state, data.title, window.location.href);
      }

      $('.landing').hide();
      $('.list').show();

      document.title = data.title;
      this.populateEntries(data);
    }.bind(this));
  };

  UI.prototype.populateEntries = function (data) {
    $('.entries').empty();
    var relPath = data.relative_path ? data.path.join('/') + '/' : '';
    $('.list-header').children().text('');
    $('.list-title').text(data.title);
    $('.list-subtitle').text(data.subtitle);

    data.entries.map(function (entry) {
      $('.entries').append(this.createEntry(entry, relPath, data.note_label));
    }.bind(this));
  };

  UI.prototype.createEntry = function (data, path, noteLabel) {
    var el = $($('#dummy-entry').html());

    el.children('.label').text(data.label);
    el.find('.text .title').text(data.title);
    el.find('.text .subtitle').text(data.subtitle);
    el.find('.text .subsubtitle').text(data.subsubtitle);

    var parHtml = '<p></p>';
    if (typeof data.writeup !== 'string') {
      data.writeup.map(function (paragraph) {
        el.find('.text .writeup').append($(parHtml).text(paragraph));
      });
    } else {
      el.find('.text .writeup').append($(parHtml).text(data.writeup));
    }

    el.find('.text .note').text(data.note.join(', '));
    el.find('.text .note').attr('data-label', noteLabel);

    if (data.links) {
      data.links.map(function (e) {
        var link = $($('#dummy-link').html());
        link.children().attr('href', e.href);
        link.children().text(e.title);
        el.find('.text .links').append(link);
      });
    }

    if (data.images.background) {
      el.css('background-image', 'url("' + path + data.images.background + '")');
    }

    if (data.images.poster) {
      el.children('.image-container').css('background-image', 'url("' + path + data.images.poster + '")');
    }

    if ((typeof data.writeup === 'string' && data.writeup.length < 415) ||
      (typeof data.writeup === 'object' && data.writeup.join().length < 415)) {
      var writeup = el.find('.text .writeup');
      writeup.css({
        '-moz-column-fill': 'auto',
        '-webkit-column-fill': 'auto',
        'column-fill': 'auto',
        '-webkit-columns': '80rem' // Webkit does not have column-fill, this is a hack to make it single line
      });
    }

    return el;
  };

  UI.prototype.createLink = function (template, data) {
    var el = $($(template).html());
    var link = el.find('a');
    link.attr({
      'data-url': data.path,
      'href': data.href || '#'
    });
    link.text(data.title);

    if (!data.external) {
      el.click(this.linkClick.bind(this));
    }

    return el;
  };
})();
