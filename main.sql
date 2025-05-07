
CREATE TABLE cbdc_users (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  phone VARCHAR2(20),
  name VARCHAR2(50),
  surname VARCHAR2(50),
  email VARCHAR2(100),
  house VARCHAR2(100),
  id_number VARCHAR2(30),
  bank_name VARCHAR2(50),
  bank_account VARCHAR2(30),
  cbdc_balance NUMBER,
  bank_balance NUMBER,
  PRIMARY KEY (id)
);
