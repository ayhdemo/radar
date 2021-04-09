class CreateInfos < ActiveRecord::Migration[5.2]
  def change
    create_table :infos do |t|
    	t.integer :sig_id
    	t.string :source  ## 专家系统，纽约时报等等
      t.text :content
      t.datetime :time

      t.timestamps
    end
  end
end
