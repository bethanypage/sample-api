CREATE TABLE IF NOT EXISTS Clients(
id SERIAL,
cName varchar(80),
PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Jobs(
id SERIAL,
clientID int,
jobType varchar(80),
startDate date,
endDate date,
PRIMARY KEY(id)
);


