class CreateEthMaps < ActiveRecord::Migration[5.0]
  def change
    create_table :eth_maps do |t|
      t.string :chain_type          # eth地址属于哪个链 bts/seer/yoyow..
      t.string :account_id
      t.string :account_name
      t.string :eth_address

      t.timestamps
    end

    add_index :eth_maps, [:chain_type, :account_id],    unique: true
    add_index :eth_maps, [:chain_type, :account_name],  unique: true
    add_index :eth_maps, :eth_address,                  unique: true  # 一个以太地址,只能绑定到一个目标链上
  end
end
