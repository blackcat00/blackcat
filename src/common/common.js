import api from '../config/api'
export default {
	getCookie() {
		var name = 'book';
		var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if (arr=document.cookie.match(reg)) { return unescape(arr[2]) } else{ return '' }
	},
	clearCookie() {
		var exp = new Date(); 
	    exp.setTime(exp.getTime() - 1); 
	    document.cookie = 'book="";expires='+exp.toGMTString(); 
	},
	getBtnClickDelay(t) {
		t ? t = t : t = 2500;
		if (this.BtnClickDelayFlag) {
			return false;
		} else{
			this.BtnClickDelayFlag = true
			setTimeout(() => { this.BtnClickDelayFlag = false }, t);
			return true;
		}
	},
	dateFormat(n) {
		if(!n || typeof(n) != 'number') return '';
		var t = new Date(n),
			y = t.getFullYear(),
			m = t.getMonth()+1,
			d = t.getDate(),
			hh = t.getHours(),
			mm = t.getMinutes(),
			ss = t.getSeconds();
		function add0(n) { return n<10?'0'+n:n }
		return y+'-'+add0(m)+'-'+add0(d)+' '+add0(hh)+':'+add0(mm)+':'+add0(ss)
	}
}
