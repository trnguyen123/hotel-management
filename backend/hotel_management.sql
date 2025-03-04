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
  `payment_status` enum('paid','unpaid','pending') DEFAULT 'unpaid',
  `cancellation_fee` decimal(10,2) DEFAULT '0.00',
  `cancellation_date` datetime DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `customer_id` (`customer_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,'2024-02-01 14:00:00','2024-02-03 12:00:00','2024-01-30 03:00:00','checked_out',NULL,'paid',0.00,NULL),(2,2,2,'2024-02-05 14:00:00','2024-02-07 12:00:00','2024-02-04 02:30:00','checked_out',NULL,'unpaid',0.00,NULL),(3,3,3,'2024-02-10 14:00:00','2024-02-12 12:00:00','2024-02-08 08:45:00','cancelled',NULL,'unpaid',200000.00,'2024-02-09 10:00:00'),(4,4,4,'2024-02-15 14:00:00','2024-02-17 12:00:00','2024-02-13 04:20:00','checked_out',NULL,'paid',0.00,NULL),(5,5,5,'2024-02-20 14:00:00','2024-02-22 12:00:00','2024-02-18 01:50:00','checked_out',NULL,'pending',0.00,NULL),(6,1,1,'2025-03-05 00:00:00','2025-03-10 00:00:00','2025-03-02 07:21:29','cancelled',5000000.00,'pending',0.00,'2025-03-02 17:51:17'),(7,1,1,'2025-03-05 00:00:00','2025-03-10 00:00:00','2025-03-02 07:28:46','booked',5000000.00,'pending',0.00,NULL),(16,6,4,'2025-03-03 00:00:00','2025-03-04 00:00:00','2025-03-03 07:51:05','booked',1350000.00,'pending',0.00,NULL),(17,6,9,'2025-03-06 00:00:00','2025-03-09 00:00:00','2025-03-04 05:34:04','checked_in',1500000.00,'pending',0.00,NULL),(18,7,7,'2025-03-07 00:00:00','2025-03-09 00:00:00','2025-03-04 05:36:21','booked',1530000.00,'pending',0.00,NULL),(19,7,15,'2025-03-06 00:00:00','2025-03-07 00:00:00','2025-03-04 05:39:21','booked',2300000.00,'pending',0.00,NULL);
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
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Nguyễn Văn A','male','Hà Nội','0987654321','123456789','a@gmail.com'),(2,'Trần Thị B','female','Hồ Chí Minh','0978654321','987654321','b@gmail.com'),(3,'Lê Văn C','male','Đà Nẵng','0967543210','456789123','c@gmail.com'),(4,'Phạm Thị D','female','Hải Phòng','0956432109','654321987','d@gmail.com'),(5,'Hoàng Văn E','male','Cần Thơ','0945321098','789123456','e@gmail.com'),(6,'Trung Nguyên','male','54 ,HHT,p.12,q.TB','0342896259','123','trungnguyensd12@gmail.com'),(7,'TMQ','male','54 ,HHT,p.12,q.TB','0123456789','123','hochiminh145632@gmail.com');
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
  `position` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('receptionist','service staff','manager') DEFAULT 'receptionist',
  `phone_number` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Lê Thị Nhung',NULL,'nhung@gmail.com','$2b$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','receptionist','0981111111','2025-02-19 21:30:29'),(2,'Nguyễn Văn Hải',NULL,'hai@gmail.com','$2b$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','service staff','0972222222','2025-02-19 21:30:29'),(3,'Trần Minh Đức',NULL,'duc@gmail.com','$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','manager','0963333333','2025-02-19 21:30:29'),(4,'Phạm Thị Linh',NULL,'linh@gmail.com','$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','receptionist','0954444444','2025-02-19 21:30:29'),(5,'Đỗ Văn Tùng',NULL,'tung@gmail.com','$2b$10$4jRAjhZ6wrrhmL4/fAVK4.H9dXzycHqZGDl/wfpndWWV6FbZoPtX.','service staff','0945555555','2025-02-19 21:30:29');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (6,'2025-02-24 11:10:32','Cửa sổ bị hỏng.',2),(7,'2025-02-24 11:24:05','Điều hòa không hoạt động.',1),(8,'2025-02-24 11:34:41','NVS phòng hơi dơ',1);
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
  `max_occupancy` int NOT NULL,
  `area` float DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_number` (`room_number`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'101','standard','booked',1200000.00,2,30),(2,'102','standard','available',1200000.00,2,30),(3,'103','standard','available',1200000.00,2,30),(4,'104','standard','booked',1200000.00,2,30),(5,'105','standard','available',1200000.00,2,30),(6,'201','family','available',1700000.00,3,35),(7,'202','family','booked',1700000.00,3,36),(8,'203','family','available',1700000.00,3,38),(9,'204','family','booked',1700000.00,3,34),(10,'205','family','available',1700000.00,3,37),(11,'301','queen','available',2100000.00,2,40),(12,'302','queen','available',2100000.00,2,42),(13,'303','queen','available',2100000.00,2,44),(14,'304','queen','available',2100000.00,2,39),(15,'305','queen','booked',2100000.00,2,41);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Giặt ủi',50000.00,'lần','active'),(2,'Ăn sáng',100000.00,'suất','active'),(3,'Dọn phòng',200000.00,'lần','active'),(4,'Thuê xe',300000.00,'ngày','active'),(5,'Massage',400000.00,'giờ','active');
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
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`used_service_id`),
  KEY `booking_id` (`booking_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `used_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `used_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `used_services`
--

LOCK TABLES `used_services` WRITE;
/*!40000 ALTER TABLE `used_services` DISABLE KEYS */;
INSERT INTO `used_services` VALUES (1,1,1,2,100000.00),(2,2,2,3,300000.00),(3,3,3,1,200000.00),(4,4,4,1,300000.00),(5,5,5,2,800000.00),(6,1,2,2,200000.00);
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
  `expiry_date` date NOT NULL,
  `minimum_order_value` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`voucher_code`),
  UNIQUE KEY `voucher_code` (`voucher_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES ('DISCOUNT10',10.00,'2025-12-31',100000.00),('FESTIVE30',30.00,'2025-12-25',100000.00),('HOLIDAY25',25.00,'2025-11-30',100000.00),('SUMMER15',15.00,'2025-06-30',100000.00),('VIP20',20.00,'2025-09-30',100000.00);
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

-- Dump completed on 2025-03-04 12:50:42
