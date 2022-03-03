cd ..
export PROJECT_ID="$(gcloud config get-value project -q)"
gcloud auth configure-docker

cd apps
cd gateway

docker build -t ritta-gateway:latest .
docker tag ritta-gateway:latest "gcr.io/${PROJECT_ID}/ritta-gateway:v1"
docker push "gcr.io/${PROJECT_ID}/ritta-gateway:v1"
 
cd ..
cd users

docker build -t ritta-users:latest .
docker tag ritta-users:latest "gcr.io/${PROJECT_ID}/ritta-users:v1"
docker push "gcr.io/${PROJECT_ID}/ritta-users:v1"

cd ..
cd auth

docker build -t ritta-auth:latest .
docker tag ritta-auth:latest "gcr.io/${PROJECT_ID}/ritta-auth:v1"
docker push "gcr.io/${PROJECT_ID}/ritta-auth:v1"

cd ..
cd core

docker build -t ritta-core:latest .
docker tag ritta-core:latest "gcr.io/${PROJECT_ID}/ritta-core:v1"
docker push "gcr.io/${PROJECT_ID}/ritta-core:v1"
