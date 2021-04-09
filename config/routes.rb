Rails.application.routes.draw do



  namespace :admin do
    mount ActionCable.server => '/cable'
    get 'syslogs/show'
  end
  root :to => "admin/sigs#index"
  get "/admin" => "admin/sigs#index"

  get "/info" => "infos#index"
  get "/fanyan" => "infos#fanyan"

  devise_for :users, :controllers => { :sessions => "sessions", :registrations => "registrations", :passwords => "passwords", :confirmations => "confirmations" }
  devise_scope :user do
    get "/users/sign_out", to: "sessions#destroy" # 支持get请求登出
  end

  namespace :admin do
    resources :histories, only: [:index] do
      collection do
        get :more_his
      end
      post :update_comment
    end

    resources :sigs, only: [:index] do
      collection do
        get :more_sigs
      end
      post :update_comment
    end

    resources :networks do
      collection do
      end
    end

    resources :fanyans do
      collection do
        post :upload_csv
      end
    end

    resources :rader_settings do
      collection do
        put :batch_update
      end
    end

    # resources :bind_maps do
    #   collection do
    #     root :to => 'bind_maps#common'

    #     get :more_erc20_bind_maps
    #     get :more_common_bind_maps
    #     get :erc20
    #     get :common
    #   end
    # end

    # resources :posts do
    #   collection do
    #     post 'more_post'
    #   end
    # end

    # resources :chain_gateways do
    #   collection do
    #     get   :more_gateway
    #     post  :enable
    #     post  :disable
    #   end
    #   member do
    #     patch :update
    #   end
    # end

    # resources :chains do
    #   resources :chain_accounts do
    #     collection do
    #       get   :more_chain_account
    #       post  :disable, :enable
    #     end
    #   end

    #   resources :chain_assets do
    #     collection do
    #       get   :more_chain_asset
    #       post  :disable, :enable
    #     end
    #     get   :more_monitor_account
    #     post  :monitor_account # 设置监听账户
    #   end

    #   collection do
    #     get   :more_chain
    #     get   :start_scheduler
    #     get   :stop_scheduler
    #     post  :enable
    #     post  :disable
    #   end
    #   member do
    #     post  :search_asset
    #     post  :search_account
    #   end
    # end

    # resources :gateway_status, only: [:index] do
    #   collection do
    #     get :cli_status
    #     get :gw_account_balance
    #     get :proposed_gas
    #   end

    # end

    resources :settings, only: [:update]

    resources :users do
      collection do
        delete '/' => 'users#destroy_many'
        post :more_user
      end

      member do
        get 'password'
        patch 'change_password'
      end
    end

  end

  # namespace :api do 
  #   namespace :v2 do
  #     ## 网关3 SEER主网 <--> ETH链
  #       match '/query' => 'seer_eth_maps#cors_preflight_check', via: [:options]
  #       match '/bind' => 'seer_eth_maps#cors_preflight_check', via: [:options]
  #       get   :query
  #       post  :bind
  #   end
  # end

  # namespace :api do
  #   namespace :v2 do
  #     resource :seer_eth, controller: :seer_eth_maps, only: [] do
  #       get   :query
  #       post  :bind
  #     end

  #     resource :seer_omni, controller: :seer_omni_maps, only: [] do
  #       get   :query
  #       post  :bind
  #     end
  #   end

    # namespace :v1 do
    #   ##  网关3 SEER主网 <--> ETH链
    #   resource :seer_eth, controller: :seer_eth_maps, only: [] do
    #     match '/query' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     match '/bind' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     get   :query
    #     post  :bind
    #   end
    #   ##  网关3 SEER主网 <--> OMNI链
    #   resource :seer_omni, controller: :seer_omni_maps, only: [] do
    #     match '/query' => 'seer_omni_maps#cors_preflight_check', via: [:options]
    #     match '/bind' => 'seer_omni_maps#cors_preflight_check', via: [:options]
    #     get   :query
    #     post  :bind
    #   end

    #   resource :seer, controller: :seer_bind_maps, only: [] do
    #     match '/query' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     match '/bind' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     get   :query
    #     post  :bind
    #   end
    #   resource :pfc_eth, controller: :pfc_eth_maps,
    #            only: [], constraints: {:remote_ip => Settings.pfc.ip.allow} do
    #     # match '/query' => 'pfc_eth_maps#cors_preflight_check', via: [:options]
    #     # match '/bind' => 'pfc_eth_maps#cors_preflight_check', via: [:options]
    #     get   :query
    #     post  :bind
    #     post  :rebind_account
    #   end
    #   resource :pfc, controller: :pfc_eth_maps,
    #            only: [], constraints: {:remote_ip => Settings.pfc.ip.allow} do
    #     # match '/withdraw' => 'pfc#cors_preflight_check', via: [:options]
    #     post  :withdraw
    #   end
    #   resource :panda, controller: :panda_bind_maps,
    #            only: [], constraints: {:remote_ip => Settings.panda.ip.allow} do
    #     get   :query
    #     post  :bind
    #     post  :rebind_account
    #     post  :withdraw
    #   end
    #   resource :eoe, controller: :eoe_btc_maps, only: [] do
    #     match '/query' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     match '/bind' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     match '/check_withdraw_address' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     match '/gateway_config' => 'seer_eth_maps#cors_preflight_check', via: [:options]
    #     get   :query
    #     post  :gateway_config
    #     post  :bind
    #     post  :check_withdraw_address
    #   end
    # end
  # end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
