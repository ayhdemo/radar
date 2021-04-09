class Admin::SyslogsController < Admin::BaseController
  def show
  	@syslogs = Syslog.last(20).reverse.to_json
  end
end

