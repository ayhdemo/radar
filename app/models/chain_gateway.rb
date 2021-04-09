class ChainGateway < ApplicationRecord
  # validates_uniqueness_of :from_asset_id, :to_asset_id

  # 链C1中资产A1，只能转移到链C2中的一个资产，即不存在： SEER主网的seer资产，同时转移到BTS的gdex.seer和seer两种资产。
  validates_uniqueness_of :to_chain_type, scope: [:from_chain_type, :from_asset_id]

  belongs_to :from_asset,  class_name: ChainAsset.to_s
  belongs_to :to_asset,    class_name: ChainAsset.to_s

  def calc_out_amount(in_amount)
    in_amount     = BigDecimal(in_amount.to_s)
    _fee          = BigDecimal(self.fee.to_s.strip)
    percent_mode  = self.fee_percent_mode || false

    if percent_mode
      out_amount  = in_amount * (100 - _fee) / 100
    else
      out_amount  = in_amount - _fee
    end

    if out_amount > in_amount
      $app_logger.error(self, '转出金额大于转入金额，返回0')
      0
    else
      # 对齐精度, 砍去多余的位数：如精度为3时，金额1.3558会舍入为1.355
      self.to_asset.format_amount(out_amount)
    end
  end
end