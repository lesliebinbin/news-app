namespace :cljs do
  desc "TODO"
  task compile: :environment do
    if Rails.env.development? or Rails.env.test?
      system("yarn shadow-cljs compile app")
    else 
      system("yarn shadow-cljs release app")
    end
  end
  task watch: :environment do
      system("yarn shadow-cljs watch app")
  end
end
task 'webpacker:compile' => 'cljs:compile'
