module Admin
	class SigsController < Admin::BaseController
		  before_action :init_search_params, only: [:more_sigs]
	    before_action :find_sigs, only: [:update_comment]

	    def index
	      # @gw_accounts = ChainAsset.select(:id, :chain_type, :asset_id, :out_account_id).all.to_json
	    	if params[:network_id]
	    		network = Network.find(params[:network_id])
	    		@title = network.name
	    		@subtitle = network.networkType
	    	end
	    end

	    def update_comment
	      param = sigs_param
	      if @sig.nil?
	        return render :json => {code: 404, data: nil, msg: "记录不存在，编号[#{param[:id]}]"}
	      end

	      if param[:radarSys].nil? && param[:radarUseage].nil? && param[:radarWorkMode].nil? && param[:targetType].nil?
	        return render :json => {code: 400, data: nil, msg: "参数错误，[所有参数]均为空]"}
	      end

	      @sig.update(param)
	      render :json => {code: 200, data: @sig, msg: "记录更新成功，编号[#{param[:id]}]"}
	    end

	    def more_sigs

	    	refer_params = Rack::Utils.parse_query URI(request.referer).query
	    	puts 11111
	    	p refer_params

	    	if refer_params["network_id"]
	    		sigs_where = Sig.where(network_id: refer_params["network_id"]) 
	    	else
	    		sigs_where = Sig.all
	    	end
	      sigs_res = sigs_where.reverse_order
	                    .paginate({page: @page, per_page: @per_page})
	                    .collect{|item| 
	                    	tmp = item.as_json
	                    	tmp[:searchFirst] = item[:searchFirst].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:searchLast] = item[:searchLast].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:netInfo] = Netinfo.find_by_name(item[:radarName])&.content
	                    	# tmp[:level] = "99"
	                    	tmp}
	                    # .order("in_block_time #{@order}")

	      render :json => {total: sigs_where.count, rows: sigs_res}
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
	        extra_conditions += "process_status<> '#{TrxStatus::AUTO_OUT_CONFIRMED}' and in_block_time< '#{now}' and comment = ''"
	      elsif only_failed
	        extra_conditions += "process_status<> '#{TrxStatus::AUTO_OUT_CONFIRMED}' and in_block_time< '#{now}'"
	      end

	      return @search_condition = extra_conditions if @search_condition.empty?

	      @search_condition = extra_conditions + ' and (' + @search_condition + ')'
	    end

	    def find_sigs
	      @sig = Sig.find(params[:sig_id]) rescue nil
	    end

	    def sigs_param
	      param = params.require(:sig).permit(:radarSys,:radarUseage,:radarWorkMode,:targetType)
	      # param[:comment]&.strip!
	      # pp param
	      param
	    end
	end
end
