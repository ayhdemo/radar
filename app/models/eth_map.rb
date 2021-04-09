class EthMap < ApplicationRecord
  validates_presence_of :eth_address
  def self.bind_eth(chain_type, account_id, account_name)
    found_one = EthMap.where('chain_type=? and account_id=? and account_name=?', chain_type, account_id, account_name)
                    .limit(1).first

    found_one.nil? && EthMap.transaction do
      found_one = EthMap.lock.where("account_name is null and account_id is null").limit(1).first
      unless found_one
        $app_logger.error(self, "ETH地址不足, request info: [#{account_name}]")
        raise EthAddressExhaustedError.new
      end

      found_one.update!(:chain_type => chain_type, :account_id => account_id, :account_name => account_name)
    end

    found_one
  end

  def self.rebind_account(chain_type, account_id_old, account_id, account_name_old, account_name)
    found_one = EthMap.where('chain_type=? and account_id=? and account_name=?', chain_type, account_id_old, account_name_old)
                    .limit(1).first
    unless found_one
      $app_logger.error(self, "pfc账户不存在, request info: [#{account_id_old}]")
      raise RecordNotExistsError.new
    end

    found_one.update!(:account_id => account_id, :account_name => account_name)
    
    found_one
  end

  def self.available_cnt
    EthMap.where('account_id is null').count
  end
end
