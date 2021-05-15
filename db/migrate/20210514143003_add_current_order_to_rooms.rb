class AddCurrentOrderToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :current_drawing_number, :integer, default: 0
  end
end
