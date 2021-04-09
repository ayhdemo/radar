class AddStationIdToFanyans < ActiveRecord::Migration[5.2]
  def change
    add_column :fanyans, :station_id, :integer
  end
end
