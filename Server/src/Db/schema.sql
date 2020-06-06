ALTER USER root
IDENTIFIED WITH mysql_native_password 
BY 'password';

create database if not exists news;
use news;

CREATE TABLE if not exists games
(
  id int not null auto_increment primary key,
  game_name varchar(64) not null,
  main_news_url varchar(100) not null,
  date_entered timestamp not null,
  UNIQUE KEY(game_name)
);

CREATE TABLE if not exists articles
(
  id int not null auto_increment primary key,
  title varchar(128) not null,
  description varchar(256),
  link varchar(256) not null,
  imageUrl varchar(256),
  category varchar(50),
  authors varchar(100),
  game_id int not null,
  date_published date not null,
  date_entered timestamp,
  UNIQUE KEY(title)
);

INSERT INTO games
(game_name, main_news_url, date_entered)
VALUES
("Apex Legends", "https://www.ea.com/games/apex-legends/news", current_timestamp),
("Counter Strike Global Offensive", "https://blog.counter-strike.net/index.php/category/updates/", current_timestamp),
("Fortnite", "https://www.epicgames.com/fortnite/en-US/news", current_timestamp),
("Hearthstone", "https://playhearthstone.com/en-us/news", current_timestamp),
("League of Legends", "https://na.leagueoflegends.com/en-us/news/game-updates/", current_timestamp),
("Overwatch", "https://playoverwatch.com/en-us/news", current_timestamp),
("Legends of Runeterra", "https://playruneterra.com/en-us/news", current_timestamp),
("Valorant", "https://beta.playvalorant.com/en-us/news/", current_timestamp);
("Teamfight Tactics", "https://teamfighttactics.leagueoflegends.com/en-us/news/", current_timestamp);