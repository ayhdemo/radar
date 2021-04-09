class Sig < ApplicationRecord
	has_many :results
  has_many :infos
  has_many :syslogs
  belongs_to :network
  belongs_to :group

	serialize :direcfig

  # after_create_commit { MessageBroadcastJob.perform_later self }
  after_create_commit :go_for_new

  def go_for_new
    if source == "new"
    puts "go for new !!"
      create_neo4j_model
      create_neo4j_link
      graph_reasoning
      fanyan
      pinggu
    end
  end

  def create_neo4j_model
    puts "create_neo4j_model"
    p self
    Syslog.create(sig_id: self.id,log_type: "创建图模型", content:"create_neo4j_model" )
  end

  def create_neo4j_link
    puts "create_neo4j_link"
  end

  def graph_reasoning
    puts "graph_reasoning"
  end

  def fanyan
    puts "fanyan"
  end

  def pinggu
    puts "pinggu"
  end



	def self.create_with_rand_params(attributes = nil, &block)
    p "======================="
    p attributes

    Sig.rand_targetType(attributes)
    Sig.rand_radarSys(attributes)
    Sig.rand_radarUseage(attributes)
    Sig.rand_radarWorkMode(attributes)
    Sig.rand_radarGroup(attributes)
    Sig.rand_networkType(attributes)

    self.create(attributes)

    # super(attributes)
  end

  def self.rand_targetType(attributes)
  	t = %W(单目标 群目标 组网).sample
  	attributes["targetType"] = t
  end
  def self.rand_radarSys(attributes)
  	if attributes["radarSys"] == nil
	  	t = %W(不明 简单脉冲体制 动目标显示 脉冲多普勒 脉冲压缩 频率捷变 频率分集 多波束 频扫 相扫 频相扫  圆锥扫描 单脉冲 相控阵 二次雷达 连续波 合成孔径雷达 复合体制雷达).sample
	  	attributes["radarSys"] = t
	  end
  end
  def self.rand_radarUseage(attributes)
  	if attributes["radarUseage"] == nil
	  	t = %W(不明 预警 对空警戒 对海警戒 低空警戒 测高 目标指示 炮瞄 导弹制导 轰炸瞄准 战场监视 战场侦察  炮位侦察校射 活动目标侦察 航空管制 导航 着陆引导 机载 多功能 地形跟随 敌我识别 港口监视 气象 成像 其它).sample
	  	attributes["radarUseage"] = t
	  end
  end
  def self.rand_radarWorkMode(attributes)
  	if attributes["radarWorkMode"] == nil
	  	t = %W(搜索 引导 跟踪 制导).sample
	  	attributes["radarWorkMode"] = t
	  end
  end
  def self.rand_radarGroup(attributes)
  	if attributes["radarGroup"] == nil && attributes["targetType"] == "群目标"
	  	t = %W(- 国土防空网 野战防空网 反导阵地).sample
	  	attributes["radarGroup"] = t
	  end
  end
  def self.rand_networkType(attributes)
  	if attributes["networkType"] == nil && attributes["targetType"] == "组网"
	  	t = %W(空域 时域 频域 用途).sample
	  	attributes["networkType"] = t
	  end
  end
  def distance_to(sig_id)
    sig = Sig.find(sig_id)
    ((lon-sig.lon) ** 2 + (lat - sig.lat)**2) ** 0.5
  end
end