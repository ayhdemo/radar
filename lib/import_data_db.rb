require 'csv'
def copy_hash(origin)
    # origin.each{ |k,v|
    #     origin[k.to_sym] = v
    # }
    Hash[origin.map{|k,v| [k,v] } ]
end

# CSV.foreach("mock_data.csv", headers: true ).first

def re_create_with_hash(i)
   RadarEvent.create(
        sn: i["SN"],
        searchFirst: i["RT"].to_i,
        searchLast: i["RT"].to_i + i["RTD"].to_i,
        lon: i["Lon"].to_f,
        lat: i["Lat"].to_f,
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
        flatType: i["FlatType"],
        radarUseage: i["radarUseage"]
        ) 
end

def read_csv
  CSV.foreach("mock_data.csv", headers: true ) do |row|

    item = row.to_hash
    p item

    # item = item.transform_keys(&:to_sym)

    # fix = item.each{|k,v| item[k] = v}

    re_create_with_hash item
    
  end
end

read_csv

