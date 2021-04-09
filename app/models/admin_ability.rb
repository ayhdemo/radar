class AdminAbility
  include CanCan::Ability

  def initialize(user)
    if user.nil? # not logged in
      cannot :manage, :all
    elsif user.genre == 1 or user.genre == 2# 超级管理员 / 管理员
      can :manage, :all
    elsif user.genre == 3                   # 普通用户
      cannot :manage, :all
      can [:index, :more_his, :update_comment], History
      can [:index, :cli_status, :proposed_gas, :gw_account_balance], GatewayStatus
      can [:index, :more_erc20_bind_maps, :more_common_bind_maps], BindMap
    else# banned or unknown situation
      cannot :manage, :all
    end
  end
end
