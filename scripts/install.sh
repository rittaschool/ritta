for i in "gateway" "core" "messages" "users" "auth"; do
    cd "apps/$i"
    yarn install
    cd ..
    cd ..
done