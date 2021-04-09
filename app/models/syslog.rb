class Syslog < ApplicationRecord
	belongs_to :sig
	after_create_commit :use_cable

	def created_at
    attributes['created_at'].strftime("%Y-%m-%d %H:%M:%S")
  end

  def use_cable
  	puts "use_cable"
  	ActionCable.server.broadcast "room_channel", message: self.as_json
  end
end
