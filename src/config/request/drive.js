/**
 *管理驾照
 */
module.exports = [
	{// 增 改
		name: 'driveAOM',
		method: 'post',
		params: 'id,name,phoneNumber',
		url: '/book/sys/license/addOrUpdate'
	}, 
	{//删
		name: 'driveDelete',
		method: 'post',
		params: 'ids',
		url: '/book/sys/license/delete'
	}, 
	{//列表
		name: 'getDriveList',
		method: 'get',
		params: 'page,pageSize,name,phoneNumber,dateTime',
		url: '/book/sys/license/list'
	},
	{//驾照介绍get
		name: 'getDriveInfo',
		method: 'get',
		params: '',
		url: '/book/sys/license/getLicenseIntroduction'
	},
	{//驾照介绍 增 改
		name: 'driveInfoAOM',
		method: 'post',
		params: 'id,content',
		url: '/book/sys/license/addOrUpdateLicenseIntroduction'
	}
]