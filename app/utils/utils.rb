module Utils
  class << self
    def first_non_empty_str(*arg)
      while arg.length > 0
        str = arg.shift
        next unless str.instance_of? String

        if str.length > 0
          return str
        end
      end

      nil
    end
  end
end