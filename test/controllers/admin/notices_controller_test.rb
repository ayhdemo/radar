require 'test_helper'

class Admin::NoticesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin_notice = admin_notices(:one)
  end

  test "should get index" do
    get admin_notices_url
    assert_response :success
  end

  test "should get new" do
    get new_admin_notice_url
    assert_response :success
  end

  test "should create admin_notice" do
    assert_difference('Admin::Notice.count') do
      post admin_notices_url, params: { admin_notice: { content: @admin_notice.content, title: @admin_notice.title } }
    end

    assert_redirected_to admin_notice_url(Admin::Notice.last)
  end

  test "should show admin_notice" do
    get admin_notice_url(@admin_notice)
    assert_response :success
  end

  test "should get edit" do
    get edit_admin_notice_url(@admin_notice)
    assert_response :success
  end

  test "should update admin_notice" do
    patch admin_notice_url(@admin_notice), params: { admin_notice: { content: @admin_notice.content, title: @admin_notice.title } }
    assert_redirected_to admin_notice_url(@admin_notice)
  end

  test "should destroy admin_notice" do
    assert_difference('Admin::Notice.count', -1) do
      delete admin_notice_url(@admin_notice)
    end

    assert_redirected_to admin_notices_url
  end
end
