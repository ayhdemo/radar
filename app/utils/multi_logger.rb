require 'logger'

class MultiLogger
  def initialize(*_targets)
    @targets = _targets
    @targets.map { |logger|
      next if logger.nil?
      logger.formatter = proc do |severity, datetime, progname, msg|
        "#{severity[0]} [#{datetime.utc.strftime('%Y-%m-%dT%H:%M:%S.%6N')} ##{Process.pid}] #{msg}\n"
      end
    }
  end

  %w(log debug info warn error).each do |m|
    define_method(m) do |*args, &block|
      class_name = args.shift.class
      args[0] = "[#{class_name}]: " + args[0].to_s
      @targets.map { |t| t.send(m, *args, &block) unless t.nil?}
    end
  end
end
