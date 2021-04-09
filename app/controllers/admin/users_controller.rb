# coding: utf-8
module Admin
  class UsersController < Admin::BaseController #ok
    respond_to :html, :json, :js

    def index
    end

    def more_user
      search = params[:search]
      offset = get_int_param('offset', 0) # 偏移
      per_page = get_int_param('limit', 10) # 每页个数

      page = (offset / per_page).to_i + 1

      users = User.where('state != false').where(["username like ?", "%%#{search}%%"]).paginate({page: page, per_page: per_page}).order("id DESC")
      data = users.collect {|item| {:id => item.id, :username => item.username, :email => item.email, :genre => item.show_genre}}
      all_count = User.count
      render :json => {count: all_count, data: data}
    end

    def new
      @user = User.new
    end

    def edit
      @user = User.find(params[:id])
    end

    def create
      # params[:user][:face_pic] &&= QiniuImage.get_qiniu_key(params[:user][:face_pic])
      user = User.create(user_params)
      respond_with user, location: admin_users_path
    end

    def update
      # params[:user][:face_pic] &&= QiniuImage.get_qiniu_key(params[:user][:face_pic])
      user = User.find(params[:id]).update(user_params)
      respond_with user, location: admin_users_path
    end

    def password
      @user = User.find(params[:id])
    end

    def change_password
      user = User.find(params[:id])
      user.update(user_params)
      respond_with user, location: admin_users_path
    end

    def destroy
      user = User.find(params[:id])
      user.update(state: false)
      respond_with user, location: admin_users_path
    end

    def destroy_many
      ids = JSON.parse(params[:ids]) rescue nil
      users = User.find(ids)
      users.each {|user|
        user.update(:state => false)
      }
      flash[:notice] = '删除成功'

      respond_with '', location: admin_users_path
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :remember_me, :username, :genre, :user_face_pic, :state)
    end
  end
end