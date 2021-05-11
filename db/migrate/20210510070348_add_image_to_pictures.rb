class AddImageToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :image, :string
  end
end
