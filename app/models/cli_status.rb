class CliStatus
  attr_reader :code, :msg, :locked, :cmd

  def initialize(code = 0, locked=false, msg='ok', cmd='')
    @code   = code
    @locked = locked
    @msg    = msg
    @cmd    = cmd
  end
end