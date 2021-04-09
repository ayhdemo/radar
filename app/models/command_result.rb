class CommandResult
  attr_accessor :data, :error
  def initialize(_data, _err = nil)
    @data = _data
    @error  = _err
  end
end