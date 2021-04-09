require 'test_helper'

class Admin::SyslogsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get admin_syslogs_show_url
    assert_response :success
  end

end
