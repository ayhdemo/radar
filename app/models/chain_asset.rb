class ChainAsset < ApplicationRecord
  validates_presence_of :chain_type, :asset_id, :precision

  belongs_to  :chain
  belongs_to  :chain_gateway

  has_many    :asset_monitors     # 监听该资产的账户
  has_many    :chain_accounts,    :through => :asset_monitors

  has_many    :as_from,  class_name: ChainGateway.to_s, :foreign_key => :from_asset_id   # 作为转出资产的角色
  has_many    :as_to,    class_name: ChainGateway.to_s, :foreign_key => :to_asset_id     # 作为转入资产的角色


  def format_amount(amount)
    out_amount_p   = BigDecimal(amount.to_s).to_s.split('.')
    out_amount_i = out_amount_p[0]
    out_amount_f = ''
    unless out_amount_p[1].nil? or self.precision == 0
      out_amount_f = '.' + out_amount_p[1][0...self.precision.to_i]
    end

    out_amount   = out_amount_i + out_amount_f
    BigDecimal(out_amount)
  end

  def add_monitor_account(account_id)
    self.asset_monitors.create(:chain_account_id => account_id)
  end

  def short_name
    self.asset_alias&.length > 0 ? self.asset_alias : self.asset_name
  end
end