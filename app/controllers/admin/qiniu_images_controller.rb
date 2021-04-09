module Admin
  class QiniuImagesController < Admin::BaseController
    def upload_img
      hash = {}
      Timeout.timeout(10, Errno::ETIMEDOUT) do
        qiniu_key = QiniuImage.get_qiniu_key(params[:imgFile], 'uploads')
        image_url = QiniuImage.format_img(qiniu_key, nil)
        image_infomation = QiniuImage.get_image_information(image_url)
        if image_infomation["format"].eql?("gif") || image_infomation["format"].eql?("GIF")
          image_url = [image_url, 'w600Gif'].join("-")
        else
          image_url = [image_url, 'w600'].join("-")
        end
        hash = {url: image_url, width: image_infomation["width"], height: image_infomation["height"], format: image_infomation["format"]}
      end
      render json: hash
    end
  end
end