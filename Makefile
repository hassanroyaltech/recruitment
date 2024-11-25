# All phony commands are listed here
.PHONY: all env docker docker-build docker-run

all: \
	env \
	docker

env:
	cat example.env.staging >> .env

docker: \
	docker-build \
	docker-run

docker-build:
	docker-compose build

docker-run:
	docker-compose up -d

