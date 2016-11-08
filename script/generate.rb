# This script takes the current directory and generates a base list JSON
# The directory name is used as the filenames for the generated lists

require 'json'

current_directory = File.basename(Dir.pwd)
photos = Dir.glob('*.jpg')
photos_hash = photos.map do |f|
  {
    title: '',
    writeup: '',
    images: {
      poster: f
      # , background: f
    }
  }
end

list_hash = {
  title: '',
  subtitle: '',
  relative_path: true,
  path: ['data', current_directory],
  css: 'photo.css',
  entries: photos_hash
}

File.write("#{current_directory}.json", JSON.pretty_generate(list_hash))

nav_link_hash = {
  href: '#',
  path: File.join('data', current_directory, "#{current_directory}.json"),
  title: current_directory
}

File.write('add_me_to_nav_links.json', JSON.pretty_generate(nav_link_hash))
