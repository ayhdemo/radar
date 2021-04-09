# coding: utf-8
module Admin
  class BaseController < ApplicationController
    layout 'admin'
    before_action :authenticate_user! # 需要登录
    # authorize_resource # 验证权限（在cancancan: model/ability.rb中定义）

    rescue_from CanCan::AccessDenied do |exception|
      respond_to do |format|
        format.json {head :forbidden, content_type: 'text/html'}
        # format.html { redirect_to main_app.root_url, notice: exception.message }
        # format.html { redirect_to new_user_session_path, notice: exception.message }
        format.html {redirect_to '/403.html', notice: exception.message}
        format.js {head :forbidden, content_type: 'text/html'}
      end
    end

    def search_post_by_status
      length = params[:columns].length
      i = 0
      while !params[:columns][:"#{i}"][:data].eql?("status") && i < length do
        i += 1
      end
      params[:columns][:"#{i}"][:search][:value].to_i
    end

    def search_user_by_genre
      genre = params[:columns][:'3'][:search][:value].eql?('3') ? 3 : 0
      return genre
    end

    # 获取int类型请求数据
    def get_int_param(key, default)
      v = params[key.to_sym]
      v.to_s.length > 0 ? v.to_i : default
    end

    def render_not_found(msg)

    end

    # todo 设计错误处理 ref: http://www.thegreatcodeadventure.com/rails-api-painless-error-handling-and-rendering-2/
    # def on_internal_error(e)
    #   chain_logger.error(self, e.to_s)
    #   chain_logger.error(self, e.backtrace)
    # end
    #
    # rescue_from ActiveRecord::RecordNotUnique do |e|
    #   on_internal_error(e)
    # end

    private

    def current_ability
      @current_ability ||= AdminAbility.new(current_user)
    end
  end
end