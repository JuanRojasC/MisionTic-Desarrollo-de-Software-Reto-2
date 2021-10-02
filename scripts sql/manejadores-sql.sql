--MANEJADORES TABLA CLIENT

--GET
select * from client;

--POST
BEGIN
    INSERT INTO CLIENT
    (ID, NAME, EMAIL, AGE)
    VALUES (:id,:name,:email,:age);
    :status_code:= 201;
END;

--PUT
BEGIN
    UPDATE CLIENT 
    SET ID =: id, NAME =: name, EMAIL =: email, AGE =: age
    WHERE ID =: id;
    :status_code:=201;
END;

--DELETE
BEGIN
    DELETE FROM CLIENT
    WHERE ID=:id;
    :status_code:=204;
END;

--MANEJADORES TABLA MESSAGE

--GET
select * from message;

--POST
BEGIN
    INSERT INTO MESSAGE
    (ID, MESSAGETEXT)
    VALUES (:id, :messagetext);
    : status_code := 201;
END;

--PUT
BEGIN
    UPDATE MESSAGE
    SET MESSAGETEXT =: messagetext
    where ID =: id;
    :status_code:=201;
END;

--DELETE
BEGIN
    DELETE FROM MESSAGE
    WHERE ID=:id;
    :status_code:=204;
END;

--MANEJADORES TABLA CATEGORIA

--GET
select * from categoria;

--POST
BEGIN
    INSERT INTO categoria
    (id, name)
    VALUES (:id, :name);
    : status_code := 201;
END;

--PUT
BEGIN
    UPDATE categoria
    SET name=: name
    where ID =: id;
    :status_code:=201;
END;

--DELETE
BEGIN
    DELETE FROM categoria
    WHERE ID=:id;
    :status_code:=204;
END;

--MANEJADORES TABLA PARTYROOM

--GET
SELECT * FROM PARTYROOM WHERE ID = :id;

--POST
BEGIN
    INSERT INTO PARTYROOM(id, owner, capacity, category_id, name)
    VALUES(:id, :owner, :capacity, :category_id, :name);
    :status_code := 201;
END;

--PUT
BEGIN
    UPDATE PARTYROOM SET OWNER=:owner,CAPACITY=:capacity,
    CATEGORY_ID=:category_id, NAME=:name where id=:id;
    :status_code := 201;
END;

--DELETE
BEGIN
    DELETE FROM PARTYROOM 
    WHERE ID=:id;
    :status_code := 204;
END;