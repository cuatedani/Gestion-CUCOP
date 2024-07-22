DROP DATABASE IF EXISTS `ut3-sistema-gestion-cucop`;
CREATE DATABASE `ut3-sistema-gestion-cucop`;
USE `ut3-sistema-gestion-cucop`;

CREATE TABLE `users` (
  `userId` INT AUTO_INCREMENT,
  `firstNames` varchar(120) NOT NULL,
  `lastNames` varchar(120),
  `email` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `rol` enum('admin','normal') NOT NULL DEFAULT 'normal',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lists` (
  `listId` INT AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(120) NOT NULL,
  `description` TEXT,
  `status` varchar(20) DEFAULT "CREADA",
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`listId`),
  KEY `idx_userId` (`userId`),
  CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cucop` (
  `cucopId` INT AUTO_INCREMENT,
  `clavecucop` INT NOT NULL,
  `descripcion` TEXT,
  `unidaddemedida` varchar(120),
  `tipodecontratacion` varchar(120),
  `partidaespecifica` INT NOT NULL,
  `descpartidaespecifica` varchar(200),
  `partidagenerica` INT NOT NULL,
  `descpartidagenerica` varchar(200),
  `concepto` INT NOT NULL,
  `descconcepto` varchar(200),
  `capitulo` INT NOT NULL,
  `desccapitulo` varchar(200),
  PRIMARY KEY (`cucopId`),
  KEY `idx_cucopId` (`cucopId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `products` (
  `productId` INT AUTO_INCREMENT,
  `cucopId` INT NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `description` TEXT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`),
  KEY `idx_productId` (`productId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`cucopId`) REFERENCES `cucop` (`cucopId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `suppliers` (
  `supplierId`  INT AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `tin` text NOT NULL,
  `description` TEXT,
  `phone` TEXT,
  `address` TEXT ,
  `email` TEXT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`supplierId`),
  KEY `idx_supplierId` (`supplierId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `quotations` (
  `quotationId` INT AUTO_INCREMENT,
  `listId` INT NOT NULL,
  `supplierId` INT NOT NULL,
  `description` TEXT NOT NULL,
  `date` TIMESTAMP NOT NULL,
  `quotNumber` TEXT,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quotationId`),
  KEY `idx_quotationId` (`quotationId`),
  CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `lists` (`listId`) ON DELETE CASCADE,
  CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`supplierId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `quotations_products` (
  `quotProductId` INT AUTO_INCREMENT,
  `quotationId` INT NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` FLOAT NOT NULL,
  `totalPrice` FLOAT GENERATED ALWAYS AS (quantity * price) STORED,
  `details` TEXT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quotProductId`),
  KEY `idx_QuotationProductId` (`quotProductId`),
  CONSTRAINT `list_products_ibfk_1` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`quotationId`) ON DELETE CASCADE,
  CONSTRAINT `list_products_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*
		S E D D E R S
 */
INSERT INTO USERS (firstNames, lastNames, email, password, rol, active)
 VALUES
 ("Juan Daniel", "Gomez Gonzalez", "correo@cicese.com", "12345678", "admin", true);
 
INSERT INTO SUPPLIERS (name, description, tin, phone, address, active)
 VALUES
 ("Proveedor Generico", "Proveedor generico", "ABCDEFG", "0000000000", "Sin dirección", true);
 
-- 		S E L E C T S
 
-- SELECT * FROM USERS;
-- SELECT * FROM SUPPLIERS;
-- SELECT * FROM CUCOP ;
--
-- SELECT DISTINCT desccapitulo, capitulo FROM CUCOP;
-- SELECT DISTINCT descconcepto, concepto FROM CUCOP;
-- SELECT DISTINCT descpartidagenerica, partidagenerica FROM CUCOP;
-- SELECT DISTINCT descpartidaespecifica, partidaespecifica FROM CUCOP;

-- SELECT * FROM PRODUCTS;
-- SELECT * FROM QUOTATIONS;
-- SELECT * FROM LISTS;
-- SELECT * FROM QUOTATIONS_PRODUCTS;
-- SELECT * FROM PRODUCTS;

--  	D R O P S
-- DROP TABLE LIST_PRODUCTS;
-- DROP TABLE PRODUCTS;
-- DROP TABLE CUCOP;
-- DROP TABLE LISTS;

-- 		D E L E T E S
-- DELETE FROM LISTS WHERE listId != 1

-- 		A L T E R S
-- 
