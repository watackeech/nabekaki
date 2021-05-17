class AddThTurnToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :th_turn, :integer, default: 1
  end
end
