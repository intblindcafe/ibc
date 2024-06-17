# script to take json file in proper question format
# and separate multiple choice questions from true/false questions
# making separate files for each category
# run ruby 02-splitter.rb <input_folder>

require 'json'
require 'fileutils'

def split_questions(input_folder)
  Dir.glob("#{input_folder}/*.json") do |file_path|
    mc_questions = []
    tf_questions = []

    File.open(file_path, 'r') do |file|
      questions = JSON.parse(file.read)

      questions.each do |question|
        if question["choices"] && question["choices"].length > 2
          mc_questions << question
        elsif question["choices"] && question["choices"].length == 2
          tf_questions << question
        end
      end
    end

    mc_file_path = file_path.gsub(/([^\/]+)\.json$/, 'mc-\1.json')
    tf_file_path = file_path.gsub(/([^\/]+)\.json$/, 'tf-\1.json')

    File.open(mc_file_path, 'w') { |file| file.write(JSON.pretty_generate(mc_questions)) } unless mc_questions.empty?
    File.open(tf_file_path, 'w') { |file| file.write(JSON.pretty_generate(tf_questions)) } unless tf_questions.empty?
  end
end

if ARGV.empty?
  puts "Usage: ruby script.rb <input_folder>"
  exit 1
end

input_folder = ARGV[0]

unless File.directory?(input_folder)
  puts "Error: #{input_folder} is not a directory."
  exit 1
end

split_questions(input_folder)
puts "Splitting completed successfully!"
