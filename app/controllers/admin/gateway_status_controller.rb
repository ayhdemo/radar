class Admin::GatewayStatusController < Admin::BaseController
  def index
    @gas_setting  = Setting.find_by_key('gas_price')
    now           = 10.minutes.ago.utc.strftime('%Y-%m-%dT%H:%M:%S')
    all_records   = History.where('process_status<>? and in_block_time<?', TrxStatus::AUTO_OUT_CONFIRMED, now)
    not_handled   = all_records.where('comment = ""')
    @all_count    = all_records.count
    @not_hand_cnt = not_handled.count
  end
  
  # cli状态
  def cli_status
    status_list = [
        CommandBts,
        CommandSeer,
        CommandErc20,
        CommandEth,
        CommandPfc,
        CommandPanda,
        CommandOmni,
        CommandBtc
    ].each_with_index.map {|cmd_cls, idx|
      cmd = cmd_cls.instance
      
      {
          id: idx + 1,
          chain_type: cmd.chain_type,
          status:     cmd.test,
      }
    }
    
    render json: status_list
  end
  
  def gw_account_balance
    chain_inst_list       = {}
    account_balance_list  = ChainAsset.all.each_with_index.map { |asset|
      chain_type          = asset.chain_type
      out_from_account_id = asset.out_account_id

      chain_inst          = chain_inst_list[chain_type]
      if chain_inst.nil?
        chain_inst        = chain_inst_list[chain_type] = ChainManager.instance.get_chain_by_chain_type(chain_type)
      end

      asset_balance = chain_inst.get_account_balance(out_from_account_id, asset.asset_id) rescue -1
      balance_obj   = {
          id:       asset.id,
          asset:    asset,
          balance:  asset_balance,
      }
      if 'erc20' == chain_type
        eth_balance = CommandEth.instance.get_available_balance(out_from_account_id) rescue -1
        balance_obj[:eth_balance] = eth_balance
      end

      if 'omni' == chain_type
        btc_balance = CommandBtc.instance.get_available_balance(out_from_account_id) rescue -1
        balance_obj[:btc_balance] = btc_balance
      end

      balance_obj
    }

    render json: account_balance_list
  end

  def proposed_gas
    proposed_gas = CommandErc20.instance.get_gas_price_from_net(1, true) rescue -1
    if -1 === proposed_gas
      return render json: {
          code: -1,
          msg: '获取gas失败',
          data: nil
      }
    end

    render json: {
        code: 0,
        msg: 'ok',
        data: proposed_gas
    }
  end
end