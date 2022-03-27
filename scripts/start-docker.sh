#!/bin/bash
function createNetwork () {
    if [ -z $(docker network ls --filter name=^$1$ --format="{{ .Name }}") ] ; then 
        docker network create $1 >> /dev/null;
        echo "Created network $1" 
    fi
}

for i in "grafana" "rmq" "databases"; do
    echo "Creating network ritta-$i"
    createNetwork "ritta-$i"
done

for i in "rmq" "grafana" "databases" "services"; do
  echo "Starting $i..."

  # $1 is there because you might want to specify --build flag
  if [ "$i" = "services" ]; then
    docker-compose -f ./docker/$i/docker-compose.yml up $1
  else
    docker-compose -f ./docker/$i/docker-compose.yml up -d &
    echo "Started $i"
  fi
done