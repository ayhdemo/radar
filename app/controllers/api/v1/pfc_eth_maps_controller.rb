module Api
  module V1
    class PfcEthMapsController < Api::V1::EthMapsBase
      prepend_before_action :verify_request, only: [:query, :bind, :withdraw, :rebind_account]

      def initialize
        @enc_api_client = EncApiClient.new
        super(:pfc)
      end

      #override
      # pfc eth绑定查询
      def query
        begin
          if @map.nil?
            raise RecordNotExistsError.new
          else
            render_record_json
          end
        rescue APIException => e
          render json: e.to_err_hash
        end
      end

      #override
      # pfc 绑定eth
      def bind
        begin
          pfc_account   = get_param('account')
          raise InvalidParametersError.new unless pfc_account

          @map = EthMap.bind_eth(chain_type, pfc_account, pfc_account)
          render_record_json
        rescue APIException => e
          render json: e.to_err_hash
        end
      end

      def rebind_account
        begin
          pfc_account     = get_param('account')
          pfc_account_old = get_param('account_old')
          pfc_account&.strip!
          raise InvalidParametersError.new unless pfc_account && pfc_account_old
          raise InvalidParametersError.new unless pfc_account.length > 0

          @map = EthMap.rebind_account(chain_type, pfc_account_old, pfc_account, pfc_account_old, pfc_account)
          render_record_json
        rescue APIException => e
          render json: e.to_err_hash
        end
      end

      # pfc 提现 到eth等
      def withdraw
        begin
          $app_logger.info(self, '>>>>>收到PFC提现请求<<<<<')
          field_missing = []
          %w(pfc_account asset_name amount memo seq).each do |field|
            field_missing << field if params[field].nil? or params[field].to_s.empty?
          end

          raise InvalidParametersError.new("missing #{field_missing.join(', ')}") unless field_missing.empty?
          raise InvalidParametersError.new("asset_name must be pfc") unless params['asset_name'].downcase == 'pfc'
          my_params = request.GET.merge(request.POST).symbolize_keys

          found_one = History.first_if_exists(chain_type, my_params[:seq]) || ChainQwb.instance.on_deposit(my_params)
          succeed   = [TrxStatus::AUTO_OUT_PROCESSED, TrxStatus::AUTO_OUT_CONFIRMED].include?(found_one.process_status)

          raise PfcWithdrawError.new("withdraw failed, reason: #{found_one.process_status}") unless succeed

          render json: {
              code: 0,
              msg: 'ok',
              data: found_one.to_api_result
          }
        rescue APIException => e
          render json: e.to_err_hash
        end

        # pfc_account         (pfc账号)
        # asset_name          (资产名称)
        # amount              (数量, String类型)
        # memo                (备注, 备注格式见后)
        # ts                  (时间戳)
        # seq                 (全局唯一自增编号, 含义见后述)
        # sig                 (签名, 详见API签名章节)
        #
        # 备注:   eth_address, pfc_account 至少存在一个，且关系为AND
      end

      #override
      def collect_record_columns
        {
            "eth_address":            @map.eth_address,
            "#{chain_type}_account":  @map.account_id,
        }
      end

      def find_map
        eth_address       = params[:eth_address]
        pfc_account       = get_param('account')
        return @map       = nil if eth_address.nil? and pfc_account.nil?

        condition         = "chain_type = '#{chain_type}' "
        eth_address       and (condition += ' and eth_address="%s" '   % eth_address)
        pfc_account       and (condition += ' and account_id="%s" and account_name="%s"' % [pfc_account, pfc_account])

        @map = EthMap.where(condition).limit(1).first
      end
    end

  end
end

# 1001:	参数错误
# 
# 2001:	不存在相关记录
# 2002:   该账户已绑定Eth地址
# 2003:	Eth地址已用完
# 
# 9001:	非法访问
# 9101:   服务器错误