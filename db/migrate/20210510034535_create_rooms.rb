class CreateRooms < ActiveRecord::Migration[6.1]
  def change
    create_table :rooms do |t|
      t.text :room_name
      t.integer :host_id

      t.timestamps
    end
  end
end
