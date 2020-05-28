docker build -t alexsthub/newsdb .

docker rm -f newsdb

docker run -d \
-p 3306:3306 \
--name newsdb \
--restart on-failure	\
-e MYSQL_ROOT_PASSWORD=$newsDBPassword \
-e MYSQL_DATABASE="news" \
alexsthub/newsdb:latest

# To connect from console
# docker exec -it newsdb mysql -u root -p