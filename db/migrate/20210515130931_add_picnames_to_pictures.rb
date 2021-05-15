class AddPicnamesToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :in_room_order, :integer
    add_column :pictures, :picname, :string
  end
end
