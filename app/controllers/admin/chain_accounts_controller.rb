module Admin
  class ChainAccountsController < Admin::BaseController
    # respond_to :html, :json, :js
    before_action :find_chain, only: [:index, :create, :update, :more_chain_account]

    def index

    end

    def create
      m_account = @chain.chain_accounts.new(chain_account_params)
      account_id = m_account[:account_id]
      account = @chain_template.search_account(account_id)
      return render :json => {code: 404, data: nil, msg: "account [#{account_id}] not found."} if account.nil?

      begin
        m_account.account_name = account[:account_name]
        m_account.save
        render :json => {code: 200, data: m_account, msg: "account [#{account_id}] created."}
      rescue
        render :json => {code: 500, data: nil, msg: "create account [#{account_id}] failed."}
      end
    end

    def update

    end

    def more_chain_account
      search    = params[:search]
      offset    = get_int_param('offset', 0) # 偏移
      per_page  = get_int_param('limit', 10) # 每页个数

      page      = (offset / per_page).to_i + 1
      accounts  = @chain.chain_accounts
      if search && search.length > 0
        search.strip!
        accounts = accounts.where('account_id=? or account_name=?', search, search)
      end
      data      = accounts.paginate({page: page, per_page: per_page})
      all_count = accounts.count

      render :json => {code: 200, total: all_count, data: data}
    end

    def disable
      ids = params[:account_ids]
      type = params[:type]
      key = "#{type}_enabled"
      ids&.each {|id|
        # TODO 通知链账户被禁用
        ChainAccount.where('id=?', id).update(key.to_sym => false)
      }
      render :json => {code: 200, data: nil, msg: 'success'}
    end

    def enable
      ids = params[:account_ids]
      type = params[:type]
      key = "#{type}_enabled"
      ids&.each {|id|
        # TODO 通知链账户被启用
        ChainAccount.where('id=?', id).update(key.to_sym => true)
      }
      render :json => {code: 200, data: nil, msg: 'success'}
    end

    private

    def find_chain
      chain_id = params[:chain_id]
      @chain = Chain.find_by_id(chain_id)
      @chain_template = ChainManager.instance.get_chain_by_chain_type(@chain.chain_type)
    end

    def chain_account_params
      params.require(:chain_account).permit!
    end
  end
end
