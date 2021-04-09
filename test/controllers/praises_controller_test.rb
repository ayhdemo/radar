require 'test_helper'

class PraisesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @praise = praises(:one)
  end

  test "should get index" do
    get praises_url
    assert_response :success
  end

  test "should get new" do
    get new_praise_url
    assert_response :success
  end

  test "should create praise" do
    assert_difference('Praise.count') do
      post praises_url, params: { praise: {  } }
    end

    assert_redirected_to praise_url(Praise.last)
  end

  test "should show praise" do
    get praise_url(@praise)
    assert_response :success
  end

  test "should get edit" do
    get edit_praise_url(@praise)
    assert_response :success
  end

  test "should update praise" do
    patch praise_url(@praise), params: { praise: {  } }
    assert_redirected_to praise_url(@praise)
  end

  test "should destroy praise" do
    assert_difference('Praise.count', -1) do
      delete praise_url(@praise)
    end

    assert_redirected_to praises_url
  end
end
