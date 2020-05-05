#!/bin/bash

docker kill orgmap
docker container rm orgmap
docker image rm aa5330593/orgmap
docker build -t aa5330593/orgmap .
docker run -p 8888:8888 --name orgmap -d aa5330593/orgmap
