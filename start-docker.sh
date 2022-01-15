#!/bin/bash
function createNetwork () {
    if [ -z $(docker network ls --filter name=^$1$ --format="{{ .Name }}") ] ; then 
        docker network create $1 ;
        echo "Created network $1" 
    fi
}

createNetwork "ritta-grafana"
createNetwork "ritta-rmq"
createNetwork "ritta-databases"

echo "Starting databases..."
docker-compose -f ./docker/databases/docker-compose.yml up -d
echo "Started databases"

echo "Starting Grafana..."
docker-compose -f ./docker/grafana/docker-compose.yml up -d
echo "Started Grafana"

echo "Starting RabbitMQ..."
docker-compose -f ./docker/rmq/docker-compose.yml up -d
echo "Started RabbitMQ"

echo "Starting Ritta Services..."
docker-compose -f ./docker/services/docker-compose.dev.yml up -d
echo "Started Services"

