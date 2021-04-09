class CreateRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :records do |t|
      t.string :name				# 
      t.string :ip					# 请求的IP
      t.string :uri					# 请求的相对路径
      t.string :data				# 请求的数据，JSON字符串
      t.string :key_name		# 使用的key名称

      t.string :standby_num	# 备用数字，用来记录各请求核心数字

      t.timestamps
    end
  end
end
