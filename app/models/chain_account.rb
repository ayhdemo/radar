class ChainAccount < ApplicationRecord
  validates_presence_of :chain_name, :account_id

  belongs_to :chain
  has_many :asset_monitors
  has_many :chain_assets,   :through => :asset_monitors

  has_many 		:slaves, class_name: 'ChainAccount', foreign_key: 'master_id'
	belongs_to 	:master, class_name: 'ChainAccount', optional: true  # 不需要验证关联的对象是否存在,顶级分类不需要上一级
	# 注： 此处self join 采用1对多关系。 因为某账号可能对应多个slave账号： 如 seer 链上账号，可以对应 USDT + ETH 的充值地址
end