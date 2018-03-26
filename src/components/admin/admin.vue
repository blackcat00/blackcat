<template>
	<div class="user-view">
		<el-form :inline="true" size="mini" class="search-form" label-width="70px">
			<el-form-item label="姓名">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="getTableData">搜 索</el-button>
			</el-form-item>
		</el-form>
		<div class="table-box">
			<div class="btn-box">
				<el-button type="primary" size="mini" @click="showDialogA(0)">新 增</el-button>
			</div>
			<el-table border :data="tableData.list">
				<!--<el-table-column min-width="50" type="selection"></el-table-column>-->
				<el-table-column min-width="70" label="姓名" prop="name"></el-table-column>
				<el-table-column min-width="90" label="手机号码" prop="phoneNumber"></el-table-column>
				<!--<el-table-column min-width="80" label="职位" prop="position"></el-table-column>-->
				<el-table-column min-width="100" label="注册时间">
					<template slot-scope="scope">
						{{$com.dateFormat(scope.row.createTime)}}
					</template>
				</el-table-column>
				<el-table-column min-width="70" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="showDialogA(1,scope.row)">修改</el-button>
						<el-button type="text" size="mini" @click="deleteUser(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination 
				:total="tableData.total"
				:current-page="form.pageIndex"
				:page-size="form.pageSize" 
				:page-sizes="pageSizeArr" 
				@size-change="sizeChange" 
				@current-change="currentChange" 
				layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</div>
		<el-dialog title="添加用户" :visible.sync="dialogA.flag" width="600px">
			<el-form label-width="90px" size="mini" class="form-col2">
				<el-form-item label="姓名"><el-input v-model="dialogA.form.name"></el-input></el-form-item>
				<el-form-item label="手机号码"><el-input v-model="dialogA.form.phoneNumber"></el-input></el-form-item>
				<el-form-item label="头像" style="display: block;">
					<el-upload 
						class="avatar-uploader" 
						action="http://upload.qiniu.com/" 
						:data="upData"
						:show-file-list="false" 
						:on-success="handleAvatarSuccess" 
						:before-upload="beforeAvatarUpload">
						<img v-if="dialogA.form.headUrl" :src="dialogA.form.headUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="saveUser">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'send', 
	data() {
		return {
			pageSizeArr: [5, 10, 20, 30], // 页码
			form: {
				name: '',
				phoneNumber: '',
				page: 1,
				pageSize: 10,
			},
			tableData: {
				list: [],
				total: 0
			},
			dialogA: {
				flag: false,
				form: {}
			},
			upData: {}
		}
	},
	created() {
		this.getTableData();
	},
	methods: {
		getTableData() {
			this.$api.getAdminList(this.form)
				.then((r) => {
					if(r.status === '200') {
						this.tableData = r.data;
					}else {
						this.$message.error(r.msg)
					}
				})
		},
		showDialogA(n, row) {
			this.dialogA.flag = true;
			if (n === 0) {//add
				this.dialogA.form = {
					id: '', name: '', phoneNumber: '', type: 0, headUrl: ''
				}
			} else{//modify
				this.dialogA.form = {
					id: row.id, name: row.name, phoneNumber: row.phoneNumber,  
					type: 0, headUrl: row.headUrl
				}
			}
		},
		beforeAvatarUpload(file) {
			console.log(file)
			const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png'); 
			const isLt2M = file.size / 1024 / 1024 < 0.5; 
			if (!isJPG) { this.$message.error( '图片格式错误!'); } 
			if (!isLt2M) { this.$message.error( '图片大小不能超过 500k!'); } 
			if (isJPG && isLt2M) {
				return this.$api.getQiniuToken()
					.then((r)=>{
						if (r.status === '200') {
							this.upData = r.data;
							return true;
						} else{
							this.$message.error(r.msg);
							return false;
						}
					})
			} else{
				return false
			}
		},
		handleAvatarSuccess(res, file) {
			this.dialogA.form.headUrl = this.upData.domain+res.key;
		},
		saveUser() {
			if (!this.$com.getBtnClickDelay()) {return false};
			this.$api.adminAOM(this.dialogA.form)
				.then((r)=>{
					if (r.status === '200') {
						this.$message.success('保存成功！');
						this.dialogA.flag = false;
						this.getTableData()
					} else{
						this.$message.error(r.msg)
					}
				})
		},
		deleteUser(row) {
			this.$confirm('确认删除选中管理员?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	        }).then(() => {
	        	this.$api.adminDelete({id: row.id})
					.then((r)=>{
						if (r.status === '200') {
							this.$message.success('删除成功！');
							this.getTableData()
						} else{
							this.$message.error(r.msg)
						}
					})
	        }).catch(() => {});
		},
		sizeChange(val) {
			this.form.pageSize = val;
			this.getTableData();
		},
		currentChange(val) {
			this.form.pageIndex = val;
			this.getTableData();
		} 
	}
}
</script>

<style>
</style>