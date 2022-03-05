#!/bin/bash
echo "Stopping Ritta Services..."
docker-compose -f ./docker/services/docker-compose.dev.yml stop
echo "Stopped Services"

echo "Stopping RabbitMQ..."
docker-compose -f ./docker/rmq/docker-compose.yml stop
echo "Stopped RabbitMQ"

echo "Stopping Grafana..."
docker-compose -f ./docker/grafana/docker-compose.yml stop
echo "Stopped Grafana"

echo "Stopping databases..."
docker-compose -f ./docker/databases/docker-compose.yml stop
echo "Stopped databases"