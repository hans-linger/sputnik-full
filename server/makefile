prepare-network: delete-network create-network

delete-network:
	docker network rm sputnikMongoCluster -f

create-network:
	docker network create sputnikMongoCluster


prepare-db: mongo1 mongo2 mongo3 prepare-replica

mongo1:
	docker run -d -p 27020:27017 --name sputnikAppMongo1 --network sputnikMongoCluster mongo:5 mongod --replSet sputnikMongoReplica --bind_ip localhost,sputnikAppMongo1

mongo2:
	docker run -d -p 27018:27017 --name sputnikAppMongo2 --network sputnikMongoCluster mongo:5 mongod --replSet sputnikMongoReplica --bind_ip localhost,sputnikAppMongo2

mongo3:
	docker run -d -p 27019:27017 --name sputnikAppMongo3 --network sputnikMongoCluster mongo:5 mongod --replSet sputnikMongoReplica --bind_ip localhost,sputnikAppMongo3

prepare-replica:
	docker exec -it sputnikAppMongo1 mongosh --eval "rs.initiate({ _id: \"sputnikMongoReplica\", members: [ {_id: 0, host: \"sputnikAppMongo1\"}, {_id: 1, host: \"sputnikAppMongo2\"}, {_id: 2, host: \"sputnikAppMongo3\"} ] })"

prepare-all: prepare-network prepare-db prepare-replica

delete-containers:
	docker container rm sputnikAppMongo3 -f -v
	docker container rm sputnikAppMongo2 -f -v
	docker container rm sputnikAppMongo1 -f -v

clean: delete-containers delete-network

check:
	docker ps -a
	docker exec -it sputnikAppMongo1 mongosh --eval "rs.status()"
