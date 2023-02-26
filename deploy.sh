NEXTPORT=8089
POCKETPORT=8090

"/usr/bin/pm2" restart "quizzable" && echo "Restarting Service" || cd "/server/quizzable" && "/usr/bin/pm2" start npm --name "quizzable" -- run start -- -p $NEXTPORT && echo "Starting Service"
"/server/quizzable/pocketbase/quizzable" serve || fuser -n tcp -k $POCKETPORT && "/server/quizzable/pocketbase/quizzable" serve