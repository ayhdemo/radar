class AddIndexToSigs < ActiveRecord::Migration[5.2]
  def change
  	add_index :sigs, :radarName
  end
end
