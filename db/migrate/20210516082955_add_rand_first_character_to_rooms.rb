class AddRandFirstCharacterToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :rand_first_character, :string, default: "り"
  end
end
