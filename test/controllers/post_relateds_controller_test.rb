require 'test_helper'

class PostRelatedsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @post_related = post_relateds(:one)
  end

  test "should get index" do
    get post_relateds_url
    assert_response :success
  end

  test "should get new" do
    get new_post_related_url
    assert_response :success
  end

  test "should create post_related" do
    assert_difference('PostRelated.count') do
      post post_relateds_url, params: { post_related: {  } }
    end

    assert_redirected_to post_related_url(PostRelated.last)
  end

  test "should show post_related" do
    get post_related_url(@post_related)
    assert_response :success
  end

  test "should get edit" do
    get edit_post_related_url(@post_related)
    assert_response :success
  end

  test "should update post_related" do
    patch post_related_url(@post_related), params: { post_related: {  } }
    assert_redirected_to post_related_url(@post_related)
  end

  test "should destroy post_related" do
    assert_difference('PostRelated.count', -1) do
      delete post_related_url(@post_related)
    end

    assert_redirected_to post_relateds_url
  end
end
