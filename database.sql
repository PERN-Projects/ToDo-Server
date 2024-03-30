CREATE TABLE todos (
    tid SERIAL PRIMARY KEY,
    todo VARCHAR(255),
    completed BOOLEAN,
    userId INT(10)
);


