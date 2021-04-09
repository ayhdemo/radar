module Api
  module V1
    class SeerOmniMapsController < BindMapsBase
    	skip_before_action :verify_request
    	before_action :find_map, only: [:query]
    	before_action :check_params, only: [:query,:bind]

    	def initialize
        super(:omni)
      end

      def bind

        account_id   = get_param("account_id")&.strip

        ## 写死 chain_type 为 seer
        chain_type = :seer

        chain_instance  = ChainManager.instance.get_chain_by_chain_type(chain_type)
        account_info    = chain_instance.search_account(account_id) rescue nil
        # raise InvalidParametersError.new("can't find [#{account_id}] in chain") unless account_info

        # account_name    = account_info[:account_name]
        account_name = get_param("account_name")

        ## 写死 address_type 为 omni
        address_type = 'omni' ##params[:address_type]

        check_address_type!(address_type)
        raise InvalidParametersError.new("#{chain_type}_account_id is required") unless account_id && account_name
        # if address_type == 'erc20'
        #   @map = EthMap.bind_eth(chain_type, account_id, account_id)
        # else
          @map = BindMap.bind(chain_type, account_id, account_name, address_type)
        # end
        render_record_json
      end

      # def query
      	
      # end

      def collect_record_columns
        {
            "omni_address":                    @map.address,
            "#{chain_type}_account_id":       @map.account_id,
            "#{chain_type}_account_account":  @map.account_name,
        }
      end

      def get_param(param_name)
        params["seer_#{param_name}".to_sym]
      end

      def render_record_json
        render :json => {
            "code": 0,
            "msg":  "ok",
            "data": collect_record_columns
        }
      end

      def find_map
        omni_address       = params[:omni_address]
        seer_account_id   = get_param("account_id")
        seer_account_name = get_param("account_name")
        return @map       = nil if omni_address.nil? and seer_account_id.nil? and seer_account_name.nil?

        condition         = "chain_type = 'seer' and address_type = 'omni'"
        omni_address      and (condition += ' and address="%s" '   % omni_address)
        seer_account_id   and (condition += ' and account_id="%s" '    % seer_account_id)
        seer_account_name and (condition += ' and account_name="%s" '  % seer_account_name)

        @map = BindMap.where(condition).limit(1).first
      end

    end
  end
end