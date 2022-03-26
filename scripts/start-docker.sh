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

for i in "rmq" "grafana" "databases" "services" ; do
  echo "Starting $i..."

  if [ "$i" = "services" ]; then
    docker-compose -f ./docker/$i/docker-compose.yml up 
  else
    docker-compose -f ./docker/$i/docker-compose.yml up -d &
    echo "Started $i"
  fi
done
