class BindMap < ApplicationRecord

  # belongs_to :chain_accounts

  validates_presence_of :address
  # validates :chain_type, uniqueness: { scope: [:account_id, :address, :address_type] }

  def self.bind(chain_type, account_id, account_name, addr_type)
    found_one = BindMap.where('chain_type=? and account_id=? and account_name=? and address_type= ?', chain_type, account_id, account_name, addr_type)
                    .limit(1).first

    found_one.nil? && BindMap.transaction do
      found_one = BindMap.lock
                      .joins("LEFT JOIN chain_accounts as ca on ca.account_id = bind_maps.address and ca.chain_type='#{addr_type}'")
                      .where('bind_maps.account_name is null and bind_maps.account_id is null')
                      .where('ca.in_enabled = true and ca.out_enabled = false')
                      .where("bind_maps.address_type=?", addr_type)
                      .limit(1).first
      # found_one = BindMap.lock.where("account_name is null and account_id is null and address_type=?", addr_type).limit(1).first
      unless found_one
        $app_logger.error(self, "地址不足, request info: [#{account_name}]")
        raise AddressPoolExhaustedError.new
      end

      found_one.update!(:chain_type => chain_type, :account_id => account_id, :account_name => account_name, :address_type => addr_type)
    end

    found_one
  end

  def self.rebind_account(chain_type, account_id_old, account_id, account_name_old, account_name, address_type)
    found_one = BindMap.where('chain_type=? and account_id=? and account_name=? and address_type=?',
                             chain_type, account_id_old, account_name_old, address_type)
                    .limit(1).first
    unless found_one
      $app_logger.error(self, "#{chain_type}账户不存在, request info: [#{account_id_old}]")
      raise RecordNotExistsError.new
    end

    found_one.update!(:account_id => account_id, :account_name => account_name)

    found_one
  end

  def self.available_cnt
    BindMap.where(account_id: nil).group(:address_type).count
  end
  def self.total_cnt
    BindMap.group(:address_type).count
  end
end
