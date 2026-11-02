
CREATE DATABASE IF NOT EXISTS gestion_estudiantes;

USE gestion_estudiantes;

CREATE TABLE IF NOT EXISTS estudiantes (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    matricula VARCHAR(30) NOT NULL UNIQUE,

    carrera VARCHAR(100) NOT NULL

);
