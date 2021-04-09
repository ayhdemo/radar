module Admin
  class SettingsController < Admin::BaseController
    before_action :find_gas_price_setting, only: [:update]

    def update
      price = setting_params[:value].to_i

      if price / (10 ** 9) < 1
        price *= 10 ** 9  # deal with GWei
      end

      price = [price, 100 * 10 ** 9].min # max: 100 GWei

      @setting.update(value: price)
      render json: {code: 0, msg: 'success'}
    end

    private

    def find_gas_price_setting
      id      = params[:id]
      setting = Setting.find(id)
      return render json: {code: 404, msg: 'record not found'} if setting.nil?

      return   nil if setting.key != 'gas_price'
      @setting = setting
    end

    def setting_params
      params.require(:setting).permit!
    end
  end
end