-- 創建資料庫
CREATE DATABASE `yokult`;

USE `yokult`;

-- 員工資料
DROP TABLE IF EXISTS `staff`;

CREATE TABLE `staff` (
  `staff_id` varchar(50) NOT NULL COMMENT '員工編號',
  `staff_name` varchar(50) NOT NULL COMMENT '員工姓名',
  `staff_email` varchar(320) NOT NULL COMMENT '員工信箱',
  `staff_idnumber` varchar(50) NOT NULL COMMENT '員工身分證字號',
  `staff_birthday` datetime NOT NULL COMMENT '員工生日',
  `staff_phone` varchar(20) NOT NULL COMMENT '手機號碼',
  `staff_picture` longblob COMMENT '照片',
  `annual_leave` varchar(50)COMMENT '特休',
  `personal_leave` varchar(50)COMMENT '事假',
  `official_leave` varchar(50)COMMENT '基本假',
  PRIMARY KEY (`staff_id`))
  comment = '員工';

INSERT INTO 
  `staff` (`staff_id`, `staff_name`, `staff_email`, `staff_idnumber`, `staff_birthday`, `staff_phone`, `staff_picture`, `annual_leave`, `personal_leave`, `official_leave`)
VALUES
  ('tga001', '陳花花', 'flower@gmail.com', 'a223456789', '1999-01-01','0987654399','','7','5','8'),
  ('tga002', '黃泡泡', 'pop@gmail.com', 'a223456788', '1999-01-02','0987654388','','3','3','8'),
  ('tga003', '林毛毛', 'green@gmail.com', 'a223456787', '1999-01-03','0987654377','','4','9','8')
  
  
