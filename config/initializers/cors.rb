Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do  ## TODO: 根据具体情况进行配置 ，待进行测试
    origins 'localhost:3000','127.0.0.1:3000'
    resource 'api/*',
      headers: :any,
      methods: %i(get post options )
  end
end


# origins 'localhost:3000','127.0.0.1:3000'
#     resource '*',
#       headers: :any,
#       methods: %i(get post put patch delete options head)


# allow do
#     origins 'localhost:3000', '127.0.0.1:3000',
#             /\Ahttp:\/\/192\.168\.0\.\d{1,3}(:\d+)?\z/
#             # regular expressions can be used here

#     resource '/file/list_all/', :headers => 'x-domain-token'
#     resource '/file/at/*',
#         methods: [:get, :post, :delete, :put, :patch, :options, :head],
#         headers: 'x-domain-token',
#         expose: ['Some-Custom-Response-Header'],
#         max_age: 600
#         # headers to expose
#   end

#   allow do
#     origins '*'
#     resource '/public/*', headers: :any, methods: :get

#     # Only allow a request for a specific host
#     resource '/api/v1/*',
#         headers: :any,
#         methods: :get,
#         if: proc { |env| env['HTTP_HOST'] == 'api.example.com' }
#   end