class RemoveTraitsFromPictures < ActiveRecord::Migration[6.1]
  def change
    remove_column :pictures, :test, :string
    remove_column :pictures, :testtext, :text
  end
end
