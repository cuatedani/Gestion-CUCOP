DROP DATABASE IF EXISTS `ut3-sistema-gestion-cucop`;
CREATE DATABASE `ut3-sistema-gestion-cucop`;
USE `ut3-sistema-gestion-cucop`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `lists` (
  `listId` INT AUTO_INCREMENT,
  `userId` int NOT NULL,
  `status` varchar(20),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`listId`),
  KEY `idx_userId` (`userId`),
  CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `cucop` (
  `cucopId` INT AUTO_INCREMENT,
  `clavecucopid` text NOT NULL,
  `clavecucop` INT NOT NULL,
  `descripcion` text,
  `unidaddemedida` varchar(120),
  `tipodecontratacion` varchar(120),
  `partidaespecifica` INT NOT NULL,
  `descpartidaespecifica` varchar(120),
  `partidagenerica` INT NOT NULL,
  `descpartidagenerica` varchar(120),
  `concepto` INT NOT NULL,
  `descconcepto` varchar(120),
  `capitulo` INT NOT NULL,
  `desccapitulo` varchar(120),
  `fechaalta` DATE,
  `fechamodificacion` DATE,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`cucopId`),
  KEY `idx_cucopId` (`cucopId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `products` (
  `productId` INT AUTO_INCREMENT,
  `cucopId` INT NOT NULL,
  `name` varchar(120) NOT NULL,
  `description`  TEXT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`),
  KEY `idx_productId` (`productId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`cucopId`) REFERENCES `cucop` (`cucopId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `list_products` (
  `listProductId` INT AUTO_INCREMENT,
  `listId` INT NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` FLOAT NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`listProductId`),
  KEY `idx_listProductId` (`listProductId`),
  CONSTRAINT `list_products_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `lists` (`listId`) ON DELETE CASCADE,
  CONSTRAINT `list_products_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `suppliers` (
  `supplierId`  INT AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `description` text,
  `tin` text NOT NULL,
  `phone` varchar(15),
  `address` text,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`supplierId`),
  KEY `idx_supplierId` (`supplierId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `quotations` (
  `quotationId` INT AUTO_INCREMENT,
  `supplierId` INT NOT NULL,
  `price` FLOAT NOT NULL,
  `description` TEXT,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quotationId`),
  KEY `idx_quotationId` (`quotationId`),
  CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`supplierId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*
		S E D D E R S


 */
 
 INSERT INTO SUPPLIERS VALUES("La Verduleria", "Venden frutas y verduras al menudeo", "ABCDEFG", "3271091111", "Villas de la colonial #44", true);
