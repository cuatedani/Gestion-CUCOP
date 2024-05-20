-- Active: 1684788191065@@127.0.0.1@3306@ut3-sistema-control-horas
--
-- Base de datos: control_de_horas_cicese
--
-- IMPORT mysql.connector
-- conexion=mysql.connector.connet(user='root', password='password', host='localhost', database='ut3-sistema-control-horas', port='3306')
DROP database IF exists `ut3-sistema-control-horas`;
CREATE DATABASE  IF NOT EXISTS `ut3-sistema-control-horas`;
USE `ut3-sistema-control-horas`;

--
-- Estructura para la tabla contacts
--

DROP TABLE IF EXISTS `contacts`;

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
);

-- ----------------------------------------------------------------------

--
-- Estructura para la tabla customers
--

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `customerId` int NOT NULL AUTO_INCREMENT,
  `contactId` int NOT NULL,
  `rol` varchar(100) DEFAULT 'Estudiante',
  `institution` varchar(100),
  `targetHours` float DEFAULT 0,
  `adjustHours` float DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customerId`),
  KEY `idx_contactId` (`contactId`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`contactId`) REFERENCES `contacts` (`contactId`) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------

--
-- Estructura para la tabla checks
--

DROP TABLE IF EXISTS `checks`;

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
);

--
-- Estructura para la tabla users
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstNames` varchar(120) NOT NULL,
  `lastNames` varchar(120) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `rol` enum("admin", "normal") NOT NULL DEFAULT "normal",
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
);

--
-- Estructura de las vista de customers
--

drop view if exists customers_view;
create view customers_view as
select 
  c.*,
  ((
	  select
      sum((case when tmp.checkOut is null or tmp.checkIn is null then 0 else timestampdiff(MINUTE, tmp.checkIn, tmp.checkOut) end) / 60) timeElapsed
    from (
      select 
        (
          select createdAt from checks where date(createdAt) = selected_date and type='check_in' and customerId = cu.customerId order by createdAt asc limit 1
        ) checkIn,
        (
          select createdAt from checks where date(createdAt) = selected_date and type='check_out' and customerId = cu.customerId order by createdAt asc limit 1
        ) checkOut
      from 
      (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
      (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
      (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
      (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
      (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
      (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
      inner join customers cu
      inner join contacts co
      on cu.contactId = co.contactId
      where customerId = c.customerId and selected_date >= date(cu.createdAt) and selected_date <= now()
    ) tmp
  ) + c.adjustHours ) hoursElapsed,
  (
    select
      json_object(
        'contactId', co.contactId,
        'name', co.name,
        'country', co.country,
        'state', co.state,
        'municipality', co.municipality,
        'suburb', co.suburb,
        'street', co.street,
        'cardinalPoint', co.cardinalPoint,
        'number', co.number,
        'cp', co.cp,
        'phone1', co.phone1,
        'phone2', co.phone2,
        'email1', co.email1,
        'email2', co.email2,
        'web', co.web,
        'type', co.type,
        'active', co.active,
        'createdAt', co.createdAt
      )
    from contacts co
    where 
      c.contactId = co.contactId
  ) 'contact',
  (
	select
	  json_object(
		'checkId', ch.checkId,
		'type', ch.type,
		'active', ch.active,
		'updatedAt', ch.updatedAt,
		'createdAt', ch.createdAt
	  )
	from checks ch
	where 
	  ch.customerId = c.customerId and 
	  ch.type = 'check_in' and
	  date(ch.createdAt) = curdate()
	order by createdAt
	limit 1
  ) 'checkIn',
  (
	select
	  json_object(
		'checkId', ch.checkId,
		'type', ch.type,
		'active', ch.active,
		'updatedAt', ch.updatedAt,
		'createdAt', ch.createdAt
	  )
	from checks ch
	where 
	  ch.customerId = c.customerId and 
	  ch.type = 'check_out' and
	  date(ch.createdAt) = curdate()
	order by createdAt
	limit 1
  ) 'checkOut',
  (
	select
	  json_object(
		'checkId', ch.checkId,
		'type', ch.type,
		'active', ch.active,
		'updatedAt', ch.updatedAt,
		'createdAt', ch.createdAt
	  )
	from checks ch
	where 
	  ch.customerId = c.customerId and 
	  ch.type = 'justify' and
	  date(ch.createdAt) = curdate()
	order by createdAt
	limit 1
  ) 'justify',
  coalesce(
    (
      select
      json_arrayagg(
        json_object(
          'checkId', ch.checkId,
          'type', ch.type,
          'active', ch.active,
          'updatedAt', ch.updatedAt,
          'createdAt', ch.createdAt
        )
      )
      from checks ch
      where 
        ch.customerId = c.customerId
    ), json_array()
  ) 'checks'
from customers c;

--
-- Estructura de las vista de checks
--

drop view if exists checks_view;
create view checks_view as
select 
  ch.*,
  (
    select
      json_object(
        'customerId', c.customerId,
        'contactId', c.contactId,
        'rol', c.rol,
        'institution', c.institution,
        'targetHours', c.targetHours,
        'hoursElapsed', c.hoursElapsed,
        'active', c.active,
        'createdAt', c.createdAt,
        'contact', c.contact
      )
    from customers_view c
    where 
      ch.customerId = c.customerId
  ) 'customer'
from checks ch;

-- insert users
insert into users(firstNames, lastNames, email, password, rol, active)
values('Edgar', 'Pozas', 'pozas@cicese.mx', 'bc8db39f614342b78a67494dbece216d3726f6924b73563be34fc630ac1db7f5', 'admin', 1);