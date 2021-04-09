class CreateSigs < ActiveRecord::Migration[5.2]
  def change
    create_table :sigs do |t|
      t.integer 	:sn
      t.datetime 	:searchFirst  #****  
      t.datetime 	:searchLast   #****
      t.float 		:lon					#****欧氏距离
      t.float 		:lat          #****欧氏距离
      t.string 		:ownNation
      t.string 	:addr
      t.string 	:radarName  #雷达型号  ****
      t.string  :platType   #平台类型  车载，固定..

      t.float 	:rfAverage     # ****
      t.float 	:rfMax
      t.float 	:rfMin
      t.string  :rfType

      t.float 	:priAverage    # ****
      t.float 	:priMax
      t.float 	:priMin
      t.string 	:priType

      t.float 	:pwAverage    #****
      t.float 	:pwMax
      t.float  	:pwMin
      t.string 	:pwType

      t.float 	:bw
			t.string :flatType ## 部署模式
      t.string :intrapulseType # 脉内调制

      ### 推理相关
      t.string :targetType ## 目标类型
			t.string :radarSys ## 技术体制   ****
			t.string :radarUseage  ##雷达用途
			t.string :radarWorkMode  ##工作模式
			t.string :radarGroup   #群目标
			t.string :networkType  #组网

			### 威力反演 + 威胁评估
      t.integer :level
      t.integer :coverage
      t.integer :sensitive
      t.string :direcfig  ### 数组的序列化


			t.integer :state  ##  1=>需推理 , 2=>专家系统  3=>威力反演  4=>威力评估  9=> 结束,无需操作
      t.integer :leader, default: 0
			t.integer :network_id
      t.integer :group_id

      t.string :source ,default: "known" ## known ,new

      t.timestamps
    end
  end
end