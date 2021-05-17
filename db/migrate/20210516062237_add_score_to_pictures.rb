class AddScoreToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :points, :integer
  end
end
