require "csv"

CSV.foreach("radars.csv",headers:false) do |row|
	p row
	begin
		Netinfo.create(name: row[1], content: row[2], radarWorkMode: row[3])
	rescue Exception => e
		puts e
	end
end


#### 

Netinfo.where.not(radarWorkMode:nil).find_each do |netinfo|
	Sig.where(radarName: netinfo.name).find_each do |sig|
		if sig.radarWorkMode
			puts "已存在"
		else
			sig.update(radarWorkMode: netinfo.radarWorkMode) 
			puts "更新Sig #{sig.id}"
		end
	end
end

### 添加到图里