CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR (80) NOT NULL,
	"isComplete" BOOLEAN DEFAULT FALSE NOT NULL,
	"dateAdded" VARCHAR (20) NOT NULL,
	"timeAdded" VARCHAR (20) NOT NULL,
	"dateCompleted" VARCHAR (20),
	"timeCompleted" VARCHAR (20)
);

INSERT INTO "tasks" 
	("task","isComplete", "dateAdded", "timeAdded", "dateCompleted", "timeCompleted")
VALUES 
	('Become a Pokemon Master', 'false', '10/24/14', '7:34PM', null, null),
	('Buy Mom a house', 'false', '06/24/20', '11:34AM', null, null),
	('Travel to the moon', 'false', '05/24/03', '12:34PM', null, null);