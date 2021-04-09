# coding: utf-8
class DeviseCreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users, comment: '用户' do |t|
      ## Adding 基本信息
      t.string    :username, limit: 180, :default => "",  :null => false, comment: '用户名'
      t.string    :user_face_pic, limit: 180, comment: '头像'

      t.string    :user_face_pic_file_name    #头像文件名
      t.string    :user_face_pic_content_type
      t.integer   :user_face_pic_file_size
      t.datetime  :user_face_pic_updated_at

      t.integer   :genre, :default => 3, :null => false, comment: '用户类型'
      t.boolean   :status , :default => true, comment: '用户激活状态'
      t.boolean   :state , :default => true, comment: '信息状态'

      ## Database authenticatable
      t.string :email,              :limit => 180,              null: false, default: ""
      t.string :encrypted_password, :limit => 180, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token, limit: 180
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip, limit: 180
      t.string   :last_sign_in_ip, limit: 180

      ## Confirmable
      # t.string   :confirmation_token
      # t.datetime :confirmed_at
      # t.datetime :confirmation_sent_at
      # t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      # t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      # t.string   :unlock_token # Only if unlock strategy is :email or :both
      # t.datetime :locked_at


      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    # add_index :users, :confirmation_token,   unique: true
    # add_index :users, :unlock_token,         unique: true
  end
end
