class RemoveHostIdFromRooms < ActiveRecord::Migration[6.1]
  def change
    remove_column :rooms, :host_id, :integer
  end
end
