<template>
	<div class="login">
		<div class="login-box">
			<div class="login-header">
				改进吧后台管理系统
			</div>
			<div class="login-body" @keyup="enterListener">
				<el-input v-model="form.account" class="ipt1" placeholder="请输入账号"></el-input>
				<el-input type="password" v-model="form.password" class="ipt2" placeholder="请输入密码"></el-input>
				<el-button type="primary" @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				form: {
					account: '',
					password: '',
					authCode: '123456',
					type: 0
				}
			}
		},
		methods: {
			login() {
				this.$api.login({
					account: this.form.account,
					password: md5(this.form.password),
					authCode: '123456',
					type: 0
				})
					.then((r)=>{
						if (r.status === '200') {
							localStorage.bookUser = JSON.stringify(r.data);
							this.$message.success('登陆成功');
							this.$router.push('/user')
						} else{
							this.$message.error(r.msg)
						}
					})
			},
			enterListener(e) {
				if (e.keyCode == 13) this.login()
			}
		}
	}
</script>

<style lang="scss">
	.login {
		width: 100%;
		height: 100%;
		background: url(../../assets/img/bj.png) no-repeat center;
		background-size: cover;
		overflow: hidden;
		.login-box {
			position: relative;
			top: 25%;
			width: 350px;
			margin: 0 auto;
			background-color: white;
			border-radius: 5px;
			.login-header {
				height: 70px;
				line-height: 70px;
				text-align: center;
				font-size: 25px;
				font-family: simsun;
				font-weight: bold;
				color: #10A0E8;
				border-bottom: 1px solid #eee;
			}
			.login-body {
				padding: 35px 20px;
				.el-input {
					margin-bottom: 25px;
				}
				.el-button {
					width: 100%;
				}
			}
		}
	}
</style>