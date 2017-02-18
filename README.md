# listoflists

listoflists is a small file-based declarative static site presenter in vanilla JS.

Designed for presenting collections of things such as lists or photos.

## Features

* No backend
* No generation
* Declarative, file-based, JSON-defined pages
* Responsive flexbox layout
* Optional per-list CSS injection

## Installation

1. Point a web server to `public`

## Usage

1. Put your files in a directory, along with a JSON file for content
2. Point to a CSS stylesheet to override styles for the page if desired. Two styles are included in `public/stylesheets`: `base.css` (included with every page) and `photo.css`. You can use your own stylesheet.
3. Visit your rendered page at `index.html/path/to/content.json`
4. Configure navbar links in `public/nav_links.json`

## Generating a list

`generate.rb` is a script that builds a starter JSON list from JPEG images in the directory `generate.rb` is in. Useful for generating a list of photos.

    $ cp script/generate.rb path/to/my_photo_directory
    $ cd path/to/my_photo_directory
    $ ruby generate.rb
    $ rm generate.rb

`generate.rb` spits out two files, a barebones list itself and a JSON fragment which can be added to `nav_links.json`.

### TODO

* Move from *Feeling-Driven Development* to a proper test framework.
