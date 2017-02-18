require 'sinatra'

set :public_folder, 'public'
set :port, 8083

# Note: lol.rb is deprecated. Simply host the /public directory
# with your webserver of choice.

get '/' do
  redirect '/index.html'
end
