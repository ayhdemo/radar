log_level             = Logger::DEBUG
console_logger        = Logger.new(STDOUT)
console_logger.level  = log_level
file_logger           = Logger.new(Rails.root.join('log/chain.info.log'), shift_age = 'daily')
file_logger.level     = log_level

# $app_logger = MultiLogger.new(console_logger, file_logger)