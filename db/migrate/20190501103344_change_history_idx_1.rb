class ChangeHistoryIdx1 < ActiveRecord::Migration[5.0]
  def change
    remove_index :histories, name: 'history_idx_1'

    add_index :histories, [:from_chain_type, :in_trx_id, :in_op_in_trx], unique: true, name: 'history_idx_1_updated'
  end
end
