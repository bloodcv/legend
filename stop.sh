echo "Stopping container and removing image..."
docker stop leg-july
docker rm leg-july
docker rmi leg-july:1.0.0