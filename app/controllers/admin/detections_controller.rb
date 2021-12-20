module Admin
	class DetectionsController < Admin::BaseController
		  before_action :init_search_params, only: [:more_detections]
	    before_action :find_detections, only: [:update_comment]

	    def index
	      # @gw_accounts = ChainAsset.select(:id, :chain_type, :asset_id, :out_account_id).all.to_json
	    	if params[:network_id]
	    		network = Network.find(params[:network_id])
	    		@title = network.name
	    		@subtitle = network.networkType
	    	end
	    end

	    def update_comment
	      param = detections_param
	      if @detection.nil?
	        return render :json => {code: 404, data: nil, msg: "记录不存在，编号[#{param[:id]}]"}
	      end

	      if param[:radarSys].nil? && param[:radarUseage].nil? && param[:radarWorkMode].nil? && param[:targetType].nil?
	        return render :json => {code: 400, data: nil, msg: "参数错误，[所有参数]均为空]"}
	      end

	      @detection.update(param)
	      render :json => {code: 200, data: @detection, msg: "记录更新成功，编号[#{param[:id]}]"}
	    end

	    def more_detections
	    	refer_params = Rack::Utils.parse_query URI(request.referer).query

	    	if refer_params["network_id"]
	    		detections_where = Detection.where(network_id: refer_params["network_id"])
	    	else
	    		detections_where = Detection.all
	    	end
				@q = detections_where.ransack(sim_sig_searchFirst_gteq: params[:start1], sim_sig_searchFirst_lteq: params[:end1]).result
	      detections_res = @q.reverse_order
	                    .paginate({page: @page, per_page: @per_page})
	                    .collect{|de_item|
	                    	item = de_item.sim_sig
	                    	tmp = item.as_json
	                    	tmp[:searchFirst] = item[:searchFirst].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:searchLast] = item[:searchLast].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:netInfo] = Netinfo.find_by_name(item[:radarName])&.content
	                    	tmp[:event] = "与SIG: #{de_item.sim_sig_id} 冲突"
	                    	tmp}
	      render :json => {total: @q.count, rows: detections_res}
	    end

			def more_detections_another
	    	refer_params = Rack::Utils.parse_query URI(request.referer).query

	    	if refer_params["network_id"]
	    		detections_where = Detection.where(network_id: refer_params["network_id"])
	    	else
	    		detections_where = Detection.all
	    	end
				@q = detections_where.ransack(sim_sig_searchFirst_gteq: params[:start2], sim_sig_searchFirst_lteq: params[:end2]).result

				detections_res = @q.reverse_order
											.paginate({page: @page, per_page: @per_page})
											.collect{|de_item|
												item = de_item.sim_sig
												tmp = item.as_json
												tmp[:searchFirst] = item[:searchFirst].strftime("%Y-%m-%d %H:%M:%S")
												tmp[:searchLast] = item[:searchLast].strftime("%Y-%m-%d %H:%M:%S")
												tmp[:netInfo] = Netinfo.find_by_name(item[:radarName])&.content
												tmp[:event] = "与SIG: #{de_item.sim_sig_id} 冲突"
												tmp}

	      render :json => {total: @q.count, rows: detections_res}
	    end

	    private

	    # 初始化搜索参数
	    def init_search_params
	      search          = params[:search]
	      only_failed     = params[:only_failed]
	      only_unhandled  = params[:only_unhandled]
	      @order          = 'desc' #params[:order] || 'desc'
	      offset          = get_int_param('offset', 0) # 偏移
	      @per_page       = get_int_param('limit', 10) # 每页个数
	      @page           = (offset / @per_page).to_i + 1

	      # 如果有搜索条件
	      if search
	        search.gsub! ',', ''
	        search_cols = %w(from_chain_type to_chain_type from_account_name from_account_id monitor_account_name monitor_account_id
	                             monitor_account_id monitor_account_name in_asset_id in_asset_name in_amount out_amount
	                             in_trx_id out_trx_id in_block_num in_decrypted_memo process_status comment
	                             out_to_account_name out_to_account_id)
	        @search_condition = search_cols.map {|col| "#{col} like '%%#{search}%%'"}.join(' or ')
	      else
	        @search_condition = ''
	      end

	      return unless only_unhandled || only_failed

	      now               = 10.minutes.ago.utc.strftime('%Y-%m-%dT%H:%M:%S')
	      extra_conditions  = ''
	      if only_unhandled
	        extra_conditions += "process_status<> 'start' and in_block_time< '#{now}' and comment = ''"
	      elsif only_failed
	        extra_conditions += "process_status<> 'end' and in_block_time< '#{now}'"
	      end

	      return @search_condition = extra_conditions if @search_condition.empty?

	      @search_condition = extra_conditions + ' and (' + @search_condition + ')'
	    end

	    def find_detections
	      @detection = Detection.find(params[:detection_id]) rescue nil
	    end

	    def detections_param
	      param = params.require(:detection).permit(:radarSys,:radarUseage,:radarWorkMode,:targetType)
	      # param[:comment]&.strip!
	      # pp param
	      param
	    end
	end
end
