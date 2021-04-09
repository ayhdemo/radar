require 'rest-client'
require 'json'

class Alert

  attr_reader :server, :resource, :chat_id

  def initialize
    @server   = Settings['alert']['server']
    @resource = RestClient::Resource.new(server, :timeout => 10, :verify_ssl => false)
  end

  # 普通
  def warning(msg)
    @chat_id = '13852228031767620273'
    _post msg
  end

  # 严重
  def major(msg)
    @chat_id = '16219151110927526579'
    _post msg
  end

  # 灾难
  def critical(msg)
    @chat_id = '10008124274830191282'
    _post msg
  end

  def _post(msg)
    begin
      payload = {chatid: chat_id, msg: msg}
      resource.post payload.to_json, {content_type: :json, accept: :json}
    rescue Exception => e
      $app_logger.error(self, "告警发送失败: #{msg}\n #{e.message}")
    end
  end
end