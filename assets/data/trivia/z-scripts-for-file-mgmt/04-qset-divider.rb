# script to divide a json question set
# into equal sets for different game night rotations
# run ruby 04-qset-divider.rb input_file.json num_sets

require 'json'
require 'pathname'

# Check if correct number of arguments provided
unless ARGV.length == 2
  puts "Usage: ruby divide_questions.rb input_file.json num_sets"
  exit
end

input_file = Pathname.new(ARGV[0])
num_sets = ARGV[1].to_i

# Read the JSON file
questions = JSON.parse(input_file.read)

# Initialize empty sets
question_sets = Array.new(num_sets) { [] }

# Divide questions into sets
questions.each_with_index do |question, index|
  set_index = index % num_sets
  question_sets[set_index] << question
end

# Write questions to separate files
question_sets.each_with_index do |questions, index|
  output_file = "qset#{index + 1}.json"
  output_path = input_file.dirname.join(output_file)
  output_path.write(JSON.pretty_generate(questions))
  puts "Questions written to #{output_path}"
end
