import axios from './ajax.js'
// params：参数(备注用)-----------------
var list = [
	{//login
		name: 'login',
		method: 'post',
		params: 'account,password,authCode,type(0后台，1app)',
		url: '/book/sys/login'		
	}, {//骑牛
		name: 'getQiniuToken',
		method: 'get',
		url: '/book/qiniu/getToken'
	}   
]
.concat(require('./request/user.js'))
.concat(require('./request/group.js'))
.concat(require('./request/admin.js'))
.concat(require('./request/hear.js'))
.concat(require('./request/drive.js'))
.concat(require('./request/boss.js'))
;
var api = {};
for (var k in list) {
	if (list[k].name) {
		(function(k) {
			if (list[k].method === 'post') {
				api[list[k].name] = function(d, con) {
					return axios.post(list[k].url, d, con)
				}
			} else{
				api[list[k].name] = function(d) {
					return axios.get(list[k].url, {
						params: d ? d : {}
					});
				}
			}
		})(k)
	}
}
export default api
