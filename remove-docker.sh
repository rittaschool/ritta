#!/bin/bash
function removeNetwork () {
    docker network remove $1;
    echo "Removed network $1" 
}

echo "Removing Ritta Services..."
docker-compose -f ./docker/services/docker-compose.dev.yml down
echo "Removed Services"

echo "Removing RabbitMQ..."
docker-compose -f ./docker/rmq/docker-compose.yml down
echo "Removed RabbitMQ"

echo "Removing Grafana..."
docker-compose -f ./docker/grafana/docker-compose.yml down
echo "Removed Grafana"

echo "Removing databases..."
docker-compose -f ./docker/databases/docker-compose.yml down
echo "Removed databases"

removeNetwork "ritta-grafana"
removeNetwork "ritta-rmq"
removeNetwork "ritta-databases"