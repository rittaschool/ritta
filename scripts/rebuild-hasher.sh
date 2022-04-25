if [ "$1" = "auth" ] || [ "$1" = "users" ] 
then 
    apk add --no-cache make gcc g++ python3
    npm rebuild argon2 --build-from-source
    apk del make gcc g++ python3 
fi