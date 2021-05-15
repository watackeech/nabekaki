class RemoveCurrentDrawOrderFromRooms < ActiveRecord::Migration[6.1]
  def change
    remove_column :rooms, :current_draw_order, :integer
  end
end
