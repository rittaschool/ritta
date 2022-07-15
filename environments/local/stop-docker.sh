#!/bin/bash
for i in "services" "rmq" "grafana" "databases"; do
  echo "Stopping $i..."
  docker-compose -f environments/local/docker/$i/docker-compose.yml stop
  echo "Stopped $i"
done