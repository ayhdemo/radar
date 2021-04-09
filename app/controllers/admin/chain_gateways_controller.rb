module Admin
  class ChainGatewaysController < Admin::BaseController
    before_action :find_gateway, only: [:update]

    def index
    end

    def create
      param = chain_gateway_param

      from_asset_id = param[:from_asset_id]
      to_asset_id   = param[:to_asset_id]

      param[:from_chain_type] = ChainAsset.find(from_asset_id).chain_type
      param[:to_chain_type] = ChainAsset.find(to_asset_id).chain_type

      @gateway = ChainGateway.create!(param) rescue nil

      if @gateway.nil?
        render :json => {code: 500, data: nil, msg: '创建失败'}
      else
        render :json => {code: 200, data: @gateway, msg: '创建成功'}
      end
    end

    def update
      return render :json => {code: 404, data: nil, msg: '网关不存在'} if @gateway.nil?

      @gateway.update(update_chain_gateway_param)
      render :json => {code: 200, data: @gateway, msg: '修改成功'}
    end

    def more_gateway
      offset = get_int_param('offset', 0) # 偏移
      per_page = get_int_param('limit', 10) # 每页个数

      page = (offset / per_page).to_i + 1
      data = ChainGateway.all.paginate({page: page, per_page: per_page})
      res = data.map do |gw|
        from_asset = gw.from_asset
        to_asset = gw.to_asset
        from_asset_j = from_asset.as_json
        to_asset_j = to_asset.as_json
        accounts = from_asset.chain_accounts
        from_asset_j[:monitor_accounts] = accounts
        {
            id: gw.id,
            fee: gw.fee,
            to_asset: to_asset_j,
            enabled: gw.enabled,
            from_asset: from_asset_j,
            min_out_amount: gw.min_out_amount,
            fee_percent_mode: gw.fee_percent_mode,
        }
      end
      all_count = ChainGateway.count

      render :json => {code: 200, total: all_count, data: res}
    end

    def disable
      ids = params[:ids]
      ids&.each {|id|
        # TODO 通知链资产被禁用
        ChainGateway.where('id=?', id).update(:enabled => false)
      }
      render :json => {code: 200, data: nil, msg: 'success!'}
    end

    def enable
      ids = params[:ids]
      ids&.each {|id|
        # TODO 通知链资产被禁用
        ChainGateway.where('id=?', id).update(:enabled => true)
      }
      render :json => {code: 200, data: nil, msg: 'success!'}
    end

    private

    def find_gateway
      @gateway = ChainGateway.find(params[:id]) rescue nil
    end

    def chain_gateway_param
      params.require(:chain_gateway).permit!
    end

    def update_chain_gateway_param
      params.require(:chain_gateway).permit(:min_out_amount, :fee, :fee_percent_mode, :enabled)
    end
  end
end