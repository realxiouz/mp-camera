"appid": "api/ygame/user/appid",//appid
"authUser": "api/ygame/user/authUser", // 用户基本信息 微信授权
"swiper": "api/ygame/ad/index",// 轮播图列表 page limit

"gameList": "api/ygame/project/index", // 活动列表 keyword   page   limit
"gameDetail": "api/ygame/project/info",// 活动详情 id
"gameGroupList": "api/ygame/group/index",//活动组别列表 project_id
"gameNewsList": "api/ygame/article/index",//活动新闻列表 project_id
"gameNewsInfo": "api/ygame/article/info",//活动新闻详情 id

"personalRegistration": "api/ygame/project/submit",//个人信息录入 project_id group_id name mobile idcard

"teamRegistration": "api/ygame/person/add",//团队信息录入 person_name mobile idcard
"teamMember": "api/ygame/person/index" ,//团队成员列表 page limit
"teamMemberInfo": "api/ygame/person/info" ,//编辑团队成员详情 id
"teamMemberEdit": "api/ygame/person/edit" ,//编辑团队成员 id person_name mobile idcard
"teamMemberDel": "api/ygame/person/del" ,//删除团队成员 id 
"registeredList": "api/ygame/project/team_member" ,//当前活动人员报名情况列表（已报名和未报名） project_id page limit
"teamRegister": "api/ygame/project/team_submit",//团队报名  project_id group team_name team_leader team_mobile
"teamInfo": "api/ygame/project/team",//获取团队信息 project_id（团队报名顶部团队名称、联系人、电话信息）

"orderList": "api/ygame/order/index" ,//订单列表  status  1待付款  2已报名 -1交易关闭 page limit
"orderPay": "api/ygame/order/pay" ,//支付订单 order_id
"orderCancel": "api/ygame/order/cancel" ,// 取消订单 order_id
"orderMember": "api/ygame/record/members" ,// 订单报名人员信息 order_id

"isSigned": "api/ygame/record/search",//报名查询 name idcard
"resultsEnquiry": "api/ygame/result/search",//成绩查询 name idcard
"certificate": "api/ygame/result/cert",//获取证书 result_id
"orderNum": "api/ygame/order/num",//个人中心 订单数量