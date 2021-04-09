class Nt

	## 实体:  Sig , Radar ， Geohash ,技术体制，雷达用途, 工作模式 , netInfo
	## 链接: 


	def self.create_sig(sig)
		 ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run "MERGE (u: Sig {
			 			sn: #{sig.sn}
			 	})"
			 	end
		 end
	end

	def self.create_radar(radarName)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run "MERGE (u: Radar {
			 			radarName: $radarName
			 	})", {radarName:radarName}
			 	end
		 end
	end

	def self.create_geohash(geohash)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run "MERGE (u: Geohash {
			 			geohash: $geohash
			 	})",{geohash: geohash}
			 	end
		 end
	end

	def self.create_radarSys(radarSys)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run "MERGE (u: radarSys {
			 			radarSys: $radarSys
			 	})",{radarSys:radarSys}
			 	end
		end
	end

	def self.create_radarUseage(radarUseage)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run "MERGE (u: radarUseage {
			 			radarUseage: $radarUseage
			 	})", {radarUseage:radarUseage}
			 	end
		end
	end

	def self.create_radarWorkMode(radarWorkMode)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run "MERGE (u: radarWorkMode {
			 			radarWorkMode: $radarWorkMode
			 	})", {radarWorkMode:radarWorkMode}
			 	end
		end
	end

	def self.rel_radar_sig(radarName,sn)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run 'MATCH (a:Radar {radarName: $radarName}) ' \
         'MATCH (b:Sig {sn: $sn}) ' \
         'MERGE (a)-[:own]->(b)', {radarName:radarName, sn:sn}
			 	end
		end
	end

	def self.rel_sig_geohash(sn,geohash)
		begin
			ActiveGraph::Base.driver.session do |session|
				 	sig = session.write_transaction do |tx|
				 		result = tx.run 'MATCH (a:Sig {sn: $sn}) ' \
	         'MATCH (b:Geohash {geohash: $geohash}) ' \
	         'MERGE (a)-[:detectedat]->(b)', {sn:sn, geohash:geohash}
				 	end
			end
		rescue Exception => e
      puts e
    end
	end

	def self.rel_radar_radarSys(radarName,radarSys)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run 'MATCH (a:Radar {radarName: $radarName}) ' \
         'MATCH (b:radarSys {radarSys: $radarSys}) ' \
         'MERGE (a)-[:sys]->(b)', {radarName:radarName, radarSys:radarSys}
			 	end
		end
	end
	def self.rel_radar_radarUseage(radarName,radarUseage)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run 'MATCH (a:Radar {radarName: $radarName}) ' \
         'MATCH (b:radarUseage {radarUseage: $radarUseage}) ' \
         'MERGE (a)-[:useage]->(b)', {radarName:radarName, radarUseage:radarUseage}
			 	end
		end
	end
	def self.rel_radar_radarWorkMode(radarName,radarWorkMode)
		ActiveGraph::Base.driver.session do |session|
			 	sig = session.write_transaction do |tx|
			 		result = tx.run 'MATCH (a:Radar {radarName: $radarName}) ' \
         'MATCH (b:radarWorkMode {radarWorkMode: $radarWorkMode}) ' \
         'MERGE (a)-[:workmode]->(b)', {radarName:radarName, radarWorkMode:radarWorkMode}
			 	end
		end
	end

	def self.exec_cypher(cypher)
		ActiveGraph::Base.driver.session do |session|
			session.write_transaction do |tx|
				result = tx.run cypher
			end
		end
	end

end