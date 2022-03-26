for i in "gateway" "users" "core" "auth" "messages"; do
    cd "apps/$i"
    echo "Updating $i..."
    yarn
    cd ..
    echo "Updated $i"
done
