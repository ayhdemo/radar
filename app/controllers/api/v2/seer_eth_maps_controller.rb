module Api
  module V2
    class SeerEthMapsController < Api::V2::ATplBase
    	# before_action :check_params, only: [:query,:bind]
      def initialize
        super(:seer,:seer,:eth,:eth)  ##_project,_account_type,_address_type ,_address_chain
      end
    end
  end
end