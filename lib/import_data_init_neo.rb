	## 实体:  Sig , Radar ， Geohash ,技术体制，雷达用途, 工作模式 , netInfo
	## 链接: 

Sig.all.each do |sig|

	puts "sig id :  #{sig.id}"


	Nt.create_sig(sig)

	Nt.create_radar(sig.radarName) if sig.radarName  ## 雷达型号

	geohash = GeoHash.encode(sig.lat, sig.lon,6)
	Nt.create_geohash(geohash) if geohash
	Nt.create_radarSys(sig.radarSys) if sig.radarSys
	Nt.create_radarUseage(sig.radarUseage) if sig.radarUseage
	Nt.create_radarWorkMode(sig.radarWorkMode) if sig.radarWorkMode

	Nt.rel_radar_sig(sig.radarName,sig.sn) if sig.radarName
	Nt.rel_sig_geohash(sig.sn, geohash) if sig.sn
	Nt.rel_radar_radarSys(sig.radarName,sig.radarSys) if sig.radarName && sig.radarSys
	Nt.rel_radar_radarUseage(sig.radarName, sig.radarUseage) if sig.radarName && sig.radarUseage
	Nt.rel_radar_radarWorkMode(sig.radarName, sig.radarWorkMode) if sig.radarName && sig.radarWorkMode

end