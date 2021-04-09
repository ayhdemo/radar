class CreateNetinfos < ActiveRecord::Migration[5.2]
  def change
    create_table :netinfos do |t|
      t.string :name
      t.text   :content
      t.string :radarWorkMode

      t.timestamps
    end

    add_index :netinfos, :name,unique: true
  end
end
