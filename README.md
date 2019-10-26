# Bootcamp 8.0 (RocketSeat)

## Summary

- [Start project](#start-project)
- [Database configuration](#database-configuration)



## Start project

To start project make the clone on your computer

```
git clone https://github.com/AndersonAndrad/Bootcamp8.0backend.git
```

After he clones

```
yarn install
```

***I use yarn but fell free if you want to use npm***

After he installs all the dependencies

```
yarn sequelize db:migrate
```

This will cause him to create all tables in database

***If you don't have a database still check the database configuration step "[Database configuration](#database-configuration)"***

## Database configuration

**For the database I'm using docker**

```
docker run --name nameYourDatabase -e POSTGRES_PASSWORD=yourPassword -p 5432:5432 -d postgres:11.5

exp: docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11.5
```

After downloading the image

```
docker start yourImage
exp: docker start database
```

***Remember that the setting that is path "src/config/database.js" is particulate, and you can change it at any time. If not change create the database of the same name that is there "bootcamp"***

