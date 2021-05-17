class AddPicTraitsToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :length, :integer
    add_column :pictures, :judge, :integer
  end
end
