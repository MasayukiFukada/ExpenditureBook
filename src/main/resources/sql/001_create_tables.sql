CREATE TABLE Category
(id VARCHAR(50) NOT NULL,
type INTEGER NOT NULL,
name VARCHAR(50) NOT NULL,
note VARCHAR(255) NOT NULL,
is_enable BOOLEAN NOT NULL,
sort_order_no INTEGER NOT NULL,
create_at DATETIME NOT NULL,
update_at DATETIME,
PRIMARY KEY (id));

CREATE TABLE Expenditure
(id VARCHAR(50) NOT NULL,
date DATE NOT NULL,
category_id VARCHAR(50) NOT NULL,
ammount INTEGER NOT NULL,
note VARCHAR(255) NOT NULL,
create_at DATETIME NOT NULL,
update_at DATETIME,
PRIMARY KEY (id),
FOREIGN KEY (category_id) REFERENCES Category (id));