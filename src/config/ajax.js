import axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'
//axios.defaults.baseURL = 'https://api.example.com';
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers['running-number'] = new Date().getTime();
axios.defaults.timeout = 10000;
//请求拦截器
axios.interceptors.request.use((config) => {
	if (config.url == '/book/sys/listen/switchVoice') {
		config.timeout = 300000;
	};
	if(config.method === 'post' && !config.isJson) {
		config.data = Qs.stringify(config.data);
	}
	return config;
}, (error) => {
	//	Message.error("参数出错！");
	Message.error(error);
});
// 响应拦截器
axios.interceptors.response.use((r) => {
	return r.data;
}, (e) => {
	if (e instanceof Error) {
		//Message.error(e.message);
		if(/timeout/i.test(e.message)) return {status: '504', msg: '请求超时，请检查您的网络'};
		return {status: e.response.status, msg: '请求出错，错误码：' + e.response.status}
	} else {
		return e
		//Message.error(e.data.msg);
	}
});
export default axios;