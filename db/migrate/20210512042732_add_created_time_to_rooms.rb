class AddCreatedTimeToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :created_time, :time
  end
end
