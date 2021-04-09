module Api
  module V1
    class BindMapsBase < Api::V1::CORSBase
      prepend_before_action :verify_request, only: [:query, :bind, :withdraw, :rebind_account]

      attr_reader   :chain_type
      before_action :find_map, only: [:query]

      ALLOWED_ADDRESS_TYPE  = %w(omni btc eth erc20)
      ALLOWED_ASSETS        = %w(usdt btc eth pfc)

      def initialize(_chain_type)
        super()
        @chain_type   = _chain_type
        cli_server    = Settings[_chain_type]['cli_server'].strip
        encoding_key  = Settings[_chain_type]['enc_base64'].strip
        @enc_api_client = EncApiClient.new(options: {server: cli_server, encoding_key: encoding_key})
      end

      def query
        if @map.nil?
          raise RecordNotExistsError.new
        else
          render_record_json
        end
      end

      def bind
        account_id   = get_param(:account_id)&.strip
        # 解析account id
        case chain_type
        when :bts, :seer
          chain_instance  = ChainManager.instance.get_chain_by_chain_type(chain_type)
          account_info    = chain_instance.search_account(account_id) rescue nil
          raise InvalidParametersError.new("can't find [#{account_id}] in chain") unless account_info

          account_name    = account_info[:account_name]
        else
          account_name = get_param(:account_name)&.strip || account_id
        end

        address_type = params[:address_type]

        check_address_type!(address_type)
        raise InvalidParametersError.new("#{chain_type}_account_id is required") unless account_id && account_name
        if address_type == 'erc20'
          @map = EthMap.bind_eth(chain_type, account_id, account_id)
        else
          @map = BindMap.bind(chain_type, account_id, account_name, address_type)
        end
        render_record_json
      end

      def rebind_account
        account_id        = get_param(:account_id)&.strip
        account_name      = get_param(:account_name)&.strip || account_id
        account_id_old    = get_param(:account_id_old)&.strip
        account_name_old  = get_param(:account_name_old)&.strip   || account_id_old
        address_type      = params[:address_type]

        check_address_type!(address_type)
        raise InvalidParametersError.new unless account_id && account_id_old
        raise InvalidParametersError.new unless account_id.length > 0

        if address_type == 'erc20'
          @map = EthMap.rebind_account(chain_type, account_id_old, account_id, account_name_old, account_name)
        else
          @map = BindMap.rebind_account(chain_type, account_id_old, account_id, account_name_old, account_name, address_type)
        end

        render_record_json
      end

      def get_param(param_name)
        params["#{chain_type}_#{param_name}".to_sym]
      end

      def find_map
        address_type = params[:address_type]
        check_address_type!(address_type)

        if address_type == 'erc20'
          eth_address       = params[:eth_address]
          account_id        = get_param(:account_id)
          return @map       = nil if eth_address.nil? and account_id.nil?

          condition         = "chain_type = '#{chain_type}' "
          eth_address       and (condition += ' and eth_address="%s" '   % eth_address)
          account_id        and (condition += ' and account_id="%s" and account_name="%s"' % [account_id, account_id])

          @map = EthMap.where(condition).limit(1).first
        else
          address      = params[:address]
          account_id   = get_param(:account_id)
          account_name = get_param(:account_name)

          return @map  = nil if address.nil? and account_id.nil?

          condition    = "chain_type = '#{chain_type}' and address_type = '#{address_type}' "
          address      and (condition += ' and address="%s" '      % address)
          account_id   and (condition += ' and account_id="%s" '   % account_id)
          account_name and (condition += ' and account_name="%s" ' % account_name)

          @map = BindMap.where(condition).limit(1).first
        end
      end

      def collect_record_columns
        {
            "address":                        @map.address,
            "#{chain_type}_account_id":       @map.account_id,
            # "#{chain_type}_account_name":     @map.account_name,
            "address_type":                   @map.address_type,
        }
      end

      def collect_record_columns_erc20
        {
            "address":            @map.eth_address,
            "#{chain_type}_account_id":  @map.account_id,
            "address_type": :erc20
        }
      end

      def render_record_json
        if @map[:eth_address]
          data = collect_record_columns_erc20
        else
          data = collect_record_columns
        end
        render :json => {
            "code": 0,
            "msg":  "ok",
            "data": data
        }
      end

      def check_address_type(address_type)
        ALLOWED_ADDRESS_TYPE.include?(address_type)
      end

      def check_address_type!(address_type)
        unless ALLOWED_ADDRESS_TYPE.include?(address_type)
          raise InvalidParametersError.new("address_type is required and should be one of #{ALLOWED_ADDRESS_TYPE.join(',')}")
        end
      end

      def check_asset!(asset_name)
        unless ALLOWED_ASSETS.include?(asset_name)
          raise InvalidParametersError.new("asset_name is required and should be one of #{ALLOWED_ASSETS.join(',')}")
        end
      end

      rescue_from ::APIException do |exception|
        render json: exception.to_err_hash
      end
    end
  end
end
