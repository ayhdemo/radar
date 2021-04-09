class CreateResults < ActiveRecord::Migration[5.2]
  def change
    create_table :results do |t|

      t.integer :sig_id ## 本次信号ID
      t.integer :pre_sig_id ## 旧的信号ID
      t.float :score ## 相似度综合得分

      t.float :s1    #第1项得分
      t.float :s2		 #第2项得分
      t.float :s3		 #第3项得分
      t.float :s4			#第4项得分
      t.float :s5			#第5项得分
      t.float :s6			#第6项得分

      t.timestamps
    end
  end
end
