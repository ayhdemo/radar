# coding: utf-8
class CreatePosts < ActiveRecord::Migration[5.0]
  def change
    create_table :posts, comment: '文章' do |t|
      t.string :title, limit: 180, comment: '标题'
      t.string :subtitle, limit: 180, comment: '文章副标题'
      t.text :excerpt, comment: '文章摘要'
      t.text :content, limit: 16.megabytes - 1, comment: '文章正文 MEDIUMTEXT - 16,777,215 bytes'
      t.integer :sequence, default: 1, comment: '文章排序'
      t.string :author, limit: 180, comment: '发布用户名'
      t.string :post_banner_pic, limit: 180, comment: '文章'
      t.string :post_index_pic, limit: 180
      t.string :post_show_pic , limit: 180
      t.datetime :publish_time
      t.integer :genre, default: 1, comment: 'genre'
      t.integer :task_id, comment: '任务ID'
      t.text :source_url, comment: '源地址'
      t.integer :status, default: 1, comment: '文章状态'
      t.boolean :state, default: true, comment: '信息状态'

      t.timestamps
    end
  end
end
