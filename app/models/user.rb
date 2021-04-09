class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable


  def show_genre
    { 1 => "超级管理员", 2 => "管理员", 3 => "普通用户" }[genre]
  end

  # def face_url(style = nil)
  #   styles = {
  #     small: '180x180'
  #   }
  #   url = QiniuImage.format_img(self.user_face_pic , styles[style])
  #   url.blank? ? missing_face : url
  # end


  # 头像
  # has_attached_file :user_face_pic, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/img/:style/missing.png"
  has_attached_file :user_face_pic, styles: { medium: "300x300>", small: '180*180>', thumb: "100x100>" }, default_url: "/img/missing_face.png"
  validates_attachment_content_type :user_face_pic, content_type: /\Aimage\/.*\z/

end
