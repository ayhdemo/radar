# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
user = User.new
user.username = '管理员'
user.genre = 1
user.email = 'sa@qq.com'
user.password = '11111111'
user.password_confirmation = '11111111'
user.save!

user = User.new
user.username = 'user'
user.genre = 3
user.email = 'user@qq.com'
user.password = '11111111'
user.password_confirmation = '11111111'
user.save!

## 当为true时候，执行反演，将结果存如 pys/fanyan.json 中
Setting.create!(key:"cal_fanyan",value: "true")  ##换csv（全局）
Setting.create!(key:"cal_pinggu",value: "true")  ##13*13矩阵，169长度的数组

Setting.create!(key:"pinggu_pramas",value:"[[1, 4, 2, 3, 3, 2,2,3,4,6,7,8,2], [1/4, 1, 1 / 3, 1/2, 1/2, 2,2,1,4,6,4,8,3], [1/2, 3, 1, 2, 2, 2,2,3,4,6,7,8,2], [1/3, 2, 1/2, 1, 1, 2,2,1,4,6,4,8,3], [1/3, 2, 1/2, 1, 1, 2,2,3,4,6,7,8,2], [1/3, 2, 1/2, 1, 1, 2,2,1,4,6,4,8,3], [1/3, 2, 1/2, 1, 1, 2,2,3,4,6,7,8,2] , [1/4, 1, 1 / 3, 1/2, 1/2, 2,2,1,4,6,4,8,3], [1/2, 3, 1, 2, 2, 2,2,3,4,6,7,8,2], [1/3, 2, 1/2, 1, 1, 2,2,1,4,6,4,8,3], [1/3, 2, 1/2, 1, 1, 2,2,3,4,6,7,8,2], [1/3, 2, 1/2, 1, 1, 2,2,1,4,6,4,8,3], [1/3, 2, 1/2, 1, 1, 2,2,3,4,6,7,8,2]]")

Setting.create!(key:"s1" ,value: 1)
Setting.create!(key:"s2" ,value: 1)
Setting.create!(key:"s3" ,value: 1)
Setting.create!(key:"s4" ,value: 1)
Setting.create!(key:"s5" ,value: 1)
Setting.create!(key:"s6" ,value: 1)
Setting.create!(key:"s7" ,value: 1)
Setting.create!(key:"s8" ,value: 1)
Setting.create!(key:"s9" ,value: 1)



Syslog.create(sig_id: 1, log_type: "威力反演", content: "威力反演中..")

# # gas limit 上限
# setting = Setting.new
# setting.key   = 'gas_limit'
# setting.value = 210_000.to_s
# setting.save!

# # gas 单价上限
# setting = Setting.new
# setting.key   = 'gas_price'
# setting.value = 40_000_000_000.to_s # 40 GWei
# setting.save!

# # 调度器状态
# setting = Setting.new
# setting.key   = 'chain_scheduler_enabled'
# setting.value = 'false'
# setting.save!

# ## 创建Chain

# Chain.create!({chain_name: :bts,	chain_type: :bts, 	enabled: false})
# Chain.create!({chain_name: :eoe,	chain_type: :eoe, 	enabled: false})
# Chain.create!({chain_name: :seer,	chain_type: :seer, 	enabled: false})
# Chain.create!({chain_name: :eth,	chain_type: :eth, 	enabled: false})
# Chain.create!({chain_name: :eth,	chain_type: :erc20, enabled: false})
# Chain.create!({chain_name: :qwb,	chain_type: :qwb, 	enabled: false})
# Chain.create!({chain_name: :panda,chain_type: :panda, enabled: false})
# Chain.create!({chain_name: :btc,	chain_type: :omni, 		enabled: false})
# Chain.create!({chain_name: :btc,	chain_type: :btc, enabled: false})

# ## 创建模拟账号
# 10.times do |i|
# 	ChainAccount.create chain_name: :eth, chain_type: :erc20,  account_id: "a#{i}"
# end