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
  begin
    input = params[:post]["input"]

    if input.is_json?
      tempjson = input
    else
      # It's a URL
      tempjson = open(input).read
      if !tempjson.is_json?
        # Not JSON, invalid JSON at URL
        redirect "/"
      end
    end

    # Valid JSON
    filename = Digest::SHA256.hexdigest(tempjson)
    path = "uploads/lists/#{filename}.json"

    File.open("public/#{path}", 'w') do |f|
      f.puts tempjson
    end

    # Update newest uploads
    File.open("public/latest.json", "w+") do |f|
      list = JSON.parse(tempjson)

      begin
        latest = JSON.parse(f.read)
      rescue
        latest = []
      end

      latest = latest.take(9).push({ "path" => path.to_s, "title" => list['title'].to_s })
      f.puts latest.to_json
    end

    # Update statistics
    File.open("public/statistics.json", "w+") do |f|
      begin
        stats = JSON.parse(f.read)
      rescue
        stats = { uploads: 0 }
      end

      stats[:uploads] += 1
      f.puts stats.to_json
    end

    redirect "/index.html#uploads/lists/#{filename}.json"
  rescue
    redirect "/"
  end
end

class String
  def is_json?
    begin
      !!JSON.parse(self)
    rescue
      false
    end
  end
end