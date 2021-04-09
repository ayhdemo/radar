class CreateNetworks < ActiveRecord::Migration[5.2]
  def change
    create_table :networks do |t|
      t.string :name
      t.string :networkType
      t.integer :role_type

      t.timestamps
    end
  end
end
