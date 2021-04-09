# coding: utf-8
class QiniuImage
  def self.upload_image(local_file_path, prefix_path, extension_name)
    code, result, response_headers = Qiniu::Storage.upload_with_put_policy(
      get_put_policy, # 上传策略
      local_file_path, # 本地文件名
      File.join(prefix_path, get_file_name(extension_name)) # 最终资源名，可省略，缺省为上传策略 scope 字段中指定的Key值
      # x_var           # 用户自定义变量，可省略，需要指定为一个 Hash 对象
    )
    [code, result, response_headers]
  end

  def self.format_img(pic_path , style)
      # style = {width: 100 , height: 100}
      unless pic_path.nil?
        unless style.nil?
          tmp = style.split("x")
          width = tmp[0]
          height = tmp[-1]
          thumbnail = if width >= height
            "/thumbnail/!#{width}x#{height}r"
          else
            "/thumbnail/#{width}x#{height}"
          end
          crop = "/gravity/Center/crop/#{width}x#{height}"
          return [File.join($qiniu_ip , pic_path) , File.join("imageMogr2/auto-orient" , thumbnail , crop , 'ignore-error/1')].join("?")
        else
          return File.join($qiniu_ip , pic_path)
        end
      else
        return ''
      end
  end  

  def self.get_qiniu_key(pending_file, prefix_path = nil)
    # Get resource prefix path from ActionDispatch::Http::UploadedFile 's @headers
    # For example: @headers should be like
    # @headers="Content-Disposition: form-data; name=\"post[article_attributes][article_show_pic]\"; filename=\"6hOVwAV.jpg\"\r\nContent-Type: image/jpeg\r\n"
    # or like
    # @headers="Content-Disposition: form-data; name=\"user[face_pic]\"; filename=\"_20151225_011559.JPG\"\r\nContent-Type: image/jpeg\r\n"
    return nil unless local_file_path = pending_file.try(:path)
    # match the name field which located between the first pair of quotation marks
    if prefix_path.nil?
      resource_params_name = pending_file.headers.scan(/"([^"]*)"/)[0][0]
      prefix = ['', '']
      # extract the last part between square brackets
      resource_params_name.sub!(/\[([^\[|\]]*)\]$/) { |s| prefix[1] = s.match(/\[(.*)\]/)[1].sub(/_pic$/, ''); '' }
      prefix[0] = resource_params_name.include?('[') ? resource_params_name.match(/\[([^\[|\]]*)\]$/)[1].sub(/_attributes$/, '') : resource_params_name
      prefix_path = prefix[0] + '/' + prefix[1]
    end
    # extension_name = pending_file.headers.scan(/"([^"]*)"/)[1][0].scan(/\.[^\.]+$/)[0]
    extension_name = File.extname(pending_file.original_filename)
    code, result, response_headers = upload_image(local_file_path, prefix_path, extension_name)
    code.to_s == '200' ? result['key'] : nil
  end

  def self.format_img(pic_path, style)
    # style = {width: 100 , height: 100}
    if pic_path.nil?
      return ''
    else
      if style.nil?
        return File.join($qiniu_ip, pic_path)
      else
        tmp = style.split('x')
        width = tmp[0].to_i
        height = tmp[-1].to_i
        thumbnail = if width >= height
                      "/thumbnail/!#{width}x#{height}r"
                    else
                      "/thumbnail/#{width}x#{height}"
        end
        crop = "/gravity/Center/crop/#{width}x#{height}"
        return [File.join($qiniu_ip, pic_path), File.join('imageMogr2/auto-orient', thumbnail, crop, 'ignore-error/1')].join('?')
      end
    end
  end

  def self.get_image_information(path)
    hash = nil
    begin
      path = [path, 'imageInfo'].join('?')
      hash = JSON.parse(`curl #{path}`)
    rescue
    end
    hash
  end

  private

  def self.get_put_policy(key = nil)
    put_policy = if key.blank?
                   Qiniu::Auth::PutPolicy.new($bucket)
                 else
                   Qiniu::Auth::PutPolicy.new($bucket, key)
    end
    # bucket,     # 存储空间
    # key,        # 最终资源名，可省略，即缺省为“创建”语义
    # expires_in, # 相对有效期，可省略，缺省为3600秒后 uptoken 过期
    # deadline    # 绝对有效期，可省略，指明 uptoken 过期期限（绝对值），通常用于调试
    put_policy
  end

  def self.get_uptoken(key = nil)
    uptoken = if key.blank?
                Qiniu::Auth.generate_uptoken(get_put_policy)
              else
                Qiniu::Auth.generate_uptoken(get_put_policy(key))
    end
    uptoken
  end

  def self.get_file_name(suffix)
    (Time.now.strftime('%Y%m%d%H%M%S') + (('A'..'Z').collect { |t| t } + ('a'..'z').collect { |t| t } + (0..9).collect { |t| t }).sort_by { rand }.join(''))[0...30] + suffix
  end
end
