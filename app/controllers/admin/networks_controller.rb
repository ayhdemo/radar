module Admin
	class NetworksController < Admin::BaseController
		before_action :init_search_params, only: [:more_networks]
	    before_action :find_networks, only: [:index, :show]

	    def index
	      # @gw_accounts = ChainAsset.select(:id, :chain_type, :asset_id, :out_account_id).all.to_json
	    end

	    def show
	    end

	    def update_comment
	      param = networks_param
	      if @history.nil?
	        return render :json => {code: 404, data: nil, msg: "记录不存在，编号[#{param[:id]}]"}
	      end

	      if param[:comment].nil?
	        return render :json => {code: 400, data: nil, msg: "参数错误，[comment]为空]"}
	      end

	      @history.update(:comment => param[:comment])
	      render :json => {code: 200, data: @history, msg: "记录更新成功，编号[#{param[:id]}]"}
	    end

	    def more_networks
	      networks_where = Network.all
	      networks_res = networks_where.reverse_order
	                    .paginate({page: @page, per_page: @per_page})
	                    .collect{|item| 
	                    	tmp = item.as_json
	                    	tmp[:searchFirst] = item[:searchFirst].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:searchLast] = item[:searchLast].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:level] = "99"
	                    	tmp}
	                    # .order("in_block_time #{@order}")

	      render :json => {total: networks_where.count, rows: networks_res}
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

	    def find_networks
	      @network = Network.find(params[:id]) rescue nil
	    end

	    def networks_param
	      param = params.require(:history)
	      param[:comment]&.strip!
	      param
	    end
	end
end
