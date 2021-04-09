module Api
  module V1
    class EoeBtcMapsController < Api::V1::EthMapsBase
      def initialize
        super(:eoe)
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
      # 绑定omni
      def bind
        begin
          eoe_account_id   = get_param('account_id')
          eoe_account_name = get_param('account_name')
          raise InvalidParametersError.new unless eoe_account_id and eoe_account_name

          @map = BindMap.bind(chain_type, eoe_account_id, eoe_account_name, :omni)
          render_record_json
        rescue APIException => e
          render json: e.to_err_hash
        end
      end

      def check_withdraw_address
        address     = params[:address]
        chain_type  = params[:memo_prefix]

        begin
          raise InvalidParametersError.new unless address and chain_type
          raise AddressInvalidError.new unless CommandOmni.instance.is_account? address
          render_api_data_json true
        rescue APIException => e
          render json: e.to_err_hash
        end
      end

      def gateway_config
        from_asset = ChainAsset.where(:chain_type => chain_type, :asset_name => :usdt, :enabled => true).limit(1).first
        gw         = from_asset&.as_from.where(:to_chain_type => :omni, :enabled => true).limit(1).first
        gw_account = from_asset&.chain_accounts.where(:in_enabled => true).limit(1).first
        raise RecordNotExistsError.new unless gw && gw_account

        to_asset_name   = gw.to_asset.asset_alias.empty? ? gw.to_asset.asset_name : gw.to_asset.asset_alias

        render_api_data_json ({
            from_asset:   from_asset.asset_id,
            to_asset:     to_asset_name,
            min:          gw.min_out_amount.to_f,
            max:          0,
            fee:          gw.fee.to_f,
            fee_percent:  gw.fee_percent_mode,
            memo_prefix:  :omni,
            to_account:   gw_account.account_id,
            to_account_name:   gw_account.account_name,
        })
      end

      #override
      def collect_record_columns
        {
            "address":      @map.address,
            "account_id":   @map.account_id,
            "account_name": @map.account_name,
        }
      end

      def find_map
        address       = params[:address]
        account_id    = get_param('account_id')
        account_name  = get_param('account_name')
        address_type  = get_param('address_type')
        return @map   = nil if address_type.nil?
        return @map   = nil if address.nil? and (account_id.nil? or account_name.nil?)

        condition     = "chain_type = '#{chain_type}' "
        address       and (condition += ' and address="%s" '   % eth_address)
        account_id    and (condition += ' and account_id="%s" and account_name="%s"' % [account_id, account_name])
        condition     += ' and address_type="?"' % address_type

        @map = BindMap.where(condition).limit(1).first
      end
    end

    def find_gateway

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