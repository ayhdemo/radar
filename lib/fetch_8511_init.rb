tmpset = Set.new

Other::Radar.all.find_each do |sig|
	puts sig.id
	tmpset << sig.radarName unless tmpset.include?(sig.radarName)
end