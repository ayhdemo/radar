class Admin::BindMapsController < Admin::BaseController
  def erc20
  end

  def common
  end

  def more_erc20_bind_maps
    search    = params[:search]
    offset    = get_int_param('offset', 0) # 偏移
    per_page  = get_int_param('limit', 10) # 每页个数

    page      = (offset / per_page).to_i + 1
    bind_maps = EthMap.where('account_id is not null')
    if search && search.length > 0
      search.strip!
      bind_maps = bind_maps.where('account_id=? or account_name=? or eth_address=?', search, search, search)
    end
    data      = bind_maps.order('id desc').paginate({page: page, per_page: per_page})
    all_count = bind_maps.count

    render :json => {code: 200, total: all_count, data: data}
  end

  def more_common_bind_maps
    search    = params[:search]
    offset    = get_int_param('offset', 0) # 偏移
    per_page  = get_int_param('limit', 10) # 每页个数

    page      = (offset / per_page).to_i + 1
    bind_maps = BindMap.where('account_id is not null')
    if search && search.length > 0
      search.strip!
      bind_maps = bind_maps.where('account_id=? or account_name=? or address=?', search, search, search)
    end
    data      = bind_maps.order('id desc').paginate({page: page, per_page: per_page})
    all_count = bind_maps.count

    render :json => {code: 200, total: all_count, data: data}
  end
end