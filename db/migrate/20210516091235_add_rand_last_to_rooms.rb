class AddRandLastToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :rand_last_character, :string, default: "ち"
  end
end
