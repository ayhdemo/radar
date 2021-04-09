module Other
  class User < Base
    self.table_name = 'users'
    self.primary_key = 'id'
  end
end