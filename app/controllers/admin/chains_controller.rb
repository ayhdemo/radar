module Admin
  class ChainsController < Admin::BaseController
    respond_to :html, :json, :js
    before_action :find_chain, only: [:update, :edit, :search_asset, :search_account]

    def index
    end

    def edit

    end

    def start_scheduler
      ChainManager.instance.run unless ChainManager.running

      render :json => {code: 200, data: nil, msg: '操作成功'}
    end

    def stop_scheduler
      ChainManager.instance.stop if ChainManager.running

      render :json => {code: 200, data: nil, msg: '操作成功'}
    end

    def update
      # @chain = Chain.find(params[:id]).update(chain_params)
      @chain.update(chain_params)
      respond_with '', location: admin_chains_path
      # render :json => {code: 200, data: @chain, msg: 'success'}
    end

    # 更新资产，允许操作： 更新手续费、启用/关闭
    def update_asset
      params.require(:chain_asset).permit!(:asset_id, :fee, :enabled)
    end

    def search_asset
      chain = ChainManager.instance.get_chain_by_chain_type(@chain.chain_type)
      asset = chain.search_asset(params[:asset_id] || params[:asset_name]) rescue nil
      if asset.nil?
        render :json => {code: 404, data: asset}
      else
        render :json => {code: 200, data: asset}
      end
    end

    def search_account
      chain = ChainManager.instance.get_chain_by_chain_type(@chain.chain_type)
      account = chain.search_account(params[:account_id] || params[:account_name]) rescue nil
      if account.nil?
        render :json => {code: 404, data: account}
      else
        render :json => {code: 200, data: account}
      end
    end

    def more_chain
      search = params[:search]
      offset = get_int_param('offset', 0) # 偏移
      per_page = get_int_param('limit', 10) # 每页个数

      page = (offset / per_page).to_i + 1

      data = Chain.where("chain_type like ?", "%%#{search}%%")
                 .paginate({page: page, per_page: per_page})
      all_count = Chain.count

      render :json => {code: 200, total: all_count, data: data}
    end

    def disable
      chain_types = params[:chain_types]
      chain_types&.each {|chain_type|
        ChainManager.instance.disable_chain(chain_type)
      }
      render :json => {code: 200, data: nil, msg: 'success!'}
    end

    def enable
      chain_types = params[:chain_types]
      chain_types&.each {|chain_type|
        chain = ChainManager.instance.get_chain_by_chain_type(chain_type)
        next unless chain

        chain.enable
      }
      render :json => {code: 200, data: nil, msg: 'success!'}
    end

    private

    def find_chain
      chain_id = params[:id]
      @chain = Chain.find_by_id(chain_id)
    end

    def chain_params
      params.require(:chain).permit(:chain_uuid, :interval, :enabled) #:chain_type not permitted to change
    end
  end
end
