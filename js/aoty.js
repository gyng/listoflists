(function () {
    "use strict";

    $(document).ready(function () {
        new UI();
    });

    function UI() {
        window.onpopstate = this.onpopstate.bind(this);

        if (window.location.hash) {
            this.navigate(window.location.hash.replace(/^#/, ''));
        }

        $('.page').click(function (e) {
            e.preventDefault();
            $('.active-page').removeClass('active-page');
            var el = $(e.target);
            el.addClass('active-page');
            this.navigate(el.attr('data-url'), true);
        }.bind(this));

        $(window).scroll(function () {
            $(".entry").css("background-position", "33% " + (20 * $(this).scrollTop() / $(window).height()) + "%");
        });
    }

    // For window.onpopstate.
    UI.prototype.onpopstate = function (e) {
        if (e.state) {
            this.navigate(e.state["url"]);

            if (e.state["active_page"]) {
                $('.active-page').removeClass('active-page');
                $('.page[data-url="' + e.state["active_page"] + '"]').addClass('active-page');
            }
        }
    };

    UI.prototype.navigate = function (url, updateState) {
        $.getJSON(url, function (data) {
            if (updateState === true) {
                var state = {};
                state["url"] = url;
                state["active_page"] = $(".active-page").attr("data-url");
                window.location.hash = url;
                // window.location.hash creates a history item so we replace that
                window.history.replaceState(state, data["title"], window.location.href);
            }

            document.title = data["title"];
            this.populateEntries(data);
        }.bind(this));
    };

    UI.prototype.populateEntries = function (data) {
        $('.entries').empty();
        var relPath = data["relative_path"] ? data["path"].join("/") + "/" : '';
        $(".list-header").children().text('');
        $(".list-title").text(data["title"]);
        $(".list-subtitle").text(data["subtitle"]);

        data["entries"].map(function (entry) {
            $('.entries').append(this.createEntry(entry, relPath, data["note_label"]));
        }.bind(this));
    };

    UI.prototype.createEntry = function (data, path, noteLabel) {
        var el = $($("#dummy-source").html());

        el.children('.label').text(data["label"]);
        el.find('.text .title').text(data["title"]);
        el.find('.text .subtitle').text(data["subtitle"]);
        el.find('.text .subsubtitle').text(data["subsubtitle"]);
        el.find('.text .writeup').text(data["writeup"]);
        el.find('.text .note').text(data["note"].join(", "));
        el.find('.text .note').attr("data-label", noteLabel);
        el.css("background-image", 'url("' + path + data["images"]["background"] + '")');
        el.children('.image-container').css("background-image", 'url("' + path + data["images"]["poster"] + '")');

        if (data["writeup"].length < 400) {
            var writeup = el.find('.text .writeup');
            writeup.css({
                "-moz-column-fill": "auto",
                "-webkit-column-fill": "auto",
                "column-fill": "auto",
                "-webkit-columns": "80rem" // Webkit does not have column-fill, this is a hack to make it single line
            });
        }

        return el;
    };
})();