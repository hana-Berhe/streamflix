-- Run once:  mysql -u <user> -p < db/schema.sql
CREATE DATABASE IF NOT EXISTS streamflex;
USE streamflex;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Titles a user saved with the "+" button.
-- title/poster/backdrop are a snapshot so My List renders without another TMDB call.
CREATE TABLE IF NOT EXISTS my_list (
  user_id       INT UNSIGNED  NOT NULL,
  movie_id      INT UNSIGNED  NOT NULL,
  source        ENUM('tmdb','local') NOT NULL,
  media_type    ENUM('movie','tv')   NOT NULL,
  title         VARCHAR(255)  NOT NULL,
  poster_path   VARCHAR(500)  NULL,
  backdrop_path VARCHAR(500)  NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, source, movie_id),
  CONSTRAINT fk_my_list_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Netflix-style ratings: -1 = Not for me, 1 = I like this, 2 = Love this!
CREATE TABLE IF NOT EXISTS ratings (
  user_id       INT UNSIGNED  NOT NULL,
  movie_id      INT UNSIGNED  NOT NULL,
  source        ENUM('tmdb','local') NOT NULL,
  media_type    ENUM('movie','tv')   NOT NULL,
  title         VARCHAR(255)  NOT NULL,
  poster_path   VARCHAR(500)  NULL,
  backdrop_path VARCHAR(500)  NULL,
  rating        TINYINT       NOT NULL,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, source, movie_id),
  CONSTRAINT chk_rating CHECK (rating IN (-1, 1, 2)),
  CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
