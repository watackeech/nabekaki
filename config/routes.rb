Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  root 'rooms#index'
  get 'rooms/new' => 'rooms#new'
  get 'rooms/join' => 'rooms#join'
  get 'rooms/:room_name/lounge' => 'rooms#lounge', as: 'lounge'
  # ajax通信用のurl
  get 'rooms/:room_name/ajax.html.erb' => 'rooms#ajax'
  get 'rooms/:room_name/showjax.html.erb' => 'rooms#showjax'
  get 'rooms/:room_name/picajax.html.erb' => 'rooms#picajax'
  post 'rooms' => 'rooms#create'
  get 'rooms/ajax'
  get 'rooms/:room_name' => 'rooms#show', as: 'room'
  post 'picsends' => 'picsends#create', as: 'pictures'
  get '/picsends' => 'picsends#dummy'
  devise_for :users

end
