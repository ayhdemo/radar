module Api
  module V1
    class CORSBase < ActionController::Base
      # before_action :cors_preflight_check,            only: [:query, :bind, :withdraw, :check_withdraw_address, :gateway_config]
      # before_action :cors_set_access_control_headers, only: [:query, :bind, :withdraw, :check_withdraw_address, :gateway_config]

      attr_reader :enc_api_client

      # def cors_set_access_control_headers
      #   headers['Access-Control-Allow-Origin'] = '*'
      #   headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      #   headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
      #   headers['Access-Control-Max-Age'] = "1722000"
      # end

      # def cors_preflight_check
      #   if request.method == 'OPTIONS'
      #     headers['Access-Control-Allow-Origin'] = '*'
      #     headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      #     headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-Prototype-Version, Token'
      #     headers['Access-Control-Max-Age'] = '1722000'

      #     render :plain => '', :content_type => 'text/plain'
      #   end
      # end

      def verify_request
        full_path = request.fullpath
        my_params = request.GET.merge(request.POST).symbolize_keys
        begin
          raise ForbiddenError.new unless enc_api_client.verify_request(full_path, my_params, Settings[:verify_request_ts])
        rescue APIException => e
          render json: e.to_err_hash
        end
      end

      def check_params()
        unless is_legal(params[:omni_address]) && is_legal(params[:account_id]) && is_legal(params[:account_name])
          render :json =>{
            "code": 9002,
            "msg": "invalid params"
          }
        end
      end

      def is_legal(content)
        if content  ## 存在  
          if content =~ /^[\.A-Za-z0-9-]+$/   ## OK
            return true
          else
            return false
          end

        else
          true
        end
      end

    end
  end
end
