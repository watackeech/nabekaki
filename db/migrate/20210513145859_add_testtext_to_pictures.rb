class AddTesttextToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :testtext, :text
  end
end
