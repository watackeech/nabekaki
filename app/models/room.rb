class Room < ApplicationRecord
    validates :room_name, uniqueness: true
    belongs_to :user
end
