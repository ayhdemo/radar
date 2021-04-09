class CreateHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :histories do |t|
      t.string  :from_chain_type,     null: false   # 接收到交易的链
      t.string  :to_chain_type,       null: false   # 转出到的链

      t.string  :from_account_id,     null: false   # 转入监听账户的人（使用网关的人）
      t.string  :from_account_name,   null: false
      t.string  :monitor_account_id,  null: false   # 转入到了网关的哪个账户
      t.string  :monitor_account_name,null: false

      t.string  :op_id,               null: false  # 操作id  1.11.xx

      t.string  :in_asset_id,         null: false
      t.string  :in_asset_name,       null: false
      t.string  :in_asset_alias,      null: false, default: ''
      t.string  :in_amount,           default: ''

      t.string  :in_description,      null: false
      t.string  :in_decrypted_memo,   null: false
      t.integer :in_block_num,        null: false
      t.string  :in_block_time,       null: false
      t.string  :in_trx_in_block,     null: false
      t.string  :in_op_in_trx,        null: false
      t.string  :in_trx_id,           null: false
      t.text    :in_trx_sig,          null: false

      t.string  :out_asset_id
      t.string  :out_asset_name
      t.string  :out_asset_alias
      t.string  :out_amount,          default: ''

      t.integer :out_block            # 转出块
      t.string  :out_block_time       # 转出块时间
      t.string  :out_description      # 转出描述
      t.text    :out_memo             # 转出memo（用作写入区块）
      t.string  :out_time             # 执行转出的时间，会早于out_block_time
      t.string  :out_trx_in_block
      t.string  :out_op_in_trx
      t.string  :out_trx_id           # 转出的trx id
      t.text    :out_trx_sig          # 转出的trx 签名
      t.string  :out_from_account_id  # 从那个账户转出的
      t.string  :out_from_account_name
      t.string  :out_to_account_id    # 转出到那个账户
      t.string  :out_to_account_name
      t.integer :out_nonce
      t.string  :process_status,      null: false, default: 'new'   # 转账状态
      t.string  :comment,             null: false, default: ''      # 手动处理需要备注该字段
      t.timestamps
    end

    add_index :histories, [:from_chain_type, :monitor_account_id, :in_trx_id], unique: true, name: 'history_idx_1'
  end
end
