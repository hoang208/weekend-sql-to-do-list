CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR (80) NOT NULL,
	"isComplete" BOOLEAN DEFAULT FALSE NOT NULL
);

INSERT INTO "tasks" 
	("task","isComplete")
VALUES 
	('Become a Pokemon Master', 'false'),
	('Buy Mom a house', 'false'),
	('Travel to the moon', 'false');