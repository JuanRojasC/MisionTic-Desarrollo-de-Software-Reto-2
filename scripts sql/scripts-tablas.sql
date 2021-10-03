Create table CLIENT(
    ID number PRIMARY KEY,
    Name VARCHAR(4000),
    Email VARCHAR2(20),
    Age NUMBER
);

Create table MESSAGE(
    ID NUMBER PRIMARY KEY,
    Messagetext VARCHAR2(4000) 
);

CREATE TABLE PARTYROOM (
    ID NUMBER NOT NULL,
    owner varchar2(20) NOT NULL,
    capacity NUMBER NULL,
    category_id NUMBER NULL,
    name varchar2(400) NULL,
    PRIMARY KEY (id)
);

Create table CATEGORY(
    ID NUMBER PRIMARY KEY,
    name VARCHAR2(400) 
);
