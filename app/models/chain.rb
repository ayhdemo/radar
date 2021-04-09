class Chain < ApplicationRecord
  has_many :chain_assets
  has_many :chain_accounts#, -> { where chain_type: self.chain_type }

  def logger  ## 每个chain有自己独立的logger 
  	@chain_logger ||= new_logger
  end

  private
  def new_logger
  	logger = Logger.new(Rails.root.join("log/#{chain_type}.log"), shift_age = 'daily')
		logger.level = Logger::DEBUG

		logger
  end
end
