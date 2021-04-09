class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
  	puts "======"
  	p data
  	ActionCable.server.broadcast "room_channel", message: [{created_at:Time.now, sig_id:1, content:"xxx"}]
  	# ActionCable.server.broadcast "room_channel", message: data['message']

  end
end
