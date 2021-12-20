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

    resources :detections, only: [:index] do
      collection do
        get :more_detections
        get :more_detections_another
      end
      post :update_comment
    end

    get "/charts" => "charts#index"

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

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
