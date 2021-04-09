require 'test_helper'

class ApksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @apk = apks(:one)
  end

  test "should get index" do
    get apks_url
    assert_response :success
  end

  test "should get new" do
    get new_apk_url
    assert_response :success
  end

  test "should create apk" do
    assert_difference('Apk.count') do
      post apks_url, params: { apk: {  } }
    end

    assert_redirected_to apk_url(Apk.last)
  end

  test "should show apk" do
    get apk_url(@apk)
    assert_response :success
  end

  test "should get edit" do
    get edit_apk_url(@apk)
    assert_response :success
  end

  test "should update apk" do
    patch apk_url(@apk), params: { apk: {  } }
    assert_redirected_to apk_url(@apk)
  end

  test "should destroy apk" do
    assert_difference('Apk.count', -1) do
      delete apk_url(@apk)
    end

    assert_redirected_to apks_url
  end
end
