class AddTestToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :test, :string
  end
end
