module Admin
  class ChainAssetsController < Admin::BaseController
    # respond_to :html, :json, :js
    before_action :find_chain, only: [:index, :create, :update, :more_chain_asset, :more_monitor_account, :monitor_account]
    before_action :find_chain_asset, only: [:more_monitor_account, :monitor_account]

    def index

    end

    def create
      m_asset     = @chain.chain_assets.new(chain_asset_params)
      asset_id    = m_asset[:asset_id]
      account_id  = m_asset[:out_account_id]
      asset       = @chain_template.search_asset(asset_id)
      account     = ChainAccount.find(account_id) rescue nil   # 从数据库读取账户信息
      return render :json => {code: 404, data: nil, msg: "asset [#{asset_id}] not found."} if asset.nil?
      return render :json => {code: 404, data: nil, msg: "account [#{account_id}] not found."} if account.nil?

      begin
        m_asset.asset_name = asset[:asset_name]
        if m_asset.chain_type == 'erc20'
          # 使用客户端提交的精度
        else
          m_asset.precision = asset[:precision]
        end
        m_asset.out_account_id = account[:account_id]
        m_asset.out_account_name = account[:account_name]

        m_asset.save
        render :json => {code: 200, data: m_asset, msg: "asset [#{asset_id}] created."}
      rescue ActiveRecord::RecordNotUnique
        return render :json => {code: 500, data: nil, msg: "资产[#{asset_id}]已存在"}
      rescue Exception => e
        chain_logger.error(self, e.to_s)
        chain_logger.error(self, e.backtrace.join("\n"))
        return render :json => {code: 500, data: nil, msg: "create asset [#{asset_id}] failed."}
      end
    end

    def update
      asset_id = params[:id]
      param    = chain_asset_update_params
      m_out_account             = ChainAccount.find(param[:out_account_id]) rescue nil
      param[:out_account_id]    = m_out_account&.account_id
      param[:out_account_name]  = m_out_account&.account_name

      @chain.chain_assets.find(asset_id).update(param)
      render :json => {code: 200, data: @asset, msg: 'success'}
    end

    def more_chain_asset
      chain_type = @chain.chain_type
      search = params[:search]
      offset = get_int_param('offset', 0) # 偏移
      per_page = get_int_param('limit', 10) # 每页个数
      page = (offset / per_page).to_i + 1
      data = @chain.chain_assets
                 .paginate({page: page, per_page: per_page})
                 .map {|m_asset|
                   monitor_account_list = m_asset.chain_accounts
                   asset_j = m_asset.as_json
                   asset_j[:monitor_accounts] = monitor_account_list
                   asset_j
                 }
      all_count = ChainAsset.where("chain_type=?", chain_type).count

      render :json => {code: 200, total: all_count, data: data}
    end

    def more_monitor_account
      data = @asset.chain_accounts.all

      render :json => {code: 200, total: data.size, data: data}
    end

    # post
    def monitor_account
      @asset.add_monitor_account(params[:account_id])

      render :json => {code: 200, data: ChainAccount.find(params[:account_id]), msg: 'success!'}
    end

    def disable
      ids = params[:asset_ids]
      ids&.each {|id|
        # TODO 通知链资产被禁用
        ChainAsset.where('id=?', id).update(:enabled => false)
      }
      render :json => {code: 200, data: nil, msg: 'success'}
    end

    def enable
      ids = params[:asset_ids]
      ids&.each {|id|
        # TODO 通知链资产被启用
        ChainAsset.where('id=?', id).update(:enabled => true)
      }
      render :json => {code: 200, data: nil, msg: 'success'}
    end

    private

    def find_chain
      chain_id = params[:chain_id]
      @chain = Chain.find_by_id(chain_id)
      @chain_template = ChainManager.instance.get_chain_by_chain_type(@chain.chain_type)
    end

    def find_chain_asset
      asset_id = params[:chain_asset_id]
      @asset = @chain.chain_assets.find(asset_id)
    end

    def chain_asset_params
      params.require(:chain_asset).permit!
    end

    def chain_asset_update_params
      params.require(:chain_asset).permit(:precision, :asset_alias, :out_account_id, :out_account_name, :enabled)
    end
  end
end