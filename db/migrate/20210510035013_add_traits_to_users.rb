class AddTraitsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :username, :string
    add_column :users, :roomname, :string
    add_column :users, :drawing, :boolean, default: false, null: false
    add_column :users, :randnum, :integer, default: 0
  end
end
