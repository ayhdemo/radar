# coding: utf-8
module Api
  module V1
    class EthMapsBase < Api::V1::CORSBase
      attr_reader :chain_type
      before_action :find_map, only: [:query]
      before_action :check_params, only: [:query,:bind]

      def initialize(_chain_type)
        super()
        @chain_type = _chain_type
      end

      def query
        if @map.nil?
          render :json => {
              "code": 9001,
              "msg":  "invalid access"
          }
        else
          render_record_json
        end
      end

      def bind
        account_id   = get_param('account_id')
        account_name = get_param('account_name')

        return render :json => {
            "code":   9001,
            "msg":    "invalid access"
        } if account_name.nil? or account_id.nil?

        @map = EthMap
                   .where('chain_type=? and (account_name=? or account_id=?)', chain_type, account_name, account_id)
                   .limit(1)
                   .first
        return render :json => {
            "code":   2002,
            "msg":    "account_name or account_id already exists"
        } unless @map.nil?

        EthMap.transaction do
          @map = EthMap.lock.where('account_name is null and account_id is null').limit(1).first
          unless @map
            render :json => {
                "code":  2003,
                "msg":   "Eth地址不足",
                "data":  nil
            }
            return $app_logger.error(self, "ETH地址不足, request info: [#{account_id}:#{account_name}]")
          end

          @map.update!(:chain_type => chain_type, :account_id => account_id, :account_name => account_name)
        end

        render_record_json
      end

      def get_param(param_name)
        params["#{chain_type}_#{param_name}".to_sym]
      end

      def find_map
        eth_address       = params[:eth_address]
        seer_account_id   = get_param('account_id')
        seer_account_name = get_param('account_name')
        return @map       = nil if eth_address.nil? and seer_account_id.nil? and seer_account_name.nil?

        condition         = "chain_type = '#{chain_type}' "
        eth_address       and (condition += ' and eth_address="%s" '   % eth_address)
        seer_account_id   and (condition += ' and account_id="%s" '    % seer_account_id)
        seer_account_name and (condition += ' and account_name="%s" '  % seer_account_name)

        @map = EthMap.where(condition).limit(1).first
      end

      def collect_record_columns
        {
            "eth_address":                    @map.eth_address,
            "#{chain_type}_account_id":       @map.account_id,
            "#{chain_type}_account_account":  @map.account_name,
        }
      end

      def render_record_json
        render :json => {
            "code": 0,
            "msg":  "ok",
            "data": collect_record_columns
        }
      end
    end
  end
end
