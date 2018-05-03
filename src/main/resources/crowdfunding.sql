/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : crowdfunding

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-05-02 14:25:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for approval
-- ----------------------------
DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `Aid` varchar(255) NOT NULL COMMENT '审批编号',
  `Astate` varchar(255) DEFAULT NULL COMMENT '审批状态',
  `Pid` varchar(255) DEFAULT NULL COMMENT '项目编号',
  `Adate` date DEFAULT NULL COMMENT '审批日期',
  PRIMARY KEY (`Aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of approval
-- ----------------------------

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `Cid` varchar(255) NOT NULL COMMENT '评论编号',
  `Ccontext` varchar(255) DEFAULT NULL COMMENT '评论内容',
  `CreplyId` varchar(255) DEFAULT NULL COMMENT '评论回复编号',
  `Uid` varchar(255) DEFAULT NULL COMMENT '用户编号',
  `Pid` varchar(255) DEFAULT NULL COMMENT '项目编号',
  PRIMARY KEY (`Cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for homecarousel
-- ----------------------------
DROP TABLE IF EXISTS `homecarousel`;
CREATE TABLE `homecarousel` (
  `HCid` varchar(255) NOT NULL COMMENT '轮播编号',
  `HCimage` varchar(255) DEFAULT NULL COMMENT '轮播图片',
  PRIMARY KEY (`HCid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of homecarousel
-- ----------------------------

-- ----------------------------
-- Table structure for homedisplay
-- ----------------------------
DROP TABLE IF EXISTS `homedisplay`;
CREATE TABLE `homedisplay` (
  `Pid` varchar(255) DEFAULT NULL COMMENT '项目编号',
  `PCid` varchar(255) DEFAULT NULL COMMENT '类别编号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of homedisplay
-- ----------------------------

-- ----------------------------
-- Table structure for manager
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `mpassword` varchar(255) DEFAULT NULL,
  `mname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of manager
-- ----------------------------
INSERT INTO `manager` VALUES ('1', 'admin', 'admin');

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `Oid` varchar(255) NOT NULL COMMENT '订单编号',
  `Pid` varchar(255) DEFAULT NULL COMMENT '项目编号',
  `Uid` varchar(255) DEFAULT NULL COMMENT '用户编号',
  `Ostate` varchar(255) DEFAULT NULL COMMENT '订单状态',
  `Omoney` int(11) DEFAULT NULL COMMENT '资助金额',
  PRIMARY KEY (`Oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order
-- ----------------------------

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `pid` varchar(255) NOT NULL COMMENT '项目编号',
  `paccountName` varchar(255) DEFAULT NULL COMMENT '筹款人姓名',
  `pidentify` varchar(255) DEFAULT NULL COMMENT '筹款人身份证',
  `paccountTel` varchar(255) DEFAULT NULL COMMENT '筹款人联系方式',
  `ploc` varchar(255) DEFAULT NULL COMMENT '项目地址',
  `pimage` varchar(255) DEFAULT NULL COMMENT '项目图片',
  `pname` varchar(255) DEFAULT NULL COMMENT '项目名称',
  `pcontent` varchar(255) DEFAULT NULL COMMENT '项目内容',
  `pdate` varchar(255) DEFAULT NULL COMMENT '项目日期',
  `ptargetMoney` int(11) DEFAULT NULL COMMENT '目标资金',
  `praiseDays` int(11) DEFAULT NULL COMMENT '筹集天数',
  `ppresentMoney` int(11) DEFAULT NULL COMMENT '当前资金',
  `ptags` varchar(255) DEFAULT NULL COMMENT '标签',
  `pdescripTitle` varchar(255) DEFAULT NULL COMMENT '项目描述标题',
  `pdescripCont` varchar(255) DEFAULT NULL COMMENT '项目详细描述',
  `prepayType` varchar(255) DEFAULT NULL COMMENT '支付方式',
  `prepayTitle` varchar(255) DEFAULT NULL,
  `prepayCont` varchar(255) DEFAULT NULL,
  `pcid` int(11) DEFAULT NULL COMMENT '类别编号',
  `uid` int(11) DEFAULT NULL COMMENT '用户编号',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES ('302e578bf4c54b3caea4091b150228eb', '张三', '321541199111111234', null, '北京市,市辖区,东城区', 'http://images.yuchu.ac.cn/fee433bb-5348-4416-b626-6ddaf6e466d2.jpg', '哈哈哈', '哈哈哈哈哈', '2018-05-02', '123', '12', null, '还好', '哈哈哈哈哈哈', '哈哈哈哈哈哈哈哈', null, null, null, '1', '1');

-- ----------------------------
-- Table structure for projectclassification
-- ----------------------------
DROP TABLE IF EXISTS `projectclassification`;
CREATE TABLE `projectclassification` (
  `Pcid` varchar(255) NOT NULL COMMENT '分类编号',
  `Pcname` varchar(255) DEFAULT NULL COMMENT '分类名称',
  `Pcnumber` int(11) DEFAULT NULL COMMENT '分类数量',
  `Pcimage` varchar(255) DEFAULT NULL COMMENT '分类图片',
  PRIMARY KEY (`Pcid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of projectclassification
-- ----------------------------

-- ----------------------------
-- Table structure for sponsor
-- ----------------------------
DROP TABLE IF EXISTS `sponsor`;
CREATE TABLE `sponsor` (
  `Sid` varchar(255) NOT NULL COMMENT '赞助商编号',
  `Sname` varchar(255) DEFAULT NULL COMMENT '赞助商名称',
  `Smoney` int(11) DEFAULT NULL COMMENT '赞助商资金',
  PRIMARY KEY (`Sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sponsor
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `unickname` varchar(255) DEFAULT NULL COMMENT '用户昵称',
  `upassword` varchar(255) DEFAULT NULL COMMENT '用户密码',
  `uname` varchar(255) DEFAULT NULL COMMENT '用户名称',
  `usex` varchar(5) DEFAULT NULL COMMENT '用户性别',
  `uidNumber` varchar(18) DEFAULT NULL COMMENT '用户身份证',
  `uphone` varchar(255) DEFAULT NULL COMMENT '用户电话',
  `uimage` varchar(255) DEFAULT NULL COMMENT '用户头像',
  `uemail` varchar(255) DEFAULT NULL COMMENT '用户邮箱',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'test', '123456', 'hahahah', '男', '320545454545454', '1390004545', 'http://images.yuchu.ac.cn/c1e619c8-ef4e-449e-9aa8-7d7512002a45.jpg', 'ksjafas@qq.com');
INSERT INTO `user` VALUES ('2', 'userTest', '123456', null, null, null, null, 'http://images.yuchu.ac.cn/c1e619c8-ef4e-449e-9aa8-7d7512002a45.jpg', 'test@test.com');
