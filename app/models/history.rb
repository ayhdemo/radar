class History < ApplicationRecord
  validates_presence_of :from_chain_type

  after_commit :may_trigger_alert, if: :persisted?

  def self.first_if_exists(from_chain_type, in_trx_id)
    History
        .where("from_chain_type=? and in_trx_id=? ", from_chain_type, in_trx_id)
        .limit(1).first
  end

  # pfc 调用withdraw,返回值
  def to_api_result
    {
        to_account: out_to_account_name,
        to_chain: to_chain_type,
        in_asset_name: in_asset_name,
        in_amount: in_amount,
        out_asset_name: out_asset_name,
        out_amount: out_amount,
        seq: in_block_num,
        txid: out_trx_id,
        process_status: process_status,
    }
  end

  def process_status_summary
    [
      "[#{id}] #{err_status_short}",
      "[从#{from_chain_type}转入#{in_asset_name_short} #{in_amount}]",
      "[细节 #{out_info}]"
    ].join("\n")
  end

  def in_asset_name_short
    Utils.first_non_empty_str(in_asset_alias, in_asset_name, in_asset_id)
  end

  def out_asset_name_short
    Utils.first_non_empty_str(out_asset_alias, out_asset_name, out_asset_id)
  end

  def err_status_short
    process_status.split('_err_')[1]
  end

  # 获取该充值操作的 唯一id, 为了向pfc发送唯一的充值请求
  def get_uniq_id
    [
        from_chain_type,
        in_block_num,
        in_trx_in_block,
        in_op_in_trx,
        in_trx_id[-16..-1]
    ].join('_')
  end

  def may_trigger_alert
    return unless comment.to_s.empty? # 存在备注时不再告警
    return unless [
      TrxStatus::AUTO_OUT_ERR_OUT_CHAIN_NOT_RELIABLE,
      TrxStatus::AUTO_OUT_ERR_INSUFFICIENT_BALANCE,
      TrxStatus::AUTO_OUT_ERR_UNKNOWN,

      TrxStatus::IN_ERR_ETH_NOT_BIND,
      TrxStatus::IN_ERR_ERC20_NOT_BIND,
      TrxStatus::IN_ERR_BTC_NOT_BIND,
      TrxStatus::IN_ERR_OMNI_NOT_BIND,
      TrxStatus::IN_ERR_UNKNOWN
    ].include?(process_status)

    $app_alert.major(process_status_summary)
  end
end