module Api
  module V1
    class SeerBindMapsController < Api::V1::BindMapsBase
      skip_before_action :verify_request

      def initialize
        super(:seer)
      end

    end
  end
end