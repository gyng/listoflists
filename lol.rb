require 'sinatra'
require 'open-uri'
require 'json'

OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
set :public_folder, 'public'
set :port, 8083

NUM_RECENT_UPLOADS = 10

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

    list = JSON.parse(tempjson)
    update_newest_uploads(path, list['title'].to_s)
    increment_upload_count

    redirect "/index.html#uploads/lists/#{filename}.json"
  rescue => e
    puts e
    redirect "/"
  end
end

def update_newest_uploads(path, title)
  File.open("public/latest.json", "a+") do |f|
    begin
      latest = JSON.parse(f.read)
    rescue
      latest = []
    end

    latest = latest.take(NUM_RECENT_UPLOADS - 1).unshift({ "path" => path, "title" => title })

    f.truncate(0)
    f.puts latest.to_json
  end
end

def increment_upload_count
  File.open("public/statistics.json", "a+") do |f|
    begin

      puts f.read

      stats = JSON.parse(f.read)
    rescue
      stats = { "uploads" => 0 }
    end

    stats["uploads"] += 1
    f.truncate(0)
    f.puts stats.to_json
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