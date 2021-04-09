App.room = App.cable.subscriptions.create "RoomChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
  	console.log data['message']
  	$('#tbl-syslog').bootstrapTable 'prepend',data['message']
    # $('#syslogs').append data['message']

   
		
		# $tbl_syslog.bootstrapTable('removeAll');	
		# $('#syslogs').append data['message']

  speak: (message)->
  	@perform 'speak', message: message
