<template>
	<div class="view-home">
		<div class="left-bar">
			<div class="system-name">改进汇后台管理系统</div>
			<el-menu 
				:default-active="$route.path"
				:collapse="isCollapse"
				background-color="#34495e"
				text-color="#fff"
				active-text-color="#ffd04b">
				<template v-for="(item, index) in navList">
					<el-menu-item v-if="!item.children" :index="item.path" @click="navClick(item)">
						<i :class="item.icon"></i>
						<span slot="title">{{item.name}}</span>
					</el-menu-item>
					<el-submenu v-if="(item.children && type == 1 && item.children.length > 2) || (item.children && type == 0)" :index="item.path">
						<template slot="title">
							<i :class="item.icon"></i>
							<span slot="title">{{item.name}}</span>
						</template>
						<el-menu-item-group>
							<el-menu-item v-for="a in item.children" :index="a.path" :key="a.path" @click="navClick(a)">{{a.name}}</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</template>
			</el-menu>
		</div>
		<div class="right-box">
			<div class="head-bar">
				<div class="user-info">
					<img :src="user.headUrl ? user.headUrl : '../../assets/img/temp_default.png'"/>
					<div class="user-msg"> <p>{{user.phoneNumber}}</p> <p>{{user.name}}</p> </div>
				</div>
				<span class="login-out" @click="loginOut"><i class="el-icon-circle-close-outline"></i> 退出</span>
			</div>
			<!--content加载区-->
			<div class="content-view"> <router-view></router-view> </div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'home',
		data() {
			return {
				user: JSON.parse(localStorage.bookUser) || {},
				type: '',
				isCollapse: false,
				navList: [
					{
						name: '用户',
						icon: 'el-icon-message',
						path: '/user'
					}, {
						name: '群组',
						icon: 'el-icon-menu',
						path: '/group'
					}, {
						name: '管理驾照',
						icon: 'el-icon-document',
						path: '/drive'
					}, {
						name: '听到',
						icon: 'el-icon-phone-outline',
						path: '/hear'
					}, {
						name: '管理员',
						icon: 'el-icon-setting',
						path: '/admin'
					}, {
						name: '董事会',
						icon: 'el-icon-tickets',
						path: '/boss'
					}
				],
				upData: {
					token: '',
					domain: 'http://ovurgak1b.bkt.clouddn.com/'
				}
			}
		},
		created() { 
			this.getUserInfo();
		},
		methods: {
			navClick(item) {
				this.$router.push(item.path);
			},
			getUserInfo() {
//				this.$api.getUserInfo()
//					.then((r) => {
//						if (r.status === '200') {
//							this.user = r.data;
//							localStorage.bookUser = JSON.stringify(r.data);
//						} else{
//							this.$message.error(r.msg)
//						}
//					})
			},
			loginOut() {
				this.$confirm('确认退出系统?', '提示', {
		        	confirmButtonText: '确定',
		        	cancelButtonText: '取消',
		        	type: 'warning'
		        }).then(() => {
		        	this.$com.clearCookie() 
				    this.$router.push('/login')
		        }).catch(() => {});
			}
		}
	}
</script>

<style>
</style>