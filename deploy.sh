"/usr/bin/pm2" stop "quizzable"
cd "/server/quizzable" && "/usr/bin/pm2" start npm --name "quizzable" -- run start -- -p 8089
"/server/quizzable/pocketbase/quizzable" serve