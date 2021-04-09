module Admin
    class RaderSettingsController < Admin::BaseController
        def index
            @rader_settings = Setting.where('`key` in (?)', ['pinggu_pramas','s1','s2','s3','s4','s5','s6','s7','s8','s9'])
            p @rader_settings

            @settingmap = {
                "s1" => "经纬度系数",
                "s2" => "雷达型号系数",
                "s3" => "特征向量",
                "s4" => "雷达用途",
                "s5" => "开机时间",
                "s6" => "雷达系统",
                "s7" => "RF系数",
                "s8" => "PRI系数",
                "s9" => "PW系数"
            }
        end

        def batch_update
            change_set = params['change_set']
            change_set.each do |idx, change| 
                key = change[0]
                val = change[1]

                Setting.where('`key`=?', key).update('value': val)
            end
        end
    end
end



# 9个参数：1，经纬度2，雷达型号3，特征向量4，雷达用途5，开机时间6，雷达系统7，rf8，pri9，pw