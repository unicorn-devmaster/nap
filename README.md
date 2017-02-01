# nap
[WIP] NextJS/Apollo/PassportJS

![](art/nap-logo.png)

```
Docker
├─ Nginx ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]
├─ NodeJS
│  ├─ PassportJS ["/vendors"]
│  ├─ Apollo GraphQL ["/graphql"]
│  └─ NextJS ["/app"]
├─ Redis ["/data"]
└─ MongoDB ["/data/db"]
```

## Develop
```shell
# To build docker compose
docker-compose build

# To run via docker compose
docker-compose up -d

# Open browser (Stop other localhost services first)
open http://localhost:3000/
```

## TODO
- [x] Create [Dockerfile](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) with [nextjs-apollo](https://github.com/zeit/next.js/blob/master/examples)
- [ ] Volume `./app`
- [ ] Add express https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#create-the-node-js-app
- [ ] Add GraphQL https://github.com/philipz/react-starter-kit/blob/master/src/server.js#L77
- [ ] Add passport https://github.com/philipz/react-starter-kit/blob/master/src/server.js#L59
- [ ] Add passport (optional) https://github.com/kriasoft/nodejs-api-starter/blob/master/src/passport.js
- [ ] Add [Swarm mode stack](https://gist.githubusercontent.com/katopz/e4d5cf402a53c4a002a657c4c4f67a3f/raw/077ac9057c789f49a366563941dd749827d52e3d/setup-swarm-stack.sh)
- [ ] Add async register.
- [ ] Custom app, Ensure ES6 with vscode debug working.
- [ ] Custom schema, Ensure graphql-tools
- [ ] Custom DB, orm, MongoDB `docker exec -it node1 mongo --eval "rs.initiate()"`
- [x] Create docker compose.
- [ ] env_file: .env https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L10
- [ ] yarn https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L18
- [ ] redis https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L34

## TOHAVE
- [ ] Use base-image? https://github.com/phusion/passenger-docker
- [ ] Use yo gen passport vendors
- [ ] RabbitMQ.
- [ ] Debug with VSCode https://alexanderzeitler.com/articles/debugging-a-nodejs-es6-application-in-a-docker-container-using-visual-studio-code/