# start services
start\:api:
	cd back && npm run start:dev
start\:websockets:
	cd back && npm run start:dev websocket-service
start\:whatsapp:
	cd back && npm run start:dev whatsapp-service
start\:cli:
	cd back && npm run start:dev cli
start\:webapp:
	cd front/webapp && npm run dev
start\:infra:
	docker-compose up -d
start\:stripe:
	./stripe listen --forward-to localhost:3001/stripe/webhook
stripe\:command:
	./stripe trigger ${c}
start\:landing:
	cd front/landing && npm run dev -- -o
start\:dashboard:
	cd front/dashboard && npm run dev

start\:api\:preprod:
	cd back && npm run start:preprod
start\:whatsapp-service\:preprod:
	cd back && npm run start:preprod whatsapp-service
start\:infra\:preprod:
	docker-compose -p textat-debug-preprod down && docker-compose --env-file .env.preprod -f docker-compose.debug.yml -p textat-debug-preprod up -d
start\:infra\:production:
	docker-compose -p textat-debug-production down && docker-compose --env-file .env.production -f docker-compose.debug.yml -p textat-debug-production up -d

# cli
prod\:command:
	@cd back && export NODE_ENV=production && node ./dist/apps/cli/main.js ${c}
command:
	@cd back && export NODE_ENV=development && node ./dist/apps/cli/main.js ${c}

app:
	cd back && nest generate app ${c}
module:
	cd back && nest generate module ${c}
lib:
	cd back && nest generate library ${c}
service:
	cd back && nest generate service ${c} --flat --no-spec
controller:
	cd back && nest generate controller ${c} --flat --no-spec
module:
	cd back && nest generate module ${c}

install:
	cd back && npm i ${c}
test:
	cd back && npm run test:watch

# whatsapp-service\:deploy\:preprod:
# 	scp ./back/dist/apps/whatsapp-service/main.js root@138.68.77.184:~/textat/back/dist/apps/whatsapp-service/main.js \
# 	&& ssh root@138.68.77.184 pm2 restart all --update-env
