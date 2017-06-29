
Vue.component('ns-accfg-grid',{
	template: heredoc(function(){
		/*
<div class="grid">
<slot name="header"></slot>


<div>
	<table class="cbi-section-table" v-bind:id="tableId">
		<thead class="cbi-section-table-titles">
			<tr >
				<th v-if="multiSelect && checkKey" style="text-align: left;">
					<input type="checkbox" 
						v-bind:id="checkAllId"
						@change="setCurAll"
						v-model="selCurAll"
					/>
				</th>
				<th v-for="vth in header.text" style="text-align: left;" class="cbi-section-table-cell">
					{{vth}}
				</th>
				<th v-if="header.ops" style="text-align: left;" class="cbi-section-table-cell">
					{{header.opsText}}
				</th>
			</tr>
		</thead>
		<tbody v-if="isEmptyRows">
			<tr v-for="(row, index) in limitBy(rows, rowsLimit, rowsStart)">
				<td v-if="multiSelect && checkKey" style="text-align: left;">
					<input type="checkbox" 
						v-bind:value="checkRowGetValue(row)"
						v-model="selArr"
					>
					
				</td>
				<td v-for="vtd in header.keys" v-html="resetPage_td(vtd,row,row[vtd])">
					
				</td>
				<td v-if="header.ops">
					<template v-if="header.ops.edit">
						<router-link v-if="header.ops.edit.url" :to="{name : header.ops.edit.url , params: getParams( header.ops.edit.params, row, index)}" tag="button" v-bind:class="header.ops.edit.class">
							<i class="icon icon-pencil"></i>{{header.ops.edit.text}}
						</router-link>
						<button type="button" v-if="header.ops.edit.event" v-bind:class="header.ops.edit.class" v-on:click.stop.prevent="rowEdit(header.ops.edit, row, index)">
							<i class="icon icon-pencil"></i>{{header.ops.edit.text}}
						</button>
					</template>
					
					&nbsp;&nbsp;
					<button v-if="header.ops.delete" type="button"  v-bind:class="header.ops.delete.class" v-on:click.stop.prevent="rowDelete(header.ops.delete, row, index)">
						<i class="icon icon-remove"></i>{{header.ops.delete.text}}
					</button>
				</td>
			</tr>
		</tbody>
		<tbody v-else>
			<tr class="cbi-section-table-row">
				<td v-bind:colspan="colCount"><em>{{nullMsg}}</em></td>
			</tr>
		</tbody>
	</table>

</div>


<slot name="pager"></slot>
</div>
		*/
	}),
	props: {
		'tableId' : String,
		'multiSelect': {
			type: Boolean,
			default : true
		},
		'header': {
			type: Object,
			default: function() {
				return {
					'keys':[],
					'text':[]
				}
			}
				 
		},
		'rows': [Array,Object],
		'rowsStart': {
			type: Number,
			default: 0
		},
		'rowsLimit': {
			type: Number,
			default: 10
		},
		'checkedArr': Array,
		'checkKey': [String,Array],
		'colCallback': Object,
		'debug' : {
			type: Boolean,
			default: false
		}
	},
	data:function () {
		return {
			'nullMsg': Vue.t('message.noAnyConf'),
			'allChecked': false,
			'curArr':[],
			'selArr':this.checkedArr,
			'selCurAll': false
		}
	},
	created: function(){
		// this.selArr = this.checkedArr
		Bus.$on("pager-current-changed", this.currentPageChanged)
		//创建checkbox数组
	},
	computed: {
		isEmptyRows: function(){
			// console.log(this.rows)
			if(this.rows.length >0){
				return true
			}else{
				return false
			}
			
		},
		colCount: function(){
			return this.header.keys.length + (this.header.ops ? 1 : 0) + (this.multiSelect ? 1 : 0)
		},
		checkAllId: function(){
			return "grid_checkAll_"+this.tableId 
		}
	},
	methods: {
		setCurAll: function(e){
			var cur = this.selCurAll
			
			//勾选所有时，判断，当前页面所有的rows是否在大的arr中，如果没有，则添加或者删除。
			var com= this
			var cur_rows = this.limitBy(this.rows, this.rowsLimit, this.rowsStart)
			var isall_checked = true
			var copy_selArr = this.selArr.slice()
			
			var result= {}
			var check_val = {}
			cur_rows.forEach(function(row,index){
				check_val = com.checkRowGetValue(row)
				result=in_array(check_val, com.selArr)
				if(cur){
					if(!result.found){
						copy_selArr.push(check_val)
					}
				}else{
					if(result.found){
						com.debug && console.log("###反勾选,并找到了"+ check_val + ",索引号:" + result.index + ",删除后的索引为:"+ in_array(check_val, copy_selArr).index)
						copy_selArr.splice( in_array(check_val, copy_selArr).index, 1)
						
					}
				}
				
				
			})
			this.selArr = copy_selArr
		},
		checkRowGetValue: function(one_row){
			if(!this.multiSelect){
				return ""
			}
			//console.log(typeof(this.checkKey))
			if(this.checkKey == null || typeof(this.checkKey) == 'undefined'){
				return ""
			}else if(typeof(this.checkKey) == 'string'){
				return one_row[this.checkKey]
			}else if(typeof(this.checkKey) == 'array'){
				//TODO:未测试。可以设置同时勾选多个key
				var tmp_obj = {}
				var tmp_key = ""
				for(i=0;i<this.checkKey.length;i++){
					tmp_key = this.checkKey[i]
					tmp_obj[tmp_key] = one_row[tmp_key]
				}
				return tmp_obj
			} 
		},
		rowCheckId: function(idx){
			return "grid_row_check_"+this.tableId+'_'+ (this.rowsStart+idx)
		},
		checkRow: function(val,e){
			//勾选一个row
			if(e.target.checked){
				this.curArr.push(e.target.value)
			}else{
				this.curArr.pop(e.target.value)
			}
		},
		resetPage_td : function (key,obj,val){
//      	console.log(key)
        	if(this.colCallback == null || typeof(this.colCallback[key]) == 'undefined' && typeof(key) == 'string'){
				return val
			}else if ( this.colCallback == null || typeof(this.colCallback[key]) == 'undefined' && typeof(key) == 'object' ){
				var tmp_v = obj
				var tmp_k = ""
				var key_name = ""
//				console.log(obj)
//				console.log(key)
//				console.log("keyxxxxxxxxxxxxxxx")
				for(var ii in key){
					tmp_k = key[ii]
//					console.log(tmp_k)
					tmp_v = tmp_v[tmp_k]
				}
				key_name = key.join(".")
				
				if( this.colCallback[key_name]  && typeof(this.colCallback[key_name].cb) == 'function' ){
					return this.colCallback[key_name].cb(key_name, obj, tmp_v)
				}else{
					return tmp_v
				}
				
				
			}else if ( typeof(this.colCallback[key].cb) == 'function' ){
				return this.colCallback[key].cb(key,obj,val)
			}
        },
        currentPageChanged: function(tid, new_page){
        	if(tid == this.tableId){
        		this.debug && console.log("Table: [" + tid + "] current page to " + new_page)
				this.rowsStart = (new_page -1 ) * this.rowsLimit
				this.setCurrSelAll()
        	}
			
		},
		setCurrSelAll : function(){
			if(typeof(this.selArr) == 'undefined'){
				return false
			}
			var com= this
			var cur_rows = this.limitBy(this.rows, this.rowsLimit, this.rowsStart)
			var isall_checked = true
			cur_rows.forEach(function(row){
				if(! (in_array(com.checkRowGetValue(row), com.selArr).found) ){
					isall_checked = false
				}
				
			})
			this.debug &&  console.log("当前表格当前页面的全选为: " + isall_checked)
			this.selCurAll = isall_checked
		},
		getParams: function(obj, row, index){
			var new_obj={}
			for( i in obj){
			  var nkey=obj[i].key
			  var cval=obj[i].col
			  new_obj[nkey]=row[cval]
			}
			new_obj["index"]=index
			return new_obj
		},
		rowDelete: function(param,row,index){
			if(confirm("确认要删除该条 记录吗?")){
				console.log("delete-row" +  index)
				Bus.$emit('grid-row-delete', this.tableId, param, row, index)
			}
			
		},
		rowEdit: function(param,row,index){
			console.log("edit-row" +  index)
			Bus.$emit('grid-row-edit', this.tableId, param, row, index)
			
		}
	},
	watch:{
		selArr: function(val){
			// 通知外部勾选变化,并判断是否要勾选当前页面的所有
			this.setCurrSelAll()
			Bus.$emit('grid-checkedArr-change', val, this.tableId,"table component")
		},
		rowsStart: function(val){
			console.log(this.tableId + ": table start to "+this.rowsStart)
		},
		selCurAll: function(val){
			this.debug &&  console.log("当前表格当前页面的全选 changed to "+ val)
		}
	}
})



Vue.component('ns-accfg-pager',{
	template: heredoc(function(){
/*
<div>
  
    <div class="pagination pagination-right" style="margin-right: 20px;">
    	<div v-if="showJump" v-show="totalPage > 1" class="pager-jump"> 
            <span>{{$t("message.total")}}<em class="jump-total">{{totalPage}}</em></em>{{$t("message.pageNum")}}</span>
	    <span> &nbsp;{{$t("message.jumpPage")}} &nbsp;</span>
            <input type="number" min="1" v-bind:max="totalPage" v-model="jumpPage" class="jump-input" size="2"> 
            <span>{{$t("message.pageNum")}}</span> 
            <button @click="cbProxy($event,jumpPage)">{{$t("message.sureBtn")}}</button> 
        </div>
	    <ul  v-show='showPager'>
			<li  v-bind:class="[isDisabled('first', 1)? 'first disabled' : 'first']" >
	        	<a  v-bind='{title:getTitle("firstText"), style:"cursor:pointer;text-decoration:none;" }'
	           		@click='cbProxy($event,"first")'
	           	>
	            	{{firstText}}
	        	</a>
	    	</li>
	    	<li  v-bind:class="[isDisabled('prev', 1)? 'first disabled' : 'prev']" >
	        	<a v-bind='{title:getTitle("prevText"), style:"cursor:pointer;text-decoration:none;"}'
	           		@click='cbProxy($event,"prev")'
	           	>
	            	{{prevText}}
	        	</a>
	    	</li>
			<li v-for='page in pages'  v-bind:class="[page === currentPage? 'active' : '']">
				<a v-bind='{title:getTitle(page), style:"cursor:pointer;text-decoration:none;"}'
				 	@click='cbProxy($event,page)'
				>
				{{page}}
				</a>
			</li>
	    	<li  v-bind:class="[isDisabled('next', totalPage)? 'first disabled' : 'next']" >
	        	<a v-bind='{title:getTitle("nextText"), style:"cursor:pointer;text-decoration:none;"}'
	           		@click='cbProxy($event,"next")'
	           	>
	            	{{nextText}}
	        	</a>
	    	</li>
	    	<li  v-bind:class="[isDisabled('last', totalPage)? 'first disabled' : 'last']" >
	        	<a v-bind='{title:getTitle("lastText")}'
	           		@click='cbProxy($event,"last")'
	           	>
	            	{{lastText}}
	        	</a>
	    	</li>
		</ul>
		
	</div>
</div>
*/
	}),
	props:{
		'totalPage' : {
			type: Number,
			default: 1
		},
		'showPager' : {
			type: Boolean,
			default: true
		},
		'showJump' :{
			type: Boolean,
			default: true
		},
        'pager_prefixText': {
        	type: String,
        	default: 'Page'
        },
        'pager_suffixText': {
        	type: String,
        	default: ''
        },
        'buttons' : {
        	type: Object,
        	default: function(){
        		return {}
        	}
        },
		'showItems': {
			type: Number,
			coerce: function(val) {
                return parseInt(val);
            },
			default: 2
		},
		'refTableid': {
			type: String
		},
		'debug': {
			type: Boolean,
			default: true
		}
	},
	data: function(){
		return {
			rpage: /(?:#|\?)page\-(\d+)/,
			currentPage: 1,
			jumpPage: 1,
			'firstText': Vue.t('message.First'),
	        'prevText': Vue.t('message.Previous'),
	        'nextText': Vue.t('message.Next'),
	        'lastText': Vue.t('message.Last')
		}
	},
	computed: {
		pages: function(){

			var show_pages = []
			//假设show为5
		    var show = this.showItems
		    //假设total为10，或为20
		    var total = this.totalPage
		    //计算出一半是多少，如5/2=2
		    var half = Math.floor(show / 2)
		    //计算出打算起始的位置,如 8 - 2 + 1 -1 =6; 1 -2 +1 -1 = -1
		    var start = this.currentPage - half + 1 - show % 2
		    //计算出打算结束的位置,如 8 + 2 = 10; 1+ 2 = 3
		    var end = this.currentPage + half
		    // this.debug && console.log("beforre start:"+start + " end:"+ end + " show:" + show + " total:" + total)
		    // handle boundary case
		    if (start <= 0) {
		        start = 1;
		        end = show;
		    }
		    
		    // this.debug && console.log("after start:"+start + " end:"+ end + " show:" + show + " total:" + total)
		    if (end >= total) {
		    	start = total - show + 1
		    	if(start <=0){
		    		start = 1
		    	}
		        end = total
		    }


			for(i = start; i <= end; i++) { 
			    show_pages.push(i) 
			} 
			// this.debug && console.log(show_pages)
			return show_pages
		}
		
	},
	created: function(){
		this.debug &&  console.log("totalPage in component:" + this.totalPage)
	},
	methods: {
		jumpToPage: function(e,p){
			if (p === this.currentPage) {
                e.preventDefault()
                return //disabled, active不会触发
            }
            this.currentPage = this.toPage(p)
		},
		toPage: function (p) {
			var cur = this.currentPage
			var max = this.totalPage
			switch (p) {
				case 'first':
					return 1
				case 'prev':
					return Math.max(cur - 1, 0)
				case 'next':
					return Math.min(cur + 1, max)
				case 'last':
					return max
				default:
					return p
			}
		}, 
		getHref: function (a) {
			return '#page-' + this.toPage(a)
		},
		getTitle: function (title) {
			return this[title]
		},
		isDisabled: function(name, page){
			 return this.buttons[name] = (this.currentPage === page)
		},
		cbProxy: function (e, p) {
			//点击时，判断是否可以进行默认动作
			//如果可以,则变化状态
            if (this.buttons[p] || p === this.currentPage) {
                e.preventDefault()
                return //disabled, active不会触发
            }
            this.currentPage = this.toPage(p)
            this.debug &&  console.log("click: currentPage changed to "+ this.currentPage)
           
        }

	},
	watch: {
		currentPage : function(){
			this.debug && console.log("Watch: currentPage changed to " + this.currentPage + " refence with "+ this.refTableid)
			Bus.$emit("pager-current-changed", this.refTableid, this.currentPage)
		}
	}
})