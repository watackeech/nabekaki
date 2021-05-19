Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  root 'rooms#index'
  get 'rooms/new' => 'rooms#new'
  get 'rooms/join' => 'rooms#join'
  get 'rooms/:room_name/lounge' => 'rooms#lounge', as: 'lounge'
  get 'rooms/:room_name/results' => 'rooms#results', as: 'results'
  # ajax通信用のurl
  get 'rooms/:room_name/loungeajax.html.erb' => 'rooms#loungeajax'
  get 'rooms/:room_name/showjax.html.erb' => 'rooms#showjax'
  get 'rooms/:room_name/picajax.html.erb' => 'rooms#picajax'
  get 'rooms/:room_name/myturnajax.html.erb' => 'rooms#myturnajax'
  post '/rooms' => 'rooms#create'
  post '/picpost' => 'picpost#create'
  get 'rooms/ajax'
  get 'rooms/:room_name' => 'rooms#show', as: 'room'
  devise_for :users

end
