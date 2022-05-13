# ClickMe Rest API

Headless URL shortening service

## Getting started via docker

1. Clone the repository [https://github.com/yathindrakodithuwakku/clickme-server](https://github.com/yathindrakodithuwakku/clickme-server)
2. Run `docker build . -t yathindra/clickme-server` to create the docker image
3. In production, run `docker run -p 8080:8080 -d yathindra/clickme-server` to run the docker image as a container. If the env is dev, run `docker build . -t yathindra/clickme-server -f Dockerfile.dev`