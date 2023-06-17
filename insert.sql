-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.21-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for school_website
CREATE DATABASE IF NOT EXISTS `school_website` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `school_website`;

-- Dumping structure for table school_website.blogs
CREATE TABLE IF NOT EXISTS `blogs` (
  `title` varchar(50) DEFAULT NULL,
  `about` varchar(50) DEFAULT NULL,
  `bigtext` longtext DEFAULT NULL,
  `id` varchar(50) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `month` varchar(50) DEFAULT NULL,
  `day` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table school_website.blogs: ~6 rows (approximately)
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` (`title`, `about`, `bigtext`, `id`, `picture`, `month`, `day`) VALUES
	('امتحانات دی ماه', 'برگزاری امتحانات دی ماه', '<p><img src="/assets/img/blog-1.jpg" style="width: 100%;"><br><br><h1 style="text-align: center; ">امتحانات دی ماه<br></h1></p>', 'امتحانات-دی-ماه', '/assets/img/blog-1.jpg', 'دی', '10'),
	('ورودی مدرسه', 'غیر قابل بخشش', '<p><img src="/assets/img/20230219_124800.jpg" style="width: 100%;"><br></p><h1 style="text-align: center;">ورودی مدرسه</h1><p>ورودی مدرسه یکی از مهمترین قسمت های مدرسه هست که ما توانستیم بهترین طراحی را انجام بدیم<br><br><img src="/assets/img/20230219_124038.jpg" style="width: 50%;">&nbsp; همان تور که میبینید ورودی مدرسه با گل طراحی زیبایی را دارد</p>', 'ورودی-مدرسه', '/assets/img/20230219_124800.jpg', 'بهمن', '15'),
	('پینتبال', 'برگزاری اردوی پینتبال', '<p><img src="/assets/img/2testimonial.jpg" style="width: 100%;"><br><span style="font-family: Montserrat, sans-serif;"></span><br><h1 style="text-align: center;"><span style="font-family: Montserrat, sans-serif;">برگزاری اردوی پینتبال</span></h1></p>', 'اردو-پینتبال', '/assets/img/2testimonial.jpg', 'اسفند', '12'),
	('کلاس غیرحضوری', 'برگزاری کلاس غیرحضوری', '<h1><img src="/assets/img/blog-2.jpg" style="width: 100%;"><br><div style="text-align: center;"><span style="font-size: 2.5rem; font-family: Montserrat, sans-serif;">کلاس غیرحضوری</span></div></h1>', 'کلاس-غیرحضوری', '/assets/img/blog-2.jpg', 'اسفند', '12'),
	('ورود دانش اموزان به مدرسه', 'شروع مدارس و دانش اموزان در ورود به مدرسه', '<p><img src="/assets/img/carousel-1.jpg" style="width: 100%;"><br><br></p><h1 style="text-align: center;"></h1><h1 style="text-align: center; ">ورود دانش اموزان به مدرسه</h1><div style="text-align: center;"><br></div><h4 style="text-align: right;"></h4><p></p><h4><span style="font-weight: normal;">دانش اموزان ورود به مدرسه کردن و بعد به سر کلاس رفتن و تمامی معلم هارا شناختن با هم اشتنا شدن و رفیق شدند .&nbsp;دانش اموزان ورود به مدرسه کردن و بعد به سر کلاس رفتن و تمامی معلم هارا شناختن با هم اشتنا شدن و رفیق شدند . دانش اموزان ورود به مدرسه کردن و بعد به سر کلاس رفتن و تمامی معلم هارا شناختن با هم اشتنا شدن و رفیق شدند . دانش اموزان ورود به مدرسه کردن و بعد به سر کلاس رفتن و تمامی معلم هارا شناختن با هم اشتنا شدن و رفیق شدند .&nbsp;</span><span style="font-weight: normal;"><br></span></h4>', 'ورود-دانش-اموزان-به-مدرسه', '/assets/img/carousel-1.jpg', 'مهر', '1'),
	('اهدای جوایز به دانش اموزان', 'اهدای جوایز به دانش اموزان برتر در مدرسه و شادی دا', '<p><img src="http://localhost:3000/assets/img/uploads/4901816232/1678376300022-1(2332.jpg" style="width: 100%;"><br></p><h1 style="text-align: center; ">اهدای جوایز به دانش اموزان</h1><br><br>اهدای جوایز به دانش اموزان برتر در مدرسه دانش اموزان خیلی شاد شدند چند عکس برای اثبات تماشا کنید<br><br><h5><img src="http://localhost:3000/assets/img/uploads/4901816232/1678376311456-4(2332.jpg" style="width: 50%;">&nbsp;فردی که به دوربین نگاه میکند نامش کیان ربیعی است<br></h5><p></p>', 'اهدای-جوایز-به-دانش-اموزان', 'http://localhost:3000/assets/img/uploads/4901816232/1678376300022-1(2332.jpg', 'اسفند', '15');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;

-- Dumping structure for table school_website.homeworks
CREATE TABLE IF NOT EXISTS `homeworks` (
  `id` varchar(50) DEFAULT NULL,
  `class` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table school_website.homeworks: ~4 rows (approximately)
/*!40000 ALTER TABLE `homeworks` DISABLE KEYS */;
INSERT INTO `homeworks` (`id`, `class`, `type`, `description`) VALUES
	('homework_SP!@S', '9.1', 'فارسی', 'یک متن درباره معلم خود بنویسید'),
	('homework_X2jt4', '9.2', 'ریاضی', 'یک بار از صفحه سی و سه بنویسید'),
	('homework_Qoyh8', '7.2', 'ریاضی', 'شش سوال نوشته نشده بنویسید و برای خود حل کنید'),
	('homework_n7GZ1', '9.1', 'ریاضی', 'شش بار از صفحه پنجاه و پنج بنویسید و هفته اینده می');
/*!40000 ALTER TABLE `homeworks` ENABLE KEYS */;

-- Dumping structure for table school_website.users
CREATE TABLE IF NOT EXISTS `users` (
  `nationalID` varchar(50) DEFAULT NULL,
  `nationalSerial` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `group` varchar(50) DEFAULT 'student',
  `class` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `remember_token` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table school_website.users: ~3 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`nationalID`, `nationalSerial`, `username`, `group`, `class`, `type`, `remember_token`) VALUES
	('4901816232', '530296', 'کیان ربیعی', 'manager', '', '', 'Samen_AGUowupsEJfa7AS'),
	('4392302332', '242432', 'ابوالفضل بابایی', 'teacher', '', 'ریاضی', 'Samen_jlHrCCH7TRsvfMn'),
	('4942303229', '244242', 'محمد درخشان', 'student', '9.2', '', 'Samen_wjrsG8LD8cqPN46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
