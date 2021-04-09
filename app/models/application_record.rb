class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def missing_face
    "/img/missing_face.png"
  end

  def missing_article
    "/img/missing_article.png"
  end

  def missing_category
    "/img/missing_category.png"
  end
end
