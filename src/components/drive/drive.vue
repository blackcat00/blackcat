<template>
	<div class="drive-view">
		<el-form :inline="true" size="mini" class="search-form" label-width="70px">
			<el-form-item label="报名人">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input v-model="form.phoneNumber"></el-input>
			</el-form-item>
			<el-form-item label="报名时间">
				<el-date-picker 
					v-model="form.dateTime" 
					type="date" 
					:editable="false"
					value-format="timestamp">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="getTableData">搜 索</el-button>
			</el-form-item>
		</el-form>
		<div class="table-box">
			<div class="btn-box">
				<el-button type="success" size="mini" @click="showDialogB">驾照介绍</el-button>
				<el-button type="primary" size="mini" @click="showDialogA(0)">新 增</el-button>
				<el-button type="danger" size="mini" @click="deleteUser(0)">批量删除</el-button>
			</div>
			<el-table border :data="tableData.list" @selection-change="selectionChange">
				<el-table-column min-width="50" type="selection"></el-table-column>
				<el-table-column min-width="70" label="报名人" prop="name"></el-table-column>
				<el-table-column min-width="70" label="手机号" prop="phoneNumber"></el-table-column>
				<el-table-column min-width="100" label="报名时间">
					<template slot-scope="scope">
						{{$com.dateFormat(scope.row.createTime)}}
					</template>
				</el-table-column>
				<el-table-column min-width="70" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="showDialogA(1,scope.row)">修改</el-button>
						<el-button type="text" size="mini" @click="deleteUser(1,scope.row)">删除</el-button>
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
		<el-dialog title="报名" :visible.sync="dialogA.flag" width="600px">
			<el-form label-width="90px" size="mini" class="form-col2">
				<el-form-item label="姓名"><el-input v-model="dialogA.form.name"></el-input></el-form-item>
				<el-form-item label="手机号码"><el-input v-model="dialogA.form.phoneNumber"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="saveUser">保 存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="驾照介绍" :visible.sync="dialogB.flag" width="600px" :close-on-click-modal="false">
			<quill-editor 
				v-model="dialogB.form.content" 
				ref="myQuillEditor" 
				class="editor" 
				:options="editorOption" >
			</quill-editor>
			<el-upload style="display: none;" :data="upData" ref="uploadA" action="http://upload.qiniu.com/" :show-file-list="false" :on-success="uploadSuccessA" :before-upload="beforeAvatarUpload">
	        	<el-button size="small" id="uploadA">点击上传</el-button>
	        </el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="saveDriveInfo">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
	name: 'send', 
	components: {
        quillEditor
    },
	data() {
		return {
			pageSizeArr: [5, 10, 20, 30], // 页码
			form: {
				name: '',
				nickName: '',
				phoneNumber: '',
				page: 1,
				pageSize: 10,
			},
			tableData: {
				list: [],
				total: 0
			},
			rowSelection: [],
			dialogA: {
				flag: false,
				form: {}
			},
			dialogB: {
				flag: false,
				form: {}
			},
			editorOption: {
				modules: {
					toolbar: [
						['bold', 'underline', 'strike'], 
						[{'size': ['small', false, 'large', 'huge']}], 
					 	[{'color': []}, {'background': []}], 
					  	[{'align': []}],
					  	['image'],
					  	['clean'] 
					]
				}
			},
			upData: {}
		}
	},
	created() {
		this.getTableData();
		this.getDriveInfoArt();
	},
	methods: {
		getTableData() {
			this.$api.getDriveList(this.form)
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
					id: '', name: '', phoneNumber: ''
				}
			} else{//modify
				this.dialogA.form = {
					id: row.id, name: row.name, phoneNumber: row.phoneNumber
				}
			}
		},
		saveUser() {
			if (!this.$com.getBtnClickDelay()) {return false};
			this.$api.driveAOM(this.dialogA.form)
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
		getDriveInfoArt() {
			this.$api.getDriveInfo()
				.then((r)=>{
					if (r.status === '200') {
						this.dialogB.form.id = r.data.id;
						this.dialogB.form.content = r.data.content;
					} else{
						this.$message.error(r.msg)
					}
				})
		},
		showDialogB() {
			this.dialogB.flag = true;
			this.getQiniuToken();
			this.getDriveInfoArt();
			setTimeout(()=>{
				this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerA);
			},300)
		},
		imgHandlerA() {
			this.getQiniuToken();
			let upbtn = document.getElementById('uploadA')
      		upbtn.click()
		},
		uploadSuccessA(r, file) {
        	var url = '', vm = this;
        	if(r.code == 500) {  
        	    this.$message.error('上传失败!')  
        	    return false;
        	} else {  
        	    this.$message.success('上传成功!')  
        	}  
			url = this.upData.domain + r.key;
			let value = url;
			let ql = this.$refs.myQuillEditor.quill;
      		vm.addRange = ql.getSelection();
      		ql.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, 'image', value);
      		ql.setSelection(ql.getSelection().index + 1);
      		this.$refs['uploadA'].clearFiles();
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
		saveDriveInfo() {
			if (!this.$com.getBtnClickDelay()) {return false};
			this.$api.driveInfoAOM(this.dialogB.form)
				.then((r)=>{
					if (r.status === '200') {
						this.$message.success('保存成功');
						this.dialogB.flag = false;
					} else{
						this.$message.error(r.msg)
					}
				})
		},
		selectionChange(val) {//批量选择
			this.rowSelection = val
		},
		deleteUser(n, row) {//n=0批量 1单个
			if (!n && !this.rowSelection.length) {
				this.$message.error('请先选择需要删除的报名人！');
				return false
			};
			var ids = '';
			if (n) {
				ids = row.id+''
			} else{
				for (var i = 0; i < this.rowSelection.length; i++) {
					ids += this.rowSelection[i].id + ','
				}
				ids = ids.slice(0, -1)
			};
			this.$confirm('确认删除选中人员?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	        }).then(() => {
	        	this.$api.driveDelete({ids: ids})
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
		},
		getQiniuToken() {
			this.$api.getQiniuToken()
				.then((r)=>{
					if (r.status === '200') {
						this.upData = r.data;
					} else{
						this.$message.error(r.msg);
					}
				})
		}
	}
}
</script>

<style>
</style>