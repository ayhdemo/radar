###
tmphash = {}
LeaderMax = 5

Sig.all.find_each do |sig|
	puts sig.id

	if sig.radarSys && sig.radarUseage  ## radarSys 与 radarUseage 都存在才能选举为Leader
		if tmphash[sig.radarName]
			tmphash[sig.radarName] += 1 
		else
			tmphash[sig.radarName] = 1
		end

		if tmphash[sig.radarName] <= LeaderMax 
			sig.update(leader:1 , radarWorkMode:Sig.rand_radarWorkMode, radarGroup: "国土防空网")
			### 填写工作模式
			### 填写群目标： 国土防空网
		end
	end
end





