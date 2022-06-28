#!/bin/bash
for i in "services" "rmq" "grafana" "databases"; do
  echo "Stopping $i..."
  docker-compose -f ./docker/$i/docker-compose.yml stop
  echo "Stopped $i"
done