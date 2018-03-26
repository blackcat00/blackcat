/**
 *管理员
 */
module.exports = [
	{//增 改
		name: 'adminAOM',
		method: 'post',
		params: 'id,name,phoneNumber,type(0),headUrl',
		url: '/book/sys/admin/addOrUpdate'
	}, {//删除
		name: 'adminDelete',
		method: 'post',
		params: 'id',
		url: '/book/sys/admin/delete'
	}, {//列表
		name: 'getAdminList',
		method: 'get',
		params: 'page,pageSize,name,phoneNumber',
		url: '/book/sys/admin/list'
	}
]
