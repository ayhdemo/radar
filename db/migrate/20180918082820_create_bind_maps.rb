class CreateBindMaps < ActiveRecord::Migration[5.0]
  def change
    create_table :bind_maps do |t|
      
      t.string :project         # 【预先创建】所属项目
 
      t.string :account_type    # 哪个链使用该绑定关系, 如 bts, seer, yyw
      t.string :account_id      # 链上的账户id
      t.string :account_name    # 链上的账户name

      t.string :address_chain   # 【预先创建】地址所属的链名 如 btc ,eth
      t.string :address_type    # 地址类型  如, erc20, eth 等
      t.string :address         # 【预先创建】绑定地址

      t.timestamps

      ## 预先创建3个字段： 哪个项目，哪个链，地址
    end

    # add_index :bind_maps, [:chain_type, :account_id],    unique: true
    # add_index :bind_maps, [:chain_type, :account_name],  unique: true
    add_index :bind_maps, [:address,    :address_type],  unique: true  # 一个以太地址,只能绑定到一个目标链上
  end
end
