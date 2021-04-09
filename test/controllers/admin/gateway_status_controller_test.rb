require 'test_helper'

class Admin::GatewayStatusControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_gateway_status_index_url
    assert_response :success
  end

end
