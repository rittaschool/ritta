#!/bin/bash
function createNetwork () {
    if [ -z $(docker network ls --filter name=^$1$ --format="{{ .Name }}") ] ; then 
        docker network create $1 ;
        echo "Created network $1" 
    fi
}

for i in "grafana" "rmq" "databases"; do
    echo "Creating network ritta-$i"
    createNetwork "ritta-$i"
done

for i in "services" "rmq" "grafana" "databases"; do
  echo "Starting $i..."
  docker-compose -f ./docker/$i/docker-compose.yml up
  echo "Started $i"
done

