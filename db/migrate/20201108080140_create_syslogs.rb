class CreateSyslogs < ActiveRecord::Migration[5.2]
  def change
    create_table :syslogs do |t|

    	t.integer :sig_id
    	t.string :log_type
    	t.text	:content

      t.timestamps
    end
  end
end
