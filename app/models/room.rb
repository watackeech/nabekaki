class Room < ApplicationRecord
    validates :room_name, uniqueness: true
    # has_many :pictures
    belongs_to :user
end
