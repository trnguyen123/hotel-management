-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_management
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `room_id` int NOT NULL,
  `check_in_date` datetime NOT NULL,
  `check_out_date` datetime NOT NULL,
  `booking_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('booked','cancelled','checked_in','checked_out') DEFAULT 'booked',
  `total_price` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('paid','unpaid','pending','cancelled') DEFAULT 'unpaid',
  `cancellation_fee` decimal(10,2) DEFAULT '0.00',
  `cancellation_date` datetime DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `customer_id` (`customer_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,'2025-02-01 14:00:00','2025-02-03 12:00:00','2025-01-30 03:00:00','checked_out',5000000.00,'paid',0.00,NULL,'cash'),(2,2,2,'2025-02-05 14:00:00','2025-02-07 12:00:00','2025-02-04 02:30:00','checked_out',5000000.00,'paid',0.00,NULL,'cash'),(3,3,3,'2025-02-10 14:00:00','2025-02-12 12:00:00','2025-02-08 08:45:00','cancelled',5000000.00,'unpaid',200000.00,'2025-02-09 10:00:00','cash'),(4,4,4,'2025-02-15 14:00:00','2025-02-17 12:00:00','2025-02-13 04:20:00','checked_out',5000000.00,'paid',0.00,NULL,'cash'),(5,5,5,'2025-02-20 14:00:00','2025-02-22 12:00:00','2025-02-18 01:50:00','checked_out',5000000.00,'paid',0.00,NULL,'cash'),(6,1,1,'2025-03-05 00:00:00','2025-03-10 00:00:00','2025-03-02 07:21:29','cancelled',5000000.00,'pending',0.00,'2025-03-02 17:51:17','cash'),(7,1,1,'2025-03-05 00:00:00','2025-03-10 00:00:00','2025-03-02 07:28:46','checked_out',5000000.00,'paid',0.00,NULL,'cash'),(16,6,4,'2025-03-03 00:00:00','2025-03-04 00:00:00','2025-03-03 07:51:05','checked_out',1350000.00,'paid',0.00,NULL,'cash'),(17,6,9,'2025-03-06 00:00:00','2025-03-09 00:00:00','2025-03-04 05:34:04','cancelled',1500000.00,'pending',750000.00,'2025-03-05 08:24:54','cash'),(18,7,7,'2025-03-07 00:00:00','2025-03-09 00:00:00','2025-03-04 05:36:21','checked_out',1530000.00,'paid',0.00,NULL,'cash'),(19,7,15,'2025-03-06 00:00:00','2025-03-07 00:00:00','2025-03-04 05:39:21','checked_out',2300000.00,'paid',0.00,NULL,'cash'),(20,8,10,'2025-03-04 00:00:00','2025-03-05 00:00:00','2025-03-04 06:16:36','checked_out',1700000.00,'paid',0.00,NULL,'cash'),(21,6,6,'2025-03-05 00:00:00','2025-03-06 00:00:00','2025-03-04 06:18:27','checked_out',1800000.00,'paid',0.00,NULL,'cash'),(22,6,11,'2025-03-07 00:00:00','2025-03-09 00:00:00','2025-03-04 06:52:50','checked_out',2100000.00,'paid',0.00,NULL,'cash'),(23,6,5,'2025-03-07 00:00:00','2025-03-09 00:00:00','2025-03-04 07:06:51','checked_out',1200000.00,'paid',0.00,NULL,'cash'),(24,6,5,'2025-03-15 00:00:00','2025-03-17 00:00:00','2025-03-05 01:29:19','cancelled',1260000.00,'pending',0.00,'2025-03-05 08:29:30','cash'),(25,6,3,'2025-03-10 00:00:00','2025-03-11 00:00:00','2025-03-06 08:21:18','checked_out',1540000.00,'paid',0.00,NULL,'cash'),(26,6,8,'2025-03-10 00:00:00','2025-03-12 00:00:00','2025-03-07 02:26:27','checked_out',3900000.00,'paid',0.00,NULL,'cash'),(27,6,1,'2025-03-10 00:00:00','2025-03-11 00:00:00','2025-03-10 06:48:18','cancelled',1350000.00,'pending',0.00,NULL,'cash'),(28,6,6,'2025-03-10 00:00:00','2025-03-12 00:00:00','2025-03-10 06:53:10','checked_out',4005000.00,'paid',0.00,NULL,'cash'),(29,6,7,'2025-03-10 00:00:00','2025-03-12 00:00:00','2025-03-10 06:56:29','cancelled',3375000.00,'pending',1687500.00,'2025-03-10 16:53:02','cash'),(30,6,2,'2025-03-10 00:00:00','2025-03-12 00:00:00','2025-03-10 06:57:23','checked_out',3105000.00,'paid',0.00,NULL,'cash'),(31,6,4,'2025-03-12 00:00:00','2025-03-15 00:00:00','2025-03-10 10:03:49','cancelled',4185000.00,'pending',2092500.00,'2025-03-12 22:52:47','cash'),(32,6,1,'2025-03-13 00:00:00','2025-03-15 00:00:00','2025-03-10 12:59:26','cancelled',2550000.00,'pending',1275000.00,'2025-03-12 15:02:19','cash'),(33,6,6,'2025-03-14 00:00:00','2025-03-15 00:00:00','2025-03-11 12:57:38','cancelled',1935000.00,'pending',967500.00,'2025-03-12 15:02:30','cash'),(34,6,7,'2025-03-13 00:00:00','2025-03-17 00:00:00','2025-03-11 13:01:25','cancelled',6800000.00,'pending',3400000.00,'2025-03-17 15:56:47','cash'),(35,6,11,'2025-03-12 00:00:00','2025-03-16 00:00:00','2025-03-11 17:24:21','cancelled',7605000.00,'pending',3802500.00,'2025-03-12 14:58:11','vnpay'),(36,6,2,'2025-03-14 00:00:00','2025-03-16 00:00:00','2025-03-12 08:01:13','cancelled',2475000.00,'pending',1237500.00,'2025-03-12 15:02:26','cash'),(37,6,10,'2025-03-14 00:00:00','2025-03-16 00:00:00','2025-03-12 08:01:56','cancelled',3375000.00,'pending',1687500.00,'2025-03-12 15:02:15','vnpay'),(38,6,1,'2025-03-14 00:00:00','2025-03-16 00:00:00','2025-03-12 08:03:04','cancelled',2587500.00,'pending',1293750.00,'2025-03-12 22:52:41','vnpay'),(40,9,2,'2025-03-20 00:00:00','2025-03-25 00:00:00','2025-03-12 14:55:38','cancelled',1500000.00,'pending',750000.00,'2025-03-12 22:52:45','vnpay'),(41,9,2,'2025-03-20 00:00:00','2025-03-25 00:00:00','2025-03-12 14:56:52','cancelled',1500000.00,'pending',750000.00,'2025-03-12 22:52:06','vnpay'),(42,7,3,'2025-03-20 00:00:00','2025-03-25 00:00:00','2025-03-12 15:19:01','cancelled',100.00,'pending',0.00,'2025-03-12 22:52:44','paypal'),(43,7,2,'2025-03-20 00:00:00','2025-03-25 00:00:00','2025-03-12 15:21:38','cancelled',100.00,'pending',0.00,'2025-03-12 22:52:43','paypal'),(44,7,5,'2025-03-20 00:00:00','2025-03-25 00:00:00','2025-03-12 15:24:09','cancelled',100.00,'pending',0.00,'2025-03-12 22:52:48','paypal'),(45,7,6,'2025-03-20 00:00:00','2025-03-25 00:00:00','2025-03-12 15:49:31','cancelled',100.00,'pending',0.00,'2025-03-17 15:58:30','paypal'),(46,8,1,'2025-03-15 00:00:00','2025-03-18 00:00:00','2025-03-14 02:48:33','checked_out',3330000.00,'paid',0.00,NULL,'cash'),(47,8,2,'2025-03-17 00:00:00','2025-03-19 00:00:00','2025-03-14 02:49:12','cancelled',2358000.00,'pending',0.00,'2025-03-14 09:49:55','cash'),(48,6,1,'2025-03-18 00:00:00','2025-03-19 00:00:00','2025-03-17 08:58:53','checked_out',1125000.00,'paid',0.00,NULL,'cash'),(49,8,2,'2025-03-18 00:00:00','2025-03-21 00:00:00','2025-03-17 09:28:39','checked_out',3438000.00,'paid',0.00,NULL,'cash'),(50,8,3,'2025-03-19 00:00:00','2025-03-21 00:00:00','2025-03-18 09:41:59','cancelled',2475000.00,'pending',1237500.00,'2025-03-18 16:43:52','cash'),(51,8,3,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 09:44:29','checked_out',2385000.00,'paid',0.00,NULL,'cash'),(52,8,4,'2025-03-19 00:00:00','2025-03-22 00:00:00','2025-03-18 09:56:11','checked_out',172.77,'paid',0.00,NULL,'paypal'),(53,8,6,'2025-03-20 00:00:00','2025-03-23 00:00:00','2025-03-18 09:57:49','checked_out',208.14,'paid',0.00,NULL,'paypal'),(54,8,11,'2025-03-20 00:00:00','2025-03-23 00:00:00','2025-03-18 10:09:04','cancelled',250.26,'pending',125.13,'2025-03-18 17:17:49','paypal'),(55,8,12,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:12:53','cancelled',149.18,'pending',74.59,'2025-03-18 17:17:46','paypal'),(56,8,11,'2025-03-20 00:00:00','2025-03-23 00:00:00','2025-03-18 10:18:45','cancelled',227.45,'pending',113.73,'2025-03-18 17:23:50','paypal'),(57,8,12,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:20:11','cancelled',151.63,'pending',75.82,'2025-03-18 17:23:47','paypal'),(58,8,15,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:24:17','cancelled',156.90,'pending',78.45,'2025-03-18 17:25:44','paypal'),(59,8,11,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:26:03','cancelled',117.94,'pending',58.97,'2025-03-18 17:35:09','paypal'),(60,8,12,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:28:22','cancelled',166.14,'pending',83.07,'2025-03-18 17:35:12','paypal'),(61,8,13,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:30:03','cancelled',149.18,'pending',74.59,'2025-03-18 17:35:14','paypal'),(62,8,11,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:35:43','cancelled',165.75,'pending',82.88,'2025-03-18 17:36:19','paypal'),(63,8,11,'2025-03-20 00:00:00','2025-03-21 00:00:00','2025-03-18 10:45:08','cancelled',75.82,'pending',37.91,'2025-03-18 17:49:40','paypal'),(64,8,11,'2025-03-20 00:00:00','2025-03-22 00:00:00','2025-03-18 10:49:57','cancelled',149.88,'pending',74.94,'2025-03-18 17:50:47','paypal'),(65,8,5,'2025-03-19 00:00:00','2025-03-22 00:00:00','2025-03-18 10:51:14','cancelled',130.57,'pending',65.29,'2025-03-18 17:52:41','paypal'),(66,8,5,'2025-03-19 00:00:00','2025-03-20 00:00:00','2025-03-18 10:53:05','cancelled',44.58,'pending',22.29,'2025-03-18 17:55:38','paypal'),(67,8,5,'2025-03-19 00:00:00','2025-03-20 00:00:00','2025-03-18 10:55:56','cancelled',39.00,'pending',19.50,'2025-03-20 11:46:26','paypal'),(68,8,1,'2025-03-20 00:00:00','2025-03-23 00:00:00','2025-03-20 04:51:32','checked_out',3820000.00,'paid',0.00,NULL,'cash'),(69,8,1,'2025-03-21 00:00:00','2025-03-24 00:00:00','2025-03-20 04:52:59','checked_out',3348000.00,'paid',0.00,NULL,'cash'),(70,8,2,'2025-03-26 00:00:00','2025-03-29 00:00:00','2025-03-20 04:53:52','checked_out',3720000.00,'paid',0.00,NULL,'cash'),(71,8,1,'2025-03-24 00:00:00','2025-03-27 00:00:00','2025-03-22 07:37:06','checked_out',130.57,'paid',0.00,NULL,'paypal'),(72,8,1,'2025-03-31 00:00:00','2025-04-01 00:00:00','2025-03-29 17:05:11','cancelled',46.33,'paid',23.17,'2025-04-01 15:47:34','paypal'),(73,8,2,'2025-03-31 00:00:00','2025-04-01 00:00:00','2025-03-29 17:17:22','cancelled',43.88,'paid',21.94,'2025-03-30 00:17:48','paypal'),(74,8,2,'2025-03-31 00:00:00','2025-04-01 00:00:00','2025-03-29 17:21:43','cancelled',56.16,'paid',28.08,'2025-03-30 00:21:57','paypal'),(75,10,3,'2025-03-31 00:00:00','2025-04-01 00:00:00','2025-03-29 17:22:40','cancelled',47.38,'paid',23.69,'2025-04-01 15:47:41','paypal'),(76,11,2,'2025-03-31 00:00:00','2025-04-01 00:00:00','2025-03-29 17:25:53','cancelled',47.38,'pending',23.69,'2025-03-30 00:28:41','paypal'),(77,11,11,'2025-03-31 00:00:00','2025-04-01 00:00:00','2025-03-29 17:30:06','cancelled',75.47,'cancelled',0.00,NULL,'paypal'),(78,8,1,'2025-04-02 00:00:00','2025-04-04 00:00:00','2025-04-01 08:49:00','checked_out',2205000.00,'pending',0.00,NULL,'cash'),(79,8,1,'2025-04-01 00:00:00','2025-04-02 00:00:00','2025-04-01 08:51:55','cancelled',1143000.00,'pending',571500.00,'2025-04-01 15:52:04','cash'),(80,8,5,'2025-04-04 00:00:00','2025-04-07 00:00:00','2025-04-01 08:52:34','cancelled',3348000.00,'pending',0.00,'2025-04-01 15:55:50','cash'),(81,11,4,'2025-04-04 00:00:00','2025-04-07 00:00:00','2025-04-01 08:53:33','cancelled',130.57,'paid',0.00,'2025-04-01 15:55:52','paypal'),(82,8,5,'2025-04-04 00:00:00','2025-04-07 00:00:00','2025-04-01 08:57:11','checked_out',3348000.00,'pending',0.00,NULL,'cash'),(83,8,1,'2025-04-04 00:00:00','2025-04-05 00:00:00','2025-04-01 09:12:46','booked',1125000.00,'pending',0.00,NULL,'cash');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `id_card` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Nguyễn Văn A','male','Hà Nội','0987654321','123456789','a@gmail.com','1997-03-01'),(2,'Trần Thị B','female','Hồ Chí Minh','0978654321','987654321','b@gmail.com','1995-08-21'),(3,'Lê Văn C','female','Đà Nẵng','0967543210','456789123','c@gmail.com','1999-12-20'),(4,'Phạm Thị D','female','Hải Phòng','0956432109','654321987','d@gmail.com','2000-09-16'),(5,'Hoàng Văn E','female','Cần Thơ','0945321098','789123456','e@gmail.com','2002-06-06'),(6,'Trung Nguyên','male','54 ,HHT,p.12,q.TB','0342896259','123','trungnguyensd12@gmail.com','2004-07-10'),(7,'TMQ','male','54 ,HHT,p.12,q.TB','0123456789','123','hochiminh145632@gmail.com','2004-01-01'),(8,'Trung Nguyên','male','54 ,HHT,p.12,q.TB','123456789','123','trungnguyensd12@gmail.com','2004-07-10'),(9,'Nguyễn Văn B','male','123 Đường ABC, Quận 1, TP.HCM','0909123456','123456789','trungnguyensd12@gmail.com','2005-06-01'),(10,'Nguyễn Thị B','female','54 ,HHT,p.12,q.TB','123456789','123','trungnguyensd12@gmail.com',NULL),(11,'Nguyễn Hoàng Trung Nguyên','male','54 ,HHT,p.12,q.TB','123456789','123','trungnguyensd12@gmail.com',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('receptionist','service staff','manager') DEFAULT 'receptionist',
  `phone_number` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (2,'Nguyễn Văn Hải','hai@gmail.com','$2b$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','service staff','0972222222','2025-02-19 21:30:29'),(3,'Trần Minh Đức','duc@gmail.com','$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','manager','0123456789','2025-02-19 21:30:29'),(4,'Phạm Thị Linh','linh@gmail.com','$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','receptionist','0954444444','2025-02-19 21:30:29'),(9,'Nguyễn Hoàng Trung Nguyên','nguyen@gmail.com','$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','manager','0123456789','2025-03-13 06:33:44'),(12,'Thầy Quí','qui@gmail.com','$2b$10$IWZN8JJ6KvmLHtZ/jJiOSeJzHeg7y1WtMzbL30M1O5P8ZNop6sJ62','manager','.0123456789','2025-04-01 08:59:14');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `email_subject` varchar(255) NOT NULL,
  `email_content` varchar(255) NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'Xác nhận đặt phòng','Bạn đã đặt phòng thành công. Hãy kiểm tra lại thông tin đặt phòng trước ngày check-in. Chúng tôi mong được phục vụ bạn!','2024-02-01 03:30:00'),(2,2,'Xác nhận đặt phòng','Bạn đã đặt phòng thành công. Hãy kiểm tra lại thông tin đặt phòng trước ngày check-in. Chúng tôi mong được phục vụ bạn!','2024-02-05 05:00:00'),(3,3,'Xác nhận đặt phòng','Bạn đã đặt phòng thành công. Hãy kiểm tra lại thông tin đặt phòng trước ngày check-in. Chúng tôi mong được phục vụ bạn!','2024-02-09 02:00:00'),(4,4,'Xác nhận đặt phòng','Bạn đã đặt phòng thành công. Hãy kiểm tra lại thông tin đặt phòng trước ngày check-in. Chúng tôi mong được phục vụ bạn!','2024-02-15 07:30:00'),(5,5,'Xác nhận đặt phòng','BBạn đã đặt phòng thành công. Hãy kiểm tra lại thông tin đặt phòng trước ngày check-in. Chúng tôi mong được phục vụ bạn!','2024-02-22 01:00:00');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('paypal','vnpay') DEFAULT 'paypal',
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('completed','failed','pending') DEFAULT 'pending',
  PRIMARY KEY (`payment_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1000000.00,'paypal','2024-02-01 08:00:00','completed'),(2,2,1600000.00,'vnpay','2024-02-05 09:00:00','pending'),(3,3,0.00,'paypal',NULL,'failed'),(4,4,1100000.00,'vnpay','2024-02-15 11:00:00','completed'),(5,5,1800000.00,'paypal',NULL,'pending');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `report_content` varchar(255) NOT NULL,
  `room_id` int NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `fk_room` (`room_id`),
  CONSTRAINT `fk_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (6,'2025-02-24 11:10:32','Cửa sổ bị hỏng.',2),(7,'2025-02-24 11:24:05','Điều hòa không hoạt động.',1),(8,'2025-02-24 11:34:41','NVS phòng hơi dơ',1),(9,'2025-04-01 08:58:06','Phòng hư nhà vệ sinh',10);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_number` varchar(10) NOT NULL,
  `room_type` enum('standard','family','queen') NOT NULL,
  `status` enum('available','booked','occupied','maintenance') DEFAULT 'available',
  `price` decimal(10,2) NOT NULL,
  `area` float DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_number` (`room_number`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'101','standard','booked',1200000.00,30),(2,'102','standard','available',1200000.00,30),(3,'103','standard','available',1200000.00,30),(4,'104','standard','available',1200000.00,30),(5,'105','standard','available',1200000.00,30),(6,'201','family','available',1700000.00,35),(7,'202','family','available',1700000.00,36),(8,'203','family','available',1700000.00,38),(9,'204','family','available',1700000.00,34),(10,'205','family','available',1700000.00,37),(11,'301','queen','available',2100000.00,40),(12,'302','queen','available',2100000.00,42),(13,'303','queen','available',2100000.00,44),(14,'304','queen','available',2100000.00,39),(15,'305','queen','available',2100000.00,41);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Giặt ủi',50000.00,'lần','active'),(2,'Ăn sáng',50000.00,'suất','active'),(3,'Dọn phòng',150000.00,'lần','active'),(4,'Thuê xe',100000.00,'ngày','active'),(5,'Massage',400000.00,'giờ','active'),(6,'Bóng bàn',70000.00,'giờ','active'),(9,'Picklebal',70000.00,'giờ','active');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `used_services`
--

DROP TABLE IF EXISTS `used_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `used_services` (
  `used_service_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `service_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`used_service_id`),
  KEY `booking_id` (`booking_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `used_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `used_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `used_services`
--

LOCK TABLES `used_services` WRITE;
/*!40000 ALTER TABLE `used_services` DISABLE KEYS */;
INSERT INTO `used_services` VALUES (1,1,1,2),(2,2,2,3),(3,3,3,1),(4,4,4,1),(5,5,5,2),(6,1,2,2),(7,51,3,1),(8,51,4,1),(9,52,6,1),(10,52,1,1),(11,52,2,1),(12,52,3,1),(13,52,4,1),(14,52,5,1),(15,53,1,1),(16,53,2,1),(17,53,3,1),(18,53,4,1),(19,53,5,1),(20,53,6,1),(21,54,1,1),(22,54,2,1),(23,54,3,1),(24,54,4,1),(25,54,5,1),(26,54,6,1),(27,55,1,1),(28,56,1,1),(29,56,2,1),(30,56,6,1),(31,57,1,1),(32,57,2,1),(33,58,1,1),(34,58,2,1),(35,58,3,1),(36,59,1,1),(37,59,2,1),(38,60,6,1),(39,61,1,1),(40,62,1,1),(41,63,6,1),(42,64,2,1),(43,65,1,1),(44,65,2,1),(45,66,2,1),(46,67,1,1),(47,68,3,1),(48,68,2,1),(49,69,1,1),(50,69,2,1),(51,70,1,1),(52,70,2,1),(53,30,3,1),(54,71,1,1),(55,71,2,1),(56,72,1,1),(57,72,2,1),(58,73,1,1),(59,74,5,1),(60,75,3,1),(61,76,3,1),(62,77,1,1),(63,78,1,1),(64,79,2,1),(65,80,1,1),(66,80,2,1),(67,81,1,1),(68,81,2,1),(69,82,1,1),(70,82,2,1),(71,83,1,1);
/*!40000 ALTER TABLE `used_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `voucher_code` varchar(20) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `expiration_date` date NOT NULL,
  `minimum_order_value` decimal(10,2) DEFAULT '0.00',
  `start_date` date DEFAULT NULL,
  PRIMARY KEY (`voucher_code`),
  UNIQUE KEY `voucher_code` (`voucher_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES ('DISCOUNT10',10.00,'2025-12-31',100000.00,'2025-01-01'),('FESTIVE30',30.00,'2025-12-24',300000.00,'2024-12-30'),('HOLIDAY25',25.00,'2025-11-29',250000.00,'2024-12-30'),('SUMMER15',15.00,'2025-06-29',150000.00,'2024-12-30'),('VIP20',20.00,'2025-06-29',200000.00,'2024-11-30');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'hotel_management'
--

--
-- Dumping routines for database 'hotel_management'
--
/*!50003 DROP PROCEDURE IF EXISTS `cancel_booking` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cancel_booking`(
    IN `p_booking_id` INT,         -- ID của đặt phòng cần hủy
    IN `p_cancel_date` DATETIME    -- Thời điểm hủy
)
BEGIN
    DECLARE v_check_in_date DATETIME;
    DECLARE v_total_price DECIMAL(10, 2);
    DECLARE v_hours_difference INT;
    DECLARE v_cancellation_fee DECIMAL(10, 2);

    -- Lấy thông tin thời gian nhận phòng và giá phòng từ booking
    SELECT check_in_date, total_price
    INTO v_check_in_date, v_total_price
    FROM bookings
    WHERE booking_id = p_booking_id;

    -- Kiểm tra nếu booking không tồn tại
    IF v_check_in_date IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Booking ID not found.';
    END IF;

    -- Tính số giờ giữa thời gian hiện tại (hủy) và thời gian nhận phòng
    SET v_hours_difference = TIMESTAMPDIFF(HOUR, p_cancel_date, v_check_in_date);

    -- Tính phí hủy
    IF v_hours_difference >= 48 THEN
        SET v_cancellation_fee = 0; -- Không tính phí
    ELSE
        SET v_cancellation_fee = v_total_price * 0.5; -- Tính 50% giá phòng
    END IF;

    -- Cập nhật trạng thái đặt phòng và phí hủy
    UPDATE bookings
    SET 
        status = 'cancelled', 
        cancellation_fee = v_cancellation_fee, 
        cancellation_date = p_cancel_date
    WHERE booking_id = p_booking_id;

    -- Thông báo phí hủy qua console (nếu cần)
    SELECT CONCAT('Booking ID: ', p_booking_id, ' cancelled. Cancellation fee: ', v_cancellation_fee) AS cancellation_message;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-01 17:05:03
