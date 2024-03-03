export VITE_ACTIVE_DATE=`date +'%Y-%m-%d'`
echo ${VITE_ACTIVE_DATE}
docker build --build-arg VITE_ZABBIX_SCHEMA=http \
--build-arg VITE_ZABBIX_DOMAIN=127.0.0.1 \
--build-arg VITE_ZABBIX_ACCOUNT=Admin \
--build-arg VITE_ZABBIX_PASSWORD=zabbix \
--build-arg VITE_SALT=secret-key \
--build-arg VITE_ISS_DOMAIN=iss-domain.com \
--build-arg VITE_CONFIG_PASSWORD=example \
--build-arg VITE_ACTIVE_DATE=${VITE_ACTIVE_DATE} \
-t leg-july:1.0.0 .
docker run -it -d -p 3000:3000 --name leg-july --restart always leg-july:1.0.0
