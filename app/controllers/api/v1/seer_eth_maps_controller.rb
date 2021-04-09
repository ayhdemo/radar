module Api
  module V1
    class SeerEthMapsController < Api::V1::EthMapsBase
    	before_action :check_params, only: [:query,:bind]
    	
      def initialize
        super(:seer)
      end
    end
  end
end