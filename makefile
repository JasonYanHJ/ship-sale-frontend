build-dev:
	docker build -f docker/dev/Dockerfile -t ship-sale-frontend:dev .

run-dev:
	docker run -dit -p 5173:5173 --name ship-sale-frontend-dev ship-sale-frontend:dev

build-prod:
	docker build -f docker/prod/Dockerfile -t ship-sale-frontend:prod .