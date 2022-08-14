-- 創建資料庫
CREATE DATABASE `yokult`;

USE `yokult`;

-- 員工資料
DROP TABLE IF EXISTS `shift_schedule`;

CREATE TABLE `shift_schedule` (
`schedule_date` DATE NOT NULL COMMENT '日期',
  `staff_id` varchar(50) NOT NULL COMMENT '員工編號',
  `shiftschedule_type_of_leave` varchar(50) NOT NULL COMMENT '假別',
  `shiftschedule_morningshift_nightshift` varchar(50) NOT NULL COMMENT '早班晚班',
  FOREIGN KEY (`schedule_date`)
  REFERENCES `schedule` (`schedule_date`),
  FOREIGN KEY (`staff_id`)
  REFERENCES `staff` (`staff_id`))
  comment = '排班';
