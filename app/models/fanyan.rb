class Fanyan < ApplicationRecord

	serialize :result

	def self.get_data
		file = File.read("pys/fanyan.json")
		data = JSON.parse(file)
	end

end