<template>
	<div class="hear-view">
		<el-form :inline="true" size="mini" class="search-form" label-width="90px">
			<el-form-item label="文章标题">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item label="作者">
				<el-input v-model="form.author"></el-input>
			</el-form-item>
			<el-form-item label="时间">
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
				<el-button type="primary" size="mini" @click="showDialogA(0)">新 增</el-button>
				<!--<el-button type="danger" size="mini" @click="deleteArt(0)">批量删除</el-button>-->
			</div>
			<el-table border :data="tableData.list" @selection-change="selectionChange">
				<!--<el-table-column min-width="50" type="selection"></el-table-column>-->
				<el-table-column min-width="70" label="文章标题" prop="title"></el-table-column>
				<el-table-column min-width="70" label="作者" prop="author"></el-table-column>
				<el-table-column min-width="90" label="副标题" prop="subtitle"></el-table-column>
				<el-table-column min-width="100" label="创建时间">
					<template slot-scope="scope">
						{{$com.dateFormat(scope.row.createTime)}}
					</template>
				</el-table-column>
				<el-table-column min-width="100" label="发表时间">
					<template slot-scope="scope">
						{{$com.dateFormat(scope.row.publicationTime)}}
					</template>
				</el-table-column>
				<el-table-column min-width="60" label="分享图片"></el-table-column>
				<el-table-column min-width="80" label="阅读次数" prop="readNumber"></el-table-column>
				<el-table-column min-width="60" label="时长" prop="duration"> </el-table-column>
				<el-table-column min-width="70" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="showDialogA(1,scope.row)">修改</el-button>
						<el-button type="text" size="mini" @click="deleteArt(1,scope.row)">删除</el-button>
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
		<el-dialog title="编辑文章" :visible.sync="dialogA.flag" width="600px" :close-on-click-modal="false">
			<el-form label-width="90px" size="mini" class="form-col2">
				<el-form-item label="主标题"><el-input v-model="dialogA.form.title"></el-input></el-form-item>
				<el-form-item label="副标题"><el-input v-model="dialogA.form.subtitle"></el-input></el-form-item>
				<el-form-item label="作者"><el-input v-model="dialogA.form.author"></el-input></el-form-item>
				<el-form-item label="发表时间">
					<el-date-picker 
						style="width: 100%;"
						v-model="dialogA.form.publicationTime" 
						type="datetime" 
						:editable="false"
						value-format="timestamp">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="头像">
					<el-upload 
						class="avatar-uploader" 
						action="http://upload.qiniu.com/" 
						:data="upData"
						:show-file-list="false" 
						:on-success="handleAvatarSuccess" 
						:before-upload="beforeAvatarUpload">
						<img v-if="dialogA.form.authorUrl" :src="dialogA.form.authorUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="语音上传">
					<el-upload
						action="http://upload.qiniu.com/" 
						:data="upData"
						:limit="1" 
						:before-upload="beforeAudioUpload"
						:on-success="handleAudioSuccess"
						:file-list="dialogA.fileList">
						<el-button size="mini">点击上传</el-button>
					</el-upload>
					<el-button size="mini" type="success" @click="changeText" :disabled="dialogA.isBtnDisabled" v-show="dialogA.form.voiceUrl">一键转文本</el-button>
				</el-form-item>
			</el-form>
			<audio :src="dialogA.form.voiceUrl" id="audio" controls="" style="display: none;"></audio>
			<quill-editor 
				v-model="dialogA.form.voiceContent" 
				ref="myQuillEditor" 
				class="editor" 
				:options="editorOption" >
			</quill-editor>
			<el-upload style="display: none;" :data="upData" ref="uploadA" action="http://upload.qiniu.com/" :show-file-list="false" :on-success="uploadSuccessA" :before-upload="beforeAvatarUpload">
	        	<el-button size="small" id="uploadA">点击上传</el-button>
	        </el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="saveArticle">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
export default {
	name: 'send', 
	components: {
        quillEditor
    },
	data() {
		return {
			pageSizeArr: [5, 10, 20, 30], // 页码
			form: {
				title: '',
				subtitle: '',
				dateTime: '',
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
				fileList: [],
				form: {},
				isBtnDisabled: false
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
	},
	methods: {
		getTableData() {
			this.$api.getArticleList(this.form)
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
			this.getQiniuToken();
			if (n === 0) {//add
				this.dialogA.form = {
					id: '', contentId: '', title: '', subtitle: '', author: '', publicationTime: '',
					voiceUrl: '', authorUrl: '', duration: '', voiceContent: '', fileSize: '',fileName: ''
				}
			} else{//modify
				this.dialogA.form = {
					id: row.id, 
					title: row.title, 
					subtitle: row.subtitle,
					author: row.author, 
					publicationTime: row.publicationTime,
					voiceUrl: row.voiceUrl, 
					authorUrl: row.authorUrl,
					duration: row.duration,
					contentId: row.contentResponse.id,
					voiceContent: row.contentResponse.voiceContent, 
					fileSize: row.fileSize,
					fileName: row.fileName
				};
				if (row.voiceUrl) {
					this.dialogA.fileList = [{
						name: row.fileName,
						url: row.voiceUrl,
						status: 'finished'
					}]
				} else {
					this.dialogA.fileList = []
				}
			};
			setTimeout(()=>{
				this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerA)
			},500)
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
		beforeAudioUpload(file) {
			const isJPG = file.type === 'audio/mp3'; 
			const isLt2M = file.size / 1024 / 1024 < 100; 
			if (!isJPG) { this.$message.error( '文件格式错误!'); } 
			if (!isLt2M) { this.$message.error( '文件大小不能超过 100M!'); } 
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
		handleAudioSuccess(res, file) {
			this.dialogA.form.voiceUrl = this.upData.domain+res.key;
			this.dialogA.form.fileSize = file.size;
			this.dialogA.form.fileName = file.name;
		},
		changeText() {//语音转化 文字 
			this.dialogA.isBtnDisabled = true;
			this.$api.audioChangeText({
				voiceUrl: this.dialogA.form.voiceUrl,
				fileName: this.dialogA.form.fileName
			})
				.then((r)=>{
					if (r.status === '200') {
						this.$message.success('转化成功！');
						this.dialogA.form.voiceContent = r.data;
						this.dialogA.isBtnDisabled = false;
					} else{
						this.$message.error(r.msg);
						this.dialogA.isBtnDisabled = false;
					}
				})
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
			this.dialogA.form.authorUrl = this.upData.domain+res.key;
		},
		saveArticle() {
			if (!this.$com.getBtnClickDelay()) {return false};
			if (this.dialogA.form.voiceUrl) {
				var a = document.getElementById('audio').duration;
				this.dialogA.form.duration = a ? parseInt(a): '';
			};
			this.$api.articleAOM(this.dialogA.form)
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
		selectionChange(val) {//批量选择
			this.rowSelection = val
		},
		deleteArt(n, row) {//n=0批量 1单个
			if (!n && !this.rowSelection.length) {
				this.$message.error('请先选择需要删除的用户！');
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
			this.$confirm('确认删除选中文章?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	        }).then(() => {
	        	this.$api.articleDelete({id: ids})
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