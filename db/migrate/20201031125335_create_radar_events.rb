class CreateRadarEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :radar_events do |t|
      t.string :SN
      t.string :RT
      t.string :RTD
      t.string :Lon
      t.string :Lat
      t.string :ASP
      t.string :GM
      t.string :DM
      t.string :MBM
      t.string :XH
      t.string :MxP
      t.string :RF
      t.string :RFs
      t.string :BW
      t.string :PRI
      t.string :PRIs
      t.string :PW
      t.string :PWs
      t.string :ph   
      t.string :rno
      t.string :usage
      t.string :FlatType

      t.string :TargetType
      t.string :RadarSys
      t.string :RadarUseage
      t.string :RadarWorkMode
      t.string :RadarGroup
      t.string :GroupMethod

      t.timestamps
    end
  end
end
