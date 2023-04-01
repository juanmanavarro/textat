deploy:
	git checkout .  \
	&& git pull origin preprod  \
	&& npm cache clean --force  \
	&& npm update  \
	&& npm run build whatsapp-service
start:
	NODE_ENV=preprod pm2 start ./dist/apps/whatsapp-service/main.js --name whatsapp-service --max-memory-restart 1000M --update-env
restart:
	NODE_ENV=preprod pm2 reload whatsapp-service --update-env
