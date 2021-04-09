module Api
  module V1
    class PandaBindMapsController < Api::V1::BindMapsBase
      skip_before_action :verify_request
      before_action :find_map, only: [:withdraw]

      def initialize
        super(:panda)
      end

      # panda 提现 到eth, btc等
      def withdraw
        $app_logger.info(self, '>>>>>收到Panda提现请求<<<<<')
        field_missing = []
        %W(#{chain_type}_account_id address_type asset_name amount memo seq).each do |field|
          field_missing << field if params[field].nil? or params[field].to_s.empty?
        end

        raise InvalidParametersError.new("missing #{field_missing.join(', ')}") unless field_missing.empty?
#        raise InvalidParametersError.new("amount should < 0.002 in testnet") unless params[:amount].to_f < 0.002

        check_address_type!(params[:address_type].downcase)
        check_asset!(params[:asset_name].downcase)

        raise AccountIdNotBindError.new(params[:panda_account_id]) unless @map

        my_params = request.GET.merge(request.POST).symbolize_keys
        found_one = History.first_if_exists(chain_type, my_params[:seq]) || ChainPanda.instance.on_deposit(my_params)

        succeed   = [TrxStatus::AUTO_OUT_PROCESSED, TrxStatus::AUTO_OUT_CONFIRMED].include?(found_one.process_status)

        raise PandaWithdrawError.new("withdraw failed, reason: #{found_one.process_status}") unless succeed

        render json: {
            code: 0,
            msg: 'ok',
            data: found_one.to_api_result
        }
      end


    end
  end
end
