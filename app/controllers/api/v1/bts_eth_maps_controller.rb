module Api
  module V1
    class BtsEthMapsController < Api::V1::EthMapsBase
      def initialize
        super(:bts)
      end
    end
  end
end