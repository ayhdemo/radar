class CreateChains < ActiveRecord::Migration[5.0]
  def change
    create_table :chains do |t|
      t.string   :chain_name,  null: false                 # 如 可以重复：如 eth 与 erc20 的chain_name 均为 ETH
      t.string  :chain_type,  null: false                 # chain type (bts, yoyow, seer), 和memo中的平台一致
      t.string  :chain_uuid,  null: false, default: ''    # chain id
      t.integer :interval,    null: false, default: 10    # 网关执行间隔
      t.boolean :enabled,     null: false, default: false # 是否启用该链，否的时候，所有转入转出操作均不处理

      t.timestamps
    end

    add_index :chains,  :chain_type,  unique: true

    create_table :chain_assets do |t|
      t.belongs_to :chain
      t.string  :chain_type,        null: false   # chain type
      t.string  :asset_id,          null: false   # asset_id
      t.string  :asset_name,        null: false   # asset_name
      t.string  :asset_alias,       null: false, default: ''    # 资产别名
      t.integer :precision,         null: false                 # 该资产精度
      # t.string  :out_account_id,    null: false                 # 该资产转出账户
      # t.string  :out_account_name,  null: false
      t.integer :asset_next_seq_no, null: false, default: 0
      t.boolean :enabled,           null: false, default: false # 是否启用该资产，不启用时，转出受限

      t.timestamps
    end

    create_table :chain_accounts do |t|
      # t.belongs_to :chain
      t.string  :chain_name,        null: false   # 链名
      t.string  :chain_type,        null: false,  default: ''   # chain_type : 用于解决遗留问题 + 个性化（需求如果就要区分开充值地址）
      t.string  :project,           null: false,  default: 'free'  # 属于哪个项目（绑定前，为free状态，绑定后要指定状态）
      t.string  :account_id,        null: false   # 账户id
      t.string  :account_name                     # 账户名
      t.integer :next_seq_no,       null: false,  default: 0      # 该账户下一次处理的数据,在石墨烯系中代表区块高度，在eth中表示nonce

      t.boolean :in_enabled,        null: false,  default: false  # 记录账户的转入操作（监听该账户的转入和转出操作）
      t.boolean :out_enabled,       null: false,  default: false  # 账户为负责转出的账户
      t.boolean :is_ours,           default: true  ## 是否为我们的账户  备用

      t.timestamps
    end
    add_reference :chain_accounts, :master, index: true ## SELF JOIN

    create_table :asset_monitors do |t|
      t.belongs_to :chain_asset,    index: true
      t.belongs_to :chain_account,  index: true
    end

    add_index :chain_assets,    [:chain_type, :asset_id],       unique: true
    add_index :chain_accounts,  :account_id,                    unique: true
    add_index :asset_monitors,  [:chain_asset_id, :chain_account_id], unique: true
  end
end
