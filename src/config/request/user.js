/**
 *user接口
 */
module.exports = [
	{ //增 改
		name: 'userAOM',
		method: 'post',
		params: 'id,name,nickName,phoneNumber,companyName,position,wechatNumber,type(1),headUrl',
		url: '/book/sys/user/addOrUpdate'
	}, 
	{ //批量 删除
		name: 'userDelete',
		method: 'post',
		params: 'ids',
		url: '/book/sys/user/batchDelete'
	}, 
	{ //批量 导入
		name: 'userImport',
		method: 'post',
		params: 'fileUrl',
		url: '/book/sys/user/import'
	}, 
	{//用户列表
		name: 'getUserList',
		method: 'get',
		params: 'page,pageSize,name,nickName,phoneNumber',
		url: '/book/sys/user/list'
	}
]
