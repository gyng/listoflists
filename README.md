# listoflists

listoflists is a small file-based declarative static site presenter in vanilla JS.

Designed for presenting collections of things such as lists or photos.

## Features

* No backend
* No generation
* Declarative, file-based, JSON-defined pages
* Responsive flexbox layout
* Optional per-list CSS injection
* Optional Sinatra webapp for basic statistics and JSON list uploads (to get around cross-domain restrictions)

## Installation

### Without file uploads

1. Point web server to `public`

### With file uploads

1. Install Ruby
2. `gem install sinatra thin`
4. The server port can be changed in `lol.rb`. Change `set :port, 8083` to desired port.
3. `ruby lol.rb -o 0.0.0.0`
5. View your site at [http://0.0.0.0:8083](http://0.0.0.0:8083)

## Usage

1. Put your files in a directory, along with a JSON file for content
2. Point to a CSS stylesheet to override styles for the page if desired. Two styles are included in `public/stylesheets`: `base.css` (included with every page) and `photo.css`. You can use your own stylesheet.
3. Visit your rendered page at `index.html/path/to/content.json`
4. Configure navbar links in `public/nav_links.json`

### TODO

* JSON list creator
* Move from *Feeling-Driven Development* to a proper test framework.
