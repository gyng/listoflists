# listoflists

List of Lists is a small Javascript + Sinatra web application for the creation and presentation of JSON-defined lists. Flexbox support is required for viewing. I also hate parallax scrolling effects which is why I'm using them.

## Installation

1. Install Ruby
2. Install sinatra and thin gems

        gem install sinatra
        gem install thin

3. Run the Sinatra app with

        ruby lol.rb -o 0.0.0.0

4. View your site at [http://localhost:8083](http://localhost:8083)

## Config
The port can be changed in `lol.rb`. Change `set :port, 8083` to whichever port you desire.

## Features

* Flexbox responsive layout
* JSON-defined lists
* Decent design
* Sinatra webapp for basic statistics and JSON list uploads (no more cross-domain restrictions!)

### TODO

* JSON list creator
* Move from *Feeling-Driven Development* to a proper test framework.