#!/bin/bash
set -x

[ -z "$ID_OFFSET" ] && ID_OFFSET=1
export ZOOKEEPER_SERVER_ID=$((${HOSTNAME##*-} + $ID_OFFSET))
echo "${ZOOKEEPER_SERVER_ID:-1}" | tee /var/lib/zookeeper/data/myid
cp -Lur /etc/kafka-configmap/* /etc/kafka/
sed -i "s/server\.$ZOOKEEPER_SERVER_ID\=[a-z0-9.-]*/server.$ZOOKEEPER_SERVER_ID=0.0.0.0/" /etc/kafka/zookeeper.properties