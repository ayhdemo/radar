require 'csv'

def re_create_with_hash(i)

  rand_t = rand(1000000)

   Sig.create(
        sn: i["SN"],
        searchFirst: Time.at(i["RT"].to_i + rand_t),
        searchLast: Time.at(i["RT"].to_i + i["RTD"].to_i + rand_t),
        lon: i["Lon"].to_f * rand(0.99..1.01),
        lat: i["Lat"].to_f * rand(0.99..1.01),
        ownNation: i["GM"],
        addr: i["DM"],
        radarName: i["XH"],
        platType: i["MBM"],
        rfAverage: i["RF"],
        # RFs: i["RFs"],
        priAverage: i["PRI"],
        # PRIs: i["PRIs"],
        pwAverage: i["PW"],
        # PWs: i["PWs"],
        bw: i["BW"],
        # flatType: i["FlatType"],
        # radarUseage: i["usage"],
        state: 1
        ) 
end

def read_csv

  i = 1
  num = rand(100)

  CSV.foreach("test_new_data.csv", headers: true ) do |row|

    if i < num

    else
      item = row.to_hash
      p item

      # item = item.transform_keys(&:to_sym)

      # fix = item.each{|k,v| item[k] = v}

      sig = re_create_with_hash item
      sig.infos.create(
        source: "维基百科",
        time: Time.now - rand(100000..10000000),
        content: "AN / MPN-14K移动地面进近系统可以配置为完整的雷达进近控制（RAPCON）或地面控制进近（GCA）设施。 空中交通管制员使用雷达单元识别，排序和分离参与战斗的飞机，通过防空走廊和区域提供最终进近指导，并与指定机场和空军基地的当地防空单元协调ID和意图。这些服务可以在所有类型的天气中提供。 雷达单元能够使用半径不超过200海里（370 km）的辅助雷达和不超过60海里（110 km）的主要雷达识别飞机。 PAR提供从15海里到着陆的方位角和高程信息。 PAR和ASR都可以用作最终进近辅助。该单元在操作室中有3个ASR显示指示器和1个PAR指示器，在维护室中有1个ASR和PAR指示器。在操作拖车中完成。该系统仅限于一条跑道，但具有借助可移动转盘提供相反方向的跑道操作的能力。"
        )

      return 
    end
    i += 1
  end
end

read_csv
sleep 3



