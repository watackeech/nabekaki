class AddRandordToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :randorder, :integer
  end
end
