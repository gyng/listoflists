# lol.rb
require 'sinatra'
require 'open-uri'
require 'json'

set :public_folder, 'public'
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

get "/" do
  redirect '/index.html'
end

post '/upload' do
  puts params.inspect
  url = params[:post]["input"]
  tempjson = open(url).read;

  if JSON.parse(tempjson)
    filename = Digest::SHA256.hexdigest(tempjson)
    File.open("public/uploads/lists/#{filename}.json", 'w') do |f|
      f.puts tempjson
    end
    redirect "/index.html#uploads/lists/#{filename}.json"
  end
end


# post '/upload' do
#   puts "LOL"
#   unless params[:file] &&
#          (tmpfile = params[:file][:tempfile]) &&
#          (name = params[:file][:filename])
#     @error = "No file selected"
#     return haml(:upload)
#   end
#   STDERR.puts "Uploading file, original name #{name.inspect}"
#   while blk = tmpfile.read(65536)
#     # here you would write it to its final location
#     STDERR.puts blk.inspect
#   end
#   "Upload complete"
# end