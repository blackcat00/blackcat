<template>
	<div class="group-view">
		<el-form :inline="true" size="mini" class="search-form" label-width="100px">
			<el-form-item label="群名称">
				<el-input v-model="form.groupName"></el-input>
			</el-form-item>
			<el-form-item label="群成员名称">
				<el-input v-model="form.groupUserName"></el-input>
			</el-form-item>
			<el-form-item label="群成员手机号">
				<el-input v-model="form.groupPhoneNumber"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="getTableData">搜 索</el-button>
			</el-form-item>
		</el-form>
		<div class="table-box">
			<div class="btn-box">
				<el-button type="primary" size="mini" @click="showDialogA(0)">新 增</el-button>
				<!--<el-button type="danger" size="mini" @click="deleteUser">解散群组</el-button>-->
			</div>
			<el-table border :data="tableData.list">
				<el-table-column min-width="70" label="群名称" prop="groupName"></el-table-column>
				<el-table-column min-width="100" label="创建时间">
					<template slot-scope="scope">
						{{$com.dateFormat(scope.row.createTime)}}
					</template>
				</el-table-column>
				<el-table-column min-width="90" label="创建人/群主" prop="createUserName"></el-table-column>
				<el-table-column min-width="60" label="群头像" class-name="col-img">
					<template slot-scope="scope">
						<img :src="scope.row.groupHeadUrl" width="35" height="35"/>
					</template>
				</el-table-column>
				<el-table-column min-width="80" label="群消息" prop="information"></el-table-column>
				<el-table-column min-width="120" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="showDialogD(scope.row)">推送消息</el-button>
						<el-button type="text" size="mini" @click="showDialogA(1,scope.row)">设置</el-button>
						<el-button type="text" size="mini" @click="showDialogB(scope.row)">成员管理</el-button>
						<el-button type="text" size="mini" @click="deleteGroup(scope.row)">解散</el-button>
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
		<el-dialog title="群设置" :visible.sync="dialogA.flag" width="600px" class="groupDialog">
			<div style="position: relative;">
				<el-upload 
					class="avatar-uploader" 
					action="http://upload.qiniu.com/" 
					:data="upData"
					:show-file-list="false" 
					:on-success="handleAvatarSuccess" 
					:before-upload="beforeAvatarUpload">
					<img v-if="dialogA.form.groupHeadUrl" :src="dialogA.form.groupHeadUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<el-form label-width="70px" size="mini">
					<el-form-item label="名称"><el-input v-model="dialogA.form.groupName"></el-input></el-form-item>
					<el-form-item label="说明"><el-input v-model="dialogA.form.information"></el-input></el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="saveGroup">保 存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="群成员管理" :visible.sync="dialogB.flag" width="600px" class="userDialog">
			<div class="btn-box">
				<el-button type="success" size="mini" @click="showDialogC">添加群成员</el-button>
				<el-button type="danger" size="mini" @click="deleteGroupUser(0)">批量删除</el-button>
			</div>
			<el-table border :data="dialogB.userData.list" @selection-change="selectionChangeB">
				<el-table-column min-width="50" type="selection"></el-table-column>
				<el-table-column min-width="70" label="名称" prop="name"></el-table-column>
				<el-table-column min-width="70" label="群昵称">
					<template slot-scope="scope">
						<span v-show="!scope.row.editFlag">{{scope.row.groupNickName}}</span>
						<el-input v-show="scope.row.editFlag" v-model="scope.row.groupNickName" size="mini" style="width: 100px;"></el-input>
						<i v-show="!scope.row.editFlag" class="el-icon-edit" @click="scope.row.editFlag = true"></i>
						<i v-show="scope.row.editFlag" class="el-icon-circle-check" @click="saveNickname(scope.row)"></i>
					</template>
				</el-table-column>
				<el-table-column min-width="70" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="deleteGroupUser(1,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination 
				style="text-align: center;"
				:total="dialogB.userData.total"
				:current-page="dialogB.page"
				:page-size="dialogB.pageSize" 
				:page-sizes="pageSizeArr" 
				@size-change="sizeChangeB" 
				@current-change="currentChangeB" 
				layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
			<el-dialog title="添加群成员" width="600px" :visible.sync="dialogC.flag" append-to-body class="adduserDialog">
				<el-table border :data="dialogC.userData.list" @selection-change="selectionChangeC">
					<el-table-column min-width="50" type="selection"></el-table-column>
					<el-table-column min-width="70" label="名称" prop="name"></el-table-column>
					<el-table-column min-width="70" label="手机号" prop="phoneNumber"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" type="primary" @click="addGroupUser">保 存</el-button>
				</div>
			</el-dialog>
		</el-dialog>
		<el-dialog title="推送群消息" width="600px" :visible.sync="dialogD.flag">
			<el-form label-width="90px" size="mini" style="margin-right: 20px;">
				<el-form-item label="群名称">{{dialogD.row.groupName}}</el-form-item>
				<el-form-item label="消息"><el-input row="3" type="textarea" v-model="dialogD.form.content"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="send">发 送</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			pageSizeArr: [5, 10, 20, 30], // 页码
			form: {
				groupName: '',
				groupUserName: '',
				groupPhoneNumber: '',
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
			dialogB: {//群成员列表
				flag: false,
				row: null,
				page: 1,
				pageSize: 5,
				selection: [],
				userData: {}
			},
			dialogC: {//添加群成员
				flag: false,
				selection: [],
				userData: {}
			},
			dialogD: {
				flag: false,
				row: {},
				form: {content: ''}
			},
			upData: {}
		}
	},
	created() {
		this.getTableData();
	},
	methods: {
		getTableData() {
			this.$api.getGroupList(this.form)
				.then((r) => {
					if(r.status === '200') {
						this.tableData = r.data;
					}else {
						this.$message.error(r.msg)
					}
				})
		},
		sizeChange(val) {
			this.form.pageSize = val;
			this.getTableData();
		},
		currentChange(val) {
			this.form.page = val;
			this.getTableData();
		},
		deleteGroup(row) {
			this.$confirm('确认解散此群组?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	        }).then(() => {
	        	this.$api.groupDelete({id: row.id})
					.then((r)=>{
						if (r.status === '200') {
							this.$message.success('解散群组成功！');
							this.getTableData()
						} else{
							this.$message.error(r.msg)
						}
					})
	        }).catch(() => {});
		},
		showDialogA(n, row) {
			this.dialogA.flag = true;
			if (n === 0) {//add
				this.dialogA.form = {
					id: '', groupName: '', information: '',
					groupHeadUrl: ''
				}
			} else{//modify
				this.dialogA.form = {
					id: row.id, groupName: row.groupName, information: row.information,
					groupHeadUrl: row.groupHeadUrl
				}
			}
		},
		beforeAvatarUpload(file) {
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
			this.dialogA.form.groupHeadUrl = this.upData.domain+res.key;
		},
		saveGroup() {
			if (!this.$com.getBtnClickDelay()) {return false};
			this.$api.groupAOM(this.dialogA.form)
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
		showDialogB(row) {
			this.dialogB.flag = true;
			this.dialogB.row = row;
			this.getGroupUserList()
		},
		getGroupUserList() {
			this.$api.getGroupUserList({groupId:this.dialogB.row.id, page:this.dialogB.page, pageSize: this.dialogB.pageSize})
				.then((r)=>{
					if (r.status === '200') {
						for (var i = 0; i < r.data.list.length; i++) {
							r.data.list[i].editFlag = false;
						};
						this.dialogB.userData = r.data
					} else{
						this.$message.error(r.msg)
					}
				})
		},
		saveNickname(row) {
			this.$api.groupUserNickname({groupId:this.dialogB.row.id, id: row.id, nickName: row.groupNickName})
				.then((r)=>{
					if (r.status === '200') {
						//this.$message.success('修改昵称成功！');
						row.editFlag = false;
						this.getGroupUserList()
					} else{
						this.$message.error(r.msg)
					}
				})
		},
		sizeChangeB(val) {
			this.dialogB.pageSize = val;
			this.getGroupUserList();
		},
		currentChangeB(val) {
			this.dialogB.page = val;
			this.getGroupUserList();
		},
		selectionChangeB(val) {//批量选择
			this.dialogB.selection = val
		},
		deleteGroupUser(n, row) {
			if (!n && !this.dialogB.selection.length) {
				this.$message.error('请先选择需要删除的群组成员！');
				return false
			};
			var ids = '';
			if (n) {
				ids = row.id+''
			} else{
				for (var i = 0; i < this.dialogB.selection.length; i++) {
					ids += this.dialogB.selection[i].id + ','
				}
				ids = ids.slice(0, -1)
			};
			this.$confirm('确认删除选中成员?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	        }).then(() => {
	        	this.$api.groupUserDelete({groupId: this.dialogB.row.id, ids: ids})
					.then((r)=>{
						if (r.status === '200') {
							this.$message.success('删除成功！');
							this.getGroupUserList()
						} else{
							this.$message.error(r.msg)
						}
					})
	        }).catch(() => {});
		},
		showDialogC() {
			this.dialogC.flag = true;
			this.dialogC.selection = [];
			this.$api.getUserList({page: 1, pageSize: 999})
				.then((r) => {
					if(r.status === '200') {
						this.dialogC.userData = r.data;
					}else {
						this.$message.error(r.msg)
					}
				})
		},
		selectionChangeC(val) {
			this.dialogC.selection = val
		},
		addGroupUser() {
			var a = this.dialogC.selection, ids = '';
			if (!a.length) {
				this.$message.error('请选择用户！');
				return false
			} else{
				for (var i = 0; i < a.length; i++) { ids += a[i].id+',' };
				ids = ids.slice(0, -1);
				this.$api.groupUserAdd({groupId: this.dialogB.row.id, ids: ids})
					.then((r)=>{
						if(r.status === '200') {
							this.dialogC.flag = false;
							this.$message.success('添加群成员成功！');
							this.getGroupUserList();
						}else {
							this.$message.error(r.msg)
						}
					})
			}
		},
		showDialogD(row) {
			this.dialogD.row = row;
			this.dialogD.flag = true;
			this.dialogD.form.content = '';
		},
		send() {
			this.$api.groupSendMsg({groupIds: this.dialogD.row.id, content: this.dialogD.form.content})
				.then((r)=>{
					if(r.status === '200') {
						this.dialogD.flag = false;
						this.$message.success('消息推送成功！');
					}else {
						this.$message.error(r.msg)
					}
				})
		}
	}
}
</script>

<style>
</style>