class AddPersonalPointsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :personal_points, :integer, default: 0
  end
end
