#!/bin/sh
createNetwork() {
  [ -z "$(docker network ls --filter name=^$1$ --format="{{ .Name }}")" ] || return
  docker network create "$1" > /dev/null
  echo "Created network $1"
}

for i in "grafana" "rmq" "databases"; do
  echo "Creating network ritta-$i"
  createNetwork "ritta-$i"
done

for i in "rmq" "grafana" "databases"; do
  echo "Starting $i..."
  docker-compose -f "environments/local/docker/$i/docker-compose.yml" up -d &
  echo "Started $i"
done