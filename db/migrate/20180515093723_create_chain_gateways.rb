class CreateChainGateways < ActiveRecord::Migration[5.0]
  def change
    create_table :chain_gateways do |t|
      t.string      :from_chain_type,  null: false
      t.string      :to_chain_type,    null: false
      t.references  :from_asset
      t.references  :to_asset
      t.string      :min_out_amount,   null: false, default: ''   # 最小转出金额,为收到金额减去手续费
      t.string      :fee,              null: false, default: '0'
      t.boolean     :fee_percent_mode, null: false, default: false
      t.boolean     :enabled,          null: false, default: false

      t.string      :out_account_id,    null: false                 # 该网关的转出账户
      t.string      :out_account_name,  null: false

      t.timestamps
    end

    add_index :chain_gateways, [:from_chain_type, :to_chain_type, :from_asset_id, :to_asset_id], unique: true, name: 'gw_idx_1'
  end
end