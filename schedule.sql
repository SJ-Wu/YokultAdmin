-- 創建資料庫
CREATE DATABASE `yokult`;

USE `yokult`;

-- 排班資料
DROP TABLE IF EXISTS `schedule`;

CREATE TABLE `schedule` (
  `schedule_date` DATE NOT NULL COMMENT '日期',
  `morning_shift` VARCHAR(20) NOT NULL COMMENT '早班員工',
  `night_shift` VARCHAR(20) NOT NULL COMMENT '晚班員工',
  `day_off` VARCHAR(20) NOT NULL COMMENT '休假員工',
  PRIMARY KEY (`schedule_date`))

COMMENT = '班表';

INSERT INTO 
  schedule (schedule_date, morning_shift, night_shift, day_off)
VALUES
  ('2022-08-01', 'tga001', 'tga002', 'tga003'),
  ('2022-08-02', 'tga002', 'tga003', 'tga001'),
  ('2022-08-03', 'tga003', 'tga001', 'tga002'),
  ('2022-08-04', 'tga001', 'tga002', 'tga003'),
  ('2022-08-05', 'tga002', 'tga003', 'tga001'),
  ('2022-08-06', 'tga003', 'tga001', 'tga002'),
  ('2022-08-07', 'tga001', 'tga002', 'tga003'),
  ('2022-08-08', 'tga001', 'tga002', 'tga003'),
  ('2022-08-09', 'tga002', 'tga003', 'tga001'),
  ('2022-08-10', 'tga003', 'tga001', 'tga002'),
  ('2022-08-11', 'tga001', 'tga002', 'tga003'),
  ('2022-08-12', 'tga002', 'tga003', 'tga001'),
  ('2022-08-13', 'tga003', 'tga001', 'tga002'),
  ('2022-08-14', 'tga001', 'tga002', 'tga003'),
  ('2022-08-15', 'tga001', 'tga002', 'tga003'),
  ('2022-08-16', 'tga002', 'tga003', 'tga001'),
  ('2022-08-17', 'tga003', 'tga001', 'tga002'),
  ('2022-08-18', 'tga001', 'tga002', 'tga003'),
  ('2022-08-19', 'tga002', 'tga003', 'tga001'),
  ('2022-08-20', 'tga003', 'tga001', 'tga002'),
  ('2022-08-21', 'tga001', 'tga002', 'tga003'),
  ('2022-08-22', 'tga001', 'tga002', 'tga003'),
  ('2022-08-23', 'tga002', 'tga003', 'tga001'),
  ('2022-08-24', 'tga003', 'tga001', 'tga002'),
  ('2022-08-25', 'tga001', 'tga002', 'tga003'),
  ('2022-08-26', 'tga002', 'tga003', 'tga001'),
  ('2022-08-27', 'tga003', 'tga001', 'tga002'),
  ('2022-08-28', 'tga001', 'tga002', 'tga003'),
  ('2022-08-29', 'tga001', 'tga002', 'tga003'),
  ('2022-08-30', 'tga002', 'tga003', 'tga001'),
  ('2022-08-31', 'tga003', 'tga001', 'tga002');
 
  
  
 
 
  

