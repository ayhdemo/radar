require_relative 'boot'

require 'rails/all'

# require 'active_graph/railtie'

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require(*Rails.groups(:assets => %w(development test production)))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

module RadarNew
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.active_record.default_timezone = :local
    config.time_zone = 'Beijing'
    # config.autoload_once_paths += ["#{config.root}/app/chain"]
  end
end
