class AddCurrentDrawOrderToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :current_draw_order, :integer
  end
end
