module Other
  class Base < ActiveRecord::Base
    establish_connection configurations['other']
    self.abstract_class = true
  end
end