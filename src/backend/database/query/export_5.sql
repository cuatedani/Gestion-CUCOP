-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: ut3-sistema-control-horas
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.22.10.2

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

--
-- Table structure for table `checks`
--

DROP TABLE IF EXISTS `checks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checks` (
  `checkId` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `type` enum('check_in','check_out','justify','NA') NOT NULL DEFAULT 'NA',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`checkId`),
  KEY `idx_customerId` (`customerId`),
  CONSTRAINT `checks_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customers` (`customerId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checks`
--

LOCK TABLES `checks` WRITE;
/*!40000 ALTER TABLE `checks` DISABLE KEYS */;
INSERT INTO `checks` VALUES (3,5,'check_in',1,'2023-08-30 21:16:21',NULL),(4,4,'check_in',1,'2023-08-30 21:16:23',NULL),(5,4,'check_out',1,'2023-08-30 22:33:04',NULL),(6,5,'check_out',1,'2023-08-30 22:33:06',NULL),(7,4,'check_in',1,'2023-08-31 14:20:31',NULL);
/*!40000 ALTER TABLE `checks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `checks_view`
--

DROP TABLE IF EXISTS `checks_view`;
/*!50001 DROP VIEW IF EXISTS `checks_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `checks_view` AS SELECT 
 1 AS `checkId`,
 1 AS `customerId`,
 1 AS `type`,
 1 AS `active`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `customer`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `contactId` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `country` varchar(200) DEFAULT 'México',
  `state` varchar(200) DEFAULT 'Nayarit',
  `municipality` varchar(200) DEFAULT 'Tepic',
  `suburb` text,
  `street` text,
  `cardinalPoint` varchar(100) DEFAULT NULL,
  `number` varchar(100) DEFAULT NULL,
  `cp` varchar(100) DEFAULT NULL,
  `phone1` varchar(100) DEFAULT NULL,
  `phone2` varchar(100) DEFAULT NULL,
  `email1` varchar(200) DEFAULT NULL,
  `email2` varchar(200) DEFAULT NULL,
  `web` text,
  `type` enum('Interno','Externo','Estudiante','Personal','Investigador','Posdoctorante','Otro','NA') NOT NULL DEFAULT 'NA',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`contactId`),
  KEY `idx_contactId` (`contactId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'demo','México','Nayarit','Tepic','Ciudad del conocimiento','Andador 10','','21','631773','','','','','https://ut3.cicese.mx','Interno',1,'2023-08-26 07:44:48',NULL),(2,'Marcelo Alejandro Huerta Espinoza','México','Nayarit','Tepic','Ciudad del conocimiento','Andador 10','','21','631773','','','','','https://ut3.cicese.mx','Interno',1,'2023-08-30 21:10:16',NULL),(3,'Marcelo Alejandro','México','Nayarit','Tepic','Ciudad del conocimiento','Andador 10','','21','631773','','','','','https://ut3.cicese.mx','Interno',1,'2023-08-30 21:10:56',NULL),(4,'Marcelo Alejandro Huerta Espinoza','México','Nayarit','Tepic','Ciudad del conocimiento','Andador 10','','21','631773','','','','','https://ut3.cicese.mx','Interno',1,'2023-08-30 21:13:24','2023-08-30 21:14:11'),(5,'Juan Carlos Villagomez García','México','Nayarit','Tepic','Ciudad del conocimiento','Andador 10','','21','631773','','','','','https://ut3.cicese.mx','Interno',1,'2023-08-30 21:13:52',NULL);
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customerId` int NOT NULL AUTO_INCREMENT,
  `contactId` int NOT NULL,
  `rol` varchar(100) DEFAULT 'Estudiante',
  `institution` varchar(100) DEFAULT NULL,
  `targetHours` float DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customerId`),
  KEY `idx_contactId` (`contactId`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`contactId`) REFERENCES `contacts` (`contactId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (4,4,'Estudiante','MCTAI',2000,1,'2023-08-30 21:13:24',NULL),(5,5,'Estudiante','MCTAI',2000,1,'2023-08-30 21:13:52',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `customers_view`
--

DROP TABLE IF EXISTS `customers_view`;
/*!50001 DROP VIEW IF EXISTS `customers_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `customers_view` AS SELECT 
 1 AS `customerId`,
 1 AS `contactId`,
 1 AS `rol`,
 1 AS `institution`,
 1 AS `targetHours`,
 1 AS `active`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `hoursElapsed`,
 1 AS `contact`,
 1 AS `checkIn`,
 1 AS `checkOut`,
 1 AS `justiffy`,
 1 AS `checks`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstNames` varchar(120) NOT NULL,
  `lastNames` varchar(120) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `rol` enum('admin','normal') NOT NULL DEFAULT 'normal',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Edgar','Pozas','pozas@cicese.mx','bc8db39f614342b78a67494dbece216d3726f6924b73563be34fc630ac1db7f5','admin',1,'2023-08-26 07:44:25','2023-08-26 07:44:25'),(2,'Sandra','López','selopez@cicese.mx','bb3ad25ff3b4a181bdde0e6cd716966af6a8c04fbfd6f5ba6a7f80329657bbde','admin',1,'2023-08-30 21:03:09','2023-08-30 21:03:09'),(3,'Juan','Miranda','jmiranda@cicese.mx','b6732d563965ce5339baaddccbeb62f0e6fcf5f6c0dba493a279ee4ac34a5490','admin',1,'2023-08-30 21:03:34','2023-08-30 21:03:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `checks_view`
--

/*!50001 DROP VIEW IF EXISTS `checks_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `checks_view` AS select `ch`.`checkId` AS `checkId`,`ch`.`customerId` AS `customerId`,`ch`.`type` AS `type`,`ch`.`active` AS `active`,`ch`.`createdAt` AS `createdAt`,`ch`.`updatedAt` AS `updatedAt`,(select json_object('customerId',`c`.`customerId`,'contactId',`c`.`contactId`,'rol',`c`.`rol`,'institution',`c`.`institution`,'active',`c`.`active`,'createdAt',`c`.`createdAt`,'contact',`c`.`contact`) from `customers_view` `c` where (`ch`.`customerId` = `c`.`customerId`)) AS `customer` from `checks` `ch` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `customers_view`
--

/*!50001 DROP VIEW IF EXISTS `customers_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `customers_view` AS select `c`.`customerId` AS `customerId`,`c`.`contactId` AS `contactId`,`c`.`rol` AS `rol`,`c`.`institution` AS `institution`,`c`.`targetHours` AS `targetHours`,`c`.`active` AS `active`,`c`.`createdAt` AS `createdAt`,`c`.`updatedAt` AS `updatedAt`,(select ((case when ((`tmp`.`checkOut` is null) or (`tmp`.`checkIn` is null)) then 0 else timestampdiff(MINUTE,`tmp`.`checkIn`,`tmp`.`checkOut`) end) / 60) AS `timeElapsed` from (select (select `checks`.`createdAt` from `checks` where ((cast(`checks`.`createdAt` as date) = `v`.`selected_date`) and (`checks`.`type` = 'check_in') and (`checks`.`customerId` = `cu`.`customerId`)) order by `checks`.`createdAt` limit 1) AS `checkIn`,(select `checks`.`createdAt` from `checks` where ((cast(`checks`.`createdAt` as date) = `v`.`selected_date`) and (`checks`.`type` = 'check_out') and (`checks`.`customerId` = `cu`.`customerId`)) order by `checks`.`createdAt` limit 1) AS `checkOut` from (((select ('1970-01-01' + interval (((((`t4`.`i` * 10000) + (`t3`.`i` * 1000)) + (`t2`.`i` * 100)) + (`t1`.`i` * 10)) + `t0`.`i`) day) AS `selected_date` from (((((select 0 AS `i` union select 1 AS `1` union select 2 AS `2` union select 3 AS `3` union select 4 AS `4` union select 5 AS `5` union select 6 AS `6` union select 7 AS `7` union select 8 AS `8` union select 9 AS `9`) `t0` join (select 0 AS `i` union select 1 AS `1` union select 2 AS `2` union select 3 AS `3` union select 4 AS `4` union select 5 AS `5` union select 6 AS `6` union select 7 AS `7` union select 8 AS `8` union select 9 AS `9`) `t1`) join (select 0 AS `i` union select 1 AS `1` union select 2 AS `2` union select 3 AS `3` union select 4 AS `4` union select 5 AS `5` union select 6 AS `6` union select 7 AS `7` union select 8 AS `8` union select 9 AS `9`) `t2`) join (select 0 AS `i` union select 1 AS `1` union select 2 AS `2` union select 3 AS `3` union select 4 AS `4` union select 5 AS `5` union select 6 AS `6` union select 7 AS `7` union select 8 AS `8` union select 9 AS `9`) `t3`) join (select 0 AS `i` union select 1 AS `1` union select 2 AS `2` union select 3 AS `3` union select 4 AS `4` union select 5 AS `5` union select 6 AS `6` union select 7 AS `7` union select 8 AS `8` union select 9 AS `9`) `t4`)) `v` join `customers` `cu`) join `contacts` `co` on((`cu`.`contactId` = `co`.`contactId`))) where ((`cu`.`customerId` = `c`.`customerId`) and (`v`.`selected_date` >= cast(`cu`.`createdAt` as date)) and (`v`.`selected_date` <= now()))) `tmp`) AS `hoursElapsed`,(select json_object('contactId',`co`.`contactId`,'name',`co`.`name`,'country',`co`.`country`,'state',`co`.`state`,'municipality',`co`.`municipality`,'suburb',`co`.`suburb`,'street',`co`.`street`,'cardinalPoint',`co`.`cardinalPoint`,'number',`co`.`number`,'cp',`co`.`cp`,'phone1',`co`.`phone1`,'phone2',`co`.`phone2`,'email1',`co`.`email1`,'email2',`co`.`email2`,'web',`co`.`web`,'type',`co`.`type`,'active',`co`.`active`,'createdAt',`co`.`createdAt`) from `contacts` `co` where (`c`.`contactId` = `co`.`contactId`)) AS `contact`,(select json_object('checkId',`ch`.`checkId`,'type',`ch`.`type`,'active',`ch`.`active`,'updatedAt',`ch`.`updatedAt`,'createdAt',`ch`.`createdAt`) from `checks` `ch` where ((`ch`.`customerId` = `c`.`customerId`) and (`ch`.`type` = 'check_in') and (cast(`ch`.`createdAt` as date) = curdate())) order by `ch`.`createdAt` limit 1) AS `checkIn`,(select json_object('checkId',`ch`.`checkId`,'type',`ch`.`type`,'active',`ch`.`active`,'updatedAt',`ch`.`updatedAt`,'createdAt',`ch`.`createdAt`) from `checks` `ch` where ((`ch`.`customerId` = `c`.`customerId`) and (`ch`.`type` = 'check_out') and (cast(`ch`.`createdAt` as date) = curdate())) order by `ch`.`createdAt` limit 1) AS `checkOut`,(select json_object('checkId',`ch`.`checkId`,'type',`ch`.`type`,'active',`ch`.`active`,'updatedAt',`ch`.`updatedAt`,'createdAt',`ch`.`createdAt`) from `checks` `ch` where ((`ch`.`customerId` = `c`.`customerId`) and (`ch`.`type` = 'justiffy') and (cast(`ch`.`createdAt` as date) = curdate())) order by `ch`.`createdAt` limit 1) AS `justiffy`,coalesce((select json_arrayagg(json_object('checkId',`ch`.`checkId`,'type',`ch`.`type`,'active',`ch`.`active`,'updatedAt',`ch`.`updatedAt`,'createdAt',`ch`.`createdAt`)) from `checks` `ch` where (`ch`.`customerId` = `c`.`customerId`)),json_array()) AS `checks` from `customers` `c` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-31  8:12:27
