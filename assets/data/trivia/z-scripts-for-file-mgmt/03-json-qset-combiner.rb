# script to combine json's of like format
# so that we can have one file for multiple choice
# one file for true false
# or one file of all questions
# regardless of question category
# run using ruby 03-json-qset-combiner.rb <input_folder> <output_file>

require 'json'
require 'pathname'

def combine_json_files(input_folder, output_file)
  combined_questions = []

  Pathname.new(input_folder).children.each do |file_path|
    next unless file_path.extname.downcase == ".json"

    puts "Processing file: #{file_path}"
    begin
      file = File.open(file_path, 'r')
      questions = JSON.parse(file.read)
      unless questions.is_a?(Array)
        puts "Error: File #{file_path} does not contain an array of questions."
        exit 1
      end
      combined_questions.concat(questions)
      file.close
    rescue JSON::ParserError => e
      puts "Error parsing JSON in file #{file_path}: #{e.message}"
      exit 1
    end
  end

  if combined_questions.empty?
    puts "Error: No JSON files found in #{input_folder}."
    exit 1
  end

  File.open(output_file, 'w') { |file| file.write(JSON.pretty_generate(combined_questions)) }
end

if ARGV.length != 2
  puts "Usage: ruby combine_json.rb <input_folder> <output_file>"
  exit 1
end

input_folder = ARGV[0]
output_file = ARGV[1]

unless File.directory?(input_folder)
  puts "Error: #{input_folder} is not a directory."
  exit 1
end

combine_json_files(input_folder, output_file)
puts "Combining completed successfully! Output file: #{output_file}"
