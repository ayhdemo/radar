#**
# 处理加密的接口通信请求
#**
require 'base64'
require 'digest'
require 'openssl'
require 'rest-client'
require 'json'
require 'uri'

class EncApiClient

  attr_accessor :server, :encoding_key, :encoding_key_d64, :resource

  def initialize(options: {})
    @server        = options[:server]        || Settings['pfc']['cli_server']
    @timeout       = options[:timeout]       || 10
    @encoding_key  = (options[:encoding_key] || Settings['pfc']['enc_base64']).strip
    @check_ts      = options[:check_ts]           # 检查时间戳的有效性
    @encoding_key_d64  = Base64::decode64(@encoding_key)

    @resource      ||= RestClient::Resource.new(@server, :timeout => @timeout, :verify_ssl => false)
  end

  def get(uri: nil, params: {})
    set_common_param(params)

    _uri          = URI(uri)
    str_to_sign   = _uri.path
    params        = get_uri_query(_uri.query).merge(params)
    params.sort.map {|key, value| str_to_sign += key.to_s + value.to_s }
    params[:sig]  = get_signature(str_to_sign )

    uri_with_param = [_uri.path, '?', URI.encode_www_form(params)].join('')
    resp = resource[uri_with_param].get :accept => :json

    JSON.parse resp.body, :symbolize_names => true
  end

  def post(uri:nil, params:{})
    set_common_param(params)

    _uri          = URI(uri)
    if uri.start_with?('/pfc')
      str_to_sign   = _uri.path[5..-1]   # pfc 专用
    else
      str_to_sign   = _uri.path
    end

    get_uri_query(_uri.query)
        .merge(params)
        .sort
        .map {|key, value|
          str_to_sign += key.to_s + value.to_s
        }
    params[:sig] = get_signature(str_to_sign )
    resp = resource[uri].post URI.encode_www_form(params)

    JSON.parse resp.body, :symbolize_names => true
  end

  def get_uri_query(query)
    # uri = URI("/posts?id=30&limit=5")
    return {} if query.nil? || query.empty?

    query.split('&').reduce({}) do |obj, part|

      parts                 = part.split('=')
      obj[parts[0].to_sym]  = parts[1]

      obj
    end
  end

  def verify_request(uri, params = {}, check_ts = true)
    ts          = params[:ts].to_i rescue 0
    p "ts: #{ts}, diff: #{Time.now.to_i - ts}"
    return false if check_ts && ((Time.now.to_i - ts).abs > 20) # 有效期20s

    _uri        = URI(uri)
    uri_param   = get_uri_query(_uri.query)
    params      = get_uri_query(params) if params.instance_of? String
    params      = uri_param.merge(params)
    sig         = params.delete(:sig)

    str_to_sign = _uri.path + params.sort.map {|key, value| key.to_s + value.to_s}.join('')

    sig == get_signature(str_to_sign)
  end

  def get_signature(str)
    padding_size    = 32 - str.length % 32
    padding_char    = padding_size.chr
    padded          = str.ljust( str.length + padding_size, padding_char ) # seems to be utf-8 by default

    # p padding_size
    # p padded.unpack('H*')

    cipher      = OpenSSL::Cipher::AES256.new(:CBC)
    cipher.encrypt
    cipher.key  = encoding_key_d64
    cipher.iv   = encoding_key_d64[0...16]

    encrypted   = cipher.update(padded)

    Digest::SHA1.hexdigest encrypted
  end

  private

  def set_common_param(params)
    params[:ts] = Time.now.to_i.to_s
  end

end

# Main
if __FILE__ == $0

  test_config = {
      server:   'https://baidu.com',
      encoding_key: 'J5Ecs7kv9f37WGppWfUcLhuijyUfVdt+SJOgwSmnml4=',
      check_ts: false
  }

  api = EncApiClient.new options: test_config
  res = api.get( uri: '/s?f=xxx&c=123&d=456', params: {:wd => '123' } )
  # p res.body

  p api.verify_request('/s?f=xxx&c=123&d=456&wd=123&ts=1534521749&sig=0e3c4b6787f5672bd90dfa420f19407096bb2dec')

end