/**
 *听到 文章编辑
 */
module.exports = [
	{
		name: 'articleAOM',
		method: 'post',
		params: 'id,contentId,title,subtitle,author,authorUrl,publicationTime,voiceUrl,duration,voiceContent,fileSize',
		url: '/book/sys/listen/addOrUpdate'
	},
	{
		name: 'articleDelete',
		method: 'post',
		params: 'id',
		url: '/book/sys/listen/delete'
	},
	{
		name: 'getArticleList',
		method: 'get',
		params: 'page,pageSize,title,author,dateTime',
		url: '/book/sys/listen/list'
	},
	{
		name: 'audioChangeText',
		method: 'get',
		params: 'voiceUrl',
		url: '/book/sys/listen/switchVoice'
	}
]
