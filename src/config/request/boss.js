/**
 *私董会
 */
module.exports = [
	{
		name: 'bossAOM',
		method: 'post',
		params: 'id,contentId,content,title,subtitle,author,authorUrl,shareImgUrl,publicationTime',
		url: '/book/sys/boss/addOrUpdate'
	},
	{
		name: 'bossDelete',
		method: 'post',
		params: 'id',
		url: '/book/sys/boss/delete'
	},
	{
		name: 'getBossList',
		method: 'get',
		params: 'page,pageSize,title,author,dateTime',
		url: '/book/sys/boss/list'
	}
]
