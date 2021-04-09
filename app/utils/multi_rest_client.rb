# ETH节点请求
# 支持配置多个服务器(仅支持eth, infura节点)
require 'rest-client'
require 'json'

class MultiRestClient
  attr_reader :options, :server_list

  def initialize(servers, options={})
    if servers&.instance_of? Array
    elsif servers&.instance_of? String
      servers = [servers]
    else
      raise '参数错误: 服务器列表为空'
    end

    @default_options = {mode: :round, timeout: 55, retry_rounds: 2}
    @options = @default_options.merge(options)

    @round   = 0 # 本次请求轮数
    @server_list = []
    @server_idx  = 0
    servers.each do |server|
      @server_list << RestClient::Resource.new(server, :timeout => options[:timeout])
    end
	end

  def post(url, payload)
    err = nil
    res = nil
    begin
      res = _current.post(url, payload)
      err  = nil
    rescue Exception => e
      err = e

      if @round < @options[:retry_rounds]
        $app_logger.error(self, "#{_current.url} 发生错误, 尝试下一个节点, 当前轮次#{@round + 1}/#{options[:retry_rounds]}")
        _next
        retry
      else
        $app_logger.error(self, "超出重试轮次, 最近一次请求错误信息:")
      end
    ensure
      _reset_index
      _reset_round
    end

    # 失败
    raise err if err

    res
  end

  private

	def _reset_index
		@server_idx = 0
	end

	def _reset_round
		@round = 0
	end

	def _next
    @server_idx += 1
    if @server_idx == server_list.length
      @server_idx %= server_list.length
      @round += 1
      $app_logger.error(self, "0.5s 后开始新一轮重试...")
      sleep 0.5
    end
    server_list[@server_idx]
  end

  def _current
    server_list[@server_idx]
  end
end