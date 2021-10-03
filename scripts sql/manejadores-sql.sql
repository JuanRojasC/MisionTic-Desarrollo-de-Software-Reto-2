--MANEJADORES TABLA CLIENT

--GET
SELECT * FROM CLIENT

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
SELECT * FROM MESSAGE

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
    WHERE ID =: id;
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
SELECT * FROM CATEGORY

--POST
BEGIN
    INSERT INTO CATEGORY
    (ID, NAME)
    VALUES (:id, :name);
    : status_code := 201;
END;

--PUT
BEGIN
    UPDATE CATEGORY
    SET NAME=: name
    WHERE ID =: id;
    :status_code:=201;
END;

--DELETE
BEGIN
    DELETE FROM CATEGORY
    WHERE ID=:id;
    :status_code:=204;
END;

--MANEJADORES TABLA PARTYROOM

--GET
SELECT * FROM PARTYROOM WHERE ID = :id

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