class RadarEvent < ApplicationRecord
	def self.create(attributes = nil, &block)
    p "======================="
    p attributes

    RadarEvent.rand_TargetType(attributes)
    RadarEvent.rand_RadarSys(attributes)
    RadarEvent.rand_RadarUseage(attributes)
    RadarEvent.rand_RadarWorkMode(attributes)
    RadarEvent.rand_RadarGroup(attributes)
    RadarEvent.rand_GroupMethod(attributes)

    super(attributes)
  end

  def self.rand_TargetType(attributes)
  	t = %W(单目标 群目标 组网).sample
  	attributes["TargetType"] = t
  end
  def self.rand_RadarSys(attributes)
  	t = %W(不明 简单脉冲体制 动目标显示 脉冲多普勒 脉冲压缩 频率捷变 频率分集 多波束 频扫 相扫 频相扫  圆锥扫描 单脉冲 相控阵 二次雷达 连续波 合成孔径雷达 复合体制雷达).sample
  	attributes["RadarSys"] = t
  end
  def self.rand_RadarUseage(attributes)
  	t = %W(不明 预警 对空警戒 对海警戒 低空警戒 测高 目标指示 炮瞄 导弹制导 轰炸瞄准 战场监视 战场侦察  炮位侦察校射 活动目标侦察 航空管制 导航 着陆引导 机载 多功能 地形跟随 敌我识别 港口监视 气象 成像 其它).sample
  	attributes["RadarUseage"] = t
  end
  def self.rand_RadarWorkMode(attributes)
  	t = %W(搜索 引导 跟踪 制导).sample
  	attributes["RadarWorkMode"] = t
  end
  def self.rand_RadarGroup(attributes)
  	t = %W(- 国土防空网 野战防空网 反导阵地).sample
  	attributes["RadarGroup"] = t
  end
  def self.rand_GroupMethod(attributes)
  	t = %W(空域 时域 频域 用途 知识图谱).sample
  	attributes["GroupMethod"] = t
  end
end
