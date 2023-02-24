NEXTPORT=8089
POCKETPORT=8090

"/usr/bin/pm2" delete "quizzable" || echo "No process found, continuing..."
cd "/server/quizzable" && "/usr/bin/pm2" start npm --name "quizzable" -- run start -- -p $NEXTPORT
"/server/quizzable/pocketbase/quizzable" serve || fuser -n tcp -k $POCKETPORT && "/server/quizzable/pocketbase/quizzable" serve