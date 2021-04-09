# coding: utf-8
class ApplicationController < ActionController::Base
  layout 'admin'
  #protect_from_forgery with: :exception
  #protect_from_forgery prepend: true

  # 获取int类型请求数据
  def get_int_param(key, default)
    v = params[key.to_sym]
    v.to_s.length > 0 ? v.to_i : default
  end
end
