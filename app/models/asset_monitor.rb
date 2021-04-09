class AssetMonitor < ApplicationRecord
  belongs_to  :chain_asset
  belongs_to  :chain_account
end