docker rm -f $(docker ps -a -q --filter ancestor=rabbotio/nap-app)