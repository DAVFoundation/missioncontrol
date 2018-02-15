all:
	pass

up:
	docker-compose build && docker-compose up &

down:
	docker-compose down

flush:
	docker exec -it missioncontrol_redis_1 redis-cli FLUSHALL

log:
	docker logs missioncontrol_missioncontrol_1 -f
