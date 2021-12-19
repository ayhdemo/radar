class InfosController < ApplicationController
	def index
		id = params[:id]
		count = params[:count]

		sigs = []
		if !id && !count
			sigs << Sig.where(state:9).last
		elsif id && count
			sigs = Sig.where(state:9).where("id >= ? and id < ?", id.to_i , id.to_i + count.to_i)
				
		else
			render json: {
				code: 901,
				msg: "id and count should exist at same time "
			}
			return
		end

		data = sigs_get_data(sigs)

		if data.length > 0

			res = {
				code: 0,
				data: data
			}
			render json: res
		else
			render json: {
				code: 902,
				msg: "NO data with params: id=#{id} and count=#{count}"
			}
		end
	end

	def fanyan
		id = params[:id]
		count = params[:count]

		fanyans =[]
		if !id && !count
			item = Fanyan.last
			fanyans << JSON.parse(item.result).merge!(id:item.id , station_id:item.station_id)
		elsif id && count
			fanyans = Fanyan.where("id >= ? and id < ?", id.to_i , id.to_i + count.to_i).pluck(:result).map{|item| JSON.parse(item)}
		else
			render json: {
				code: 901,
				msg: "id and count should exist at same time "
			}
			return
		end

		if fanyans.length > 0
			res = {
				code: 0,
				data: fanyans
			}
			render json: res
		else
			render json:{
				code: 902,
				msg: "NO data with params: id=#{id} and count=#{count}"
			}
		end
	end

	def charts
		
	end

	private
	def sigs_get_data(sigs)
		data = []
		sigs.each do |sig|
			radars = sig_get_radars(sig)
			data	<<	{
						type: sig.targetType,
						id: sig.id,
						count: radars.length,
						radars: radars
					}
		end
		data
	end

	def sig_get_infos(sig)
		sig.infos.collect{|item| {source:item.source,content:item.content,time:item.time.strftime("%Y-%m-%d")}}
	end

	def sig_get_radars(sig)
		sigs = sig.network ? sig.network.sigs : [sig]
		sigs.collect{|sig|
			{
				sn: sig.sn,
				searchFirst: sig.searchFirst,
				searchLast:  sig.searchLast,
				lon: sig.lon,
				lat: sig.lat,
				ownNation: sig.ownNation,
				addr: sig.addr,
				radarName: sig.radarName,
				platType: sig.platType,
				rfAverage: sig.rfAverage,
				rfMax: sig.rfMax,
				rfMin: sig.rfMin,
				rfType: sig.rfType,
				priAverage: sig.priAverage,
				priMax: sig.priMax,
				priMin: sig.priMin,
				priType: sig.priType,
				bw: sig.bw,
				flatType: sig.flatType,
				radarSys: sig.radarSys,
				radarUseage: sig.radarUseage,
				radarWorkMode: sig.radarWorkMode,
				radarGroup: sig.radarGroup,
				networkType: sig.networkType,
				netInfo: sig_get_infos(sig),
				recover:{
					level: sig.level,
					coverage: sig.coverage,
					sensitive: sig.sensitive,
					direcfig: sig.direcfig
				}
			}
		}
	end
end