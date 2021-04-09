class CreateFanyans < ActiveRecord::Migration[5.2]
  def change
    create_table :fanyans do |t|
      t.string :name

      t.json :result

      t.timestamps
    end
  end
end
