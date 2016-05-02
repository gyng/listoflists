(function () {
  'use strict';

  var bLazy;

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
      updateState: true
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
        $('.page > a[data-url="' + e.state.activePage + '"]').addClass('active-page');
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

      document.title = data.title || (data.entries[0] ? data.entries[0].title : false) || 'List of Lists';
      this.loadCSS(data);
      this.populateEntries(data);
      bLazy.revalidate();
    }.bind(this));
  };

  UI.prototype.loadCSS = function (data) {
    var injectedStyleEl = $('#injected-style');
    if (data.css) {
      var path = this.getRelativePath(data);
      injectedStyleEl.attr('href', path + data.css);
    } else {
      injectedStyleEl.attr('href', '');
    }
  };

  UI.prototype.getRelativePath = function (data) {
    return data.relative_path ? data.path.join('/') + '/' : '';
  };

  UI.prototype.populateEntries = function (data) {
    $('.entries').empty();
    var relPath = this.getRelativePath(data);
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
    if (Array.isArray(data.writeup)) {
      data.writeup.each(function (paragraph) {
        el.find('.text .writeup').append($(parHtml).text(paragraph));
      });
    } else {
      el.find('.text .writeup').append($(parHtml).text(data.writeup));
    }

    if (data.note) {
      el.find('.text .note').text(data.note.join(', '));
      el.find('.text .note').attr('data-label', noteLabel);
    }

    if (Array.isArray(data.links)) {
      data.links.each(function (e) {
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
      var imageContainer = el.children('.image-container');
      var transparentGif = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      imageContainer.attr('data-src', path + data.images.poster);
      imageContainer.css('background-image', transparentGif);
    }

    var writeup;
    if ((typeof data.writeup === 'string' && data.writeup.length > 415) ||
      (typeof data.writeup === 'object' && data.writeup.join().length > 415)) {
      writeup = el.find('.text .writeup');
      writeup.addClass('long');
      writeup.addClass('columnar-text');
    } else if (typeof data.writeup === 'undefined' ||
      data.writeup === null || data.writeup === '') {
      writeup = el.find('.text');

      writeup.css('background', 'transparent');
    }

    return el;
  };

  UI.prototype.createLink = function (template, data) {
    var el = $($(template).html());
    var link = el.find('a');
    link.attr({
      'data-url': data.path,
      href: data.href || '#'
    });
    link.text(data.title);

    if (!data.external) {
      el.click(this.linkClick.bind(this));
    }

    return el;
  };

  $(document).ready(function () {
    bLazy = new Blazy();
    new UI();
  });
}());
