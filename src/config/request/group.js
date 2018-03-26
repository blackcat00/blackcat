/**
 *群组
 */
module.exports = [
	{//群组 增 改
		name: 'groupAOM',
		method: 'post',
		params: 'id,groupName,groupHeadUrl,information',
		url: '/book/sys/group/addOrUpdate'
	}, 
	{//群组 解散
		name: 'groupDelete',
		method: 'post',
		params: 'id',
		url: '/book/sys/group/delete'
	},
	{//群组 推送群消息
		name: 'groupSendMsg',
		method: 'post',
		params: 'groupIds,content',
		url: '/book/sys/group/publishMessage'
	},
	{//群组 列表
		name: 'getGroupList',
		method: 'get',
		params: 'page,pageSize,groupName,groupUserName,groupPhoneNumber',
		url: '/book/sys/group/list'
	},
	{//群成员列表
		name: 'getGroupUserList',
		method: 'get',
		params: 'groupId,page,pageSize',
		url: '/book/sys/group/user/list'
	},
	{//群成员 新增
		name: 'groupUserAdd',
		method: 'post',
		params: 'groupId,ids',
		url: '/book/sys/group/user/add'
	},
	{//群成员 删除
		name: 'groupUserDelete',
		method: 'post',
		params: 'groupId,ids',
		url: '/book/sys/group/user/delete'
	},
	{//群成员 改昵称
		name: 'groupUserNickname',
		method: 'post',
		params: 'groupId,id,nickName',
		url: '/book/sys/group/user/nickname'
	}
]
