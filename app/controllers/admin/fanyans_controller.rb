module Admin
	class FanyansController < Admin::BaseController

		before_action :init_search_params, only: [:more_fanyans]
	    before_action :find_fanyans, only: [:update_comment]

	    def index
	    	if File.exists? Rails.root.join('pys/fanyan.json')
					@json_content = File.read(Rails.root.join('pys/fanyan.json'))
				else
					@json_content = File.read(Rails.root.join('pys/fanyan-default.json'))
				end
	    end

		def upload_csv

			Syslog.create(log_type: "威力反演", content:"开始威力反演.." )

			file_name = params['upload']['datafile'].original_filename if (params['upload']['datafile'] !='')    
			file_content = params['upload']['datafile'].read
		
			# puts file_name

			File.open(Rails.root.join('pys/position.csv'), "wb")  do |f|  
				f.write(file_content) 
			end

			if Gem.win_platform?
				`python pys/loss_calculation_new.py`
			else
				`python3 pys/loss_calculation_new.py`
			end

			@json_content = File.read(Rails.root.join('pys/fanyan.json'))
			Syslog.create(log_type: "威力反演", content:@json_content )
			station_id = file_name.split(".")[0].to_i

			Fanyan.create(result:@json_content,station_id: station_id)

			Syslog.create(log_type: "威力反演", content:"威力反演完成" )
			render :json => @json_content
		end

	    def more_fanyans
	       fanyans_where = Fanyan.all
	      fanyans_res = fanyans_where.reverse_order
	                    .paginate({page: @page, per_page: @per_page})
	                    .collect{|item| 
	                    	tmp = item.as_json
	                    	tmp[:searchFirst] = item[:searchFirst].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:searchLast] = item[:searchLast].strftime("%Y-%m-%d %H:%M:%S")
	                    	tmp[:level] = "99"
	                    	tmp}
	                    # .order("in_block_time #{@order}")

	      render :json => {total: fanyans_where.count, rows: fanyans_res}
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

	    def find_fanyans
	      @history = History.find(params[:history_id]) rescue nil
	    end

		def fanyans_param
			params.permit
	    end
	end
end
