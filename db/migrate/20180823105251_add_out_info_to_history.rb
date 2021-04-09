class AddOutInfoToHistory < ActiveRecord::Migration[5.0]
  def change
    add_column :histories, :out_info, :string  # PFC转出发生错误时, 记录详情返回信息
  end
end
