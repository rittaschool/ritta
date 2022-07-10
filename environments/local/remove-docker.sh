#!/bin/bash
function removeNetwork () {
    docker network remove $1 >> /dev/null;
    echo "Removed network $1" 
}

for i in "services" "rmq" "grafana" "databases"; do
  echo "Removing $i..."
  docker-compose -f environments/local/docker/$i/docker-compose.yml down
  echo "Removed $i"
done

for i in "grafana" "rmq" "databases"; do
    echo "Removing network ritta-$i"
    removeNetwork "ritta-$i"
done
