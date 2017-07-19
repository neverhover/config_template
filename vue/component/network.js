var network_templ = function() {
	var ether_main = Vue.component("ether_main",{
		template: `
			<div>

				<div>
					<ns-accfg-grid
						:table-id=tableId
						:header=header
						:rows=rows
						:col-callback=colCallbacks
						:rows-start=pStart
						:rows-limit=pLimit
						ref="ref_grid_ether_list"
					>
					<ns-accfg-pager
						slot="pager"
						:show-pager=true
						:total-page=pTotal
						:show-items=4
						:ref-tableid=tableId
						ref="ref_pager_ether_list"
					>
					</ns-accfg-pager>
					</ns-accfg-grid>
				</div>
			</div>
		`,
		data:function(){
			return {
				tableId:"grid_ether_list",
				header:{
					keys:[
						["ifname","value"],
						["ifindex","value"],
						["enable","value"],
						["uplink","value"]
					],
					text:[
						Vue.t('message.interfaceName'),
						Vue.t('message.interfaceIndex'),
						Vue.t('message.whetherEnable'),
						Vue.t('message.whetherLinked')
					]
				},
				colCallbacks: {

					"enable.value":{
						cb:function(key,obj,val){

			        		if(val == true){
			        			return Vue.t('message.startUsing')
			        		}else{
			        			return Vue.t('message.endUsing')
					        }
						}
					},
					"uplink.value":{
						cb:function(key,obj,val){

			        		if( val == true){
			        			return Vue.t('message.alliedMouth')
			        		}else{
			        			return Vue.t('message.partOfMouth')
					        }
						}
					}
				},
				pStart: 0,
				pLimit: 8,
				pTotal: 1
			}
		},
		computed:{
			rows: function(){
				//类数组转换成数组
				return sliceArray(this.$store.getters.network.ethernet,0)
			}
		},
		created: function(){
			this.pTotal = Math.ceil(this.rows.length / this.pLimit)
		}


	})
	//关心整体个数
	var tc_main = Vue.component("tc_main",{
		template: `
			<div>
				<router-link :to="{name : 'net_tc_new'}" tag="a" class="btn btn-primary">
					<i class="icon icon-plus">{{$t("message.newRules")}}</i>
				</router-link>

				<div>
					<ns-accfg-grid
						:table-id=tableId
						:header=header
						:rows=rows
						:col-callback=colCallbacks
						:rows-start=pStart
						:rows-limit=pLimit
						ref="ref_grid_tc_list"
					>
					<ns-accfg-pager
						slot="pager"
						:show-pager=true
						:total-page=pTotal
						:show-items=4
						:ref-tableid=tableId
						ref="ref_pager_tc_list"
					>
					</ns-accfg-pager>
					</ns-accfg-grid>
				</div>
			</div>
		`,
		data:function(){
			return {
				tableId:"grid_tc_list",
				header:{
				keys:[
					"interface",
					"enabled",
					["egress","speed"],
					["ingress","speed"]
				],
				text:[
					Vue.t('message.interfaceName'),
					Vue.t('message.whetherEnable'),
					Vue.t('message.uploadSpeed'),
					Vue.t('message.downloadSpeed')
				],
				ops: {
					"edit":{
						"url": 'net_tc_edit',
						"text": Vue.t('message.redact'),
						"params": [
							{
								"key": "id",
								"col": "interface"
							}
						],
						"class": "btn btn-primary"
					},
					"delete":{
						"text": Vue.t('message.delete'),
						"params": [
						],
						"class": "btn btn-danger"
					}
				},
				opsText: Vue.t('message.handle')
			},
			colCallbacks: {

				"enabled":{
					cb:function(key,obj,val){

		        		if(obj[key] == 1){
		        			return Vue.t('message.startUsing')
		        		}else{
		        			return Vue.t('message.endUsing')
				        }
					}
				}
			},
			pStart: 0,
			pLimit: 8,
			pTotal: 1
			}
		},
		computed:{
			rows: function(){
				//类数组转换成数组
//				console.log(this.$store.getters.network.trafficcontrol)
//				console.log(sliceArray(this.$store.getters.network.trafficcontrol,1))
				return sliceArray(this.$store.getters.network.trafficcontrol,1)
			}
		},
		created: function(){
			this.pTotal = Math.ceil(this.rows.length / this.pLimit)
			Bus.$on('grid-row-delete', this.delRow)
		},
		methods:{
			delRow: function(tid,param,row,index){

				if(tid == this.tableId){
					var this_idx = (parseInt(index)+1).toString()
					//触发state删除数据,index一定记得+1,因为0被忽略了
					this.$store.commit('tcRowUpdate', {
						"key": this_idx,
						"action": "delete",
						"value": ""
					})
				}
			},
		},
		beforeRouteEnter : function(to, from, next){


			next(function(vm){

				if(vm.$store.getters.network && vm.$store.getters.network.trafficcontrol){
					vm.cur_obj= vm.$store.getters.network.trafficcontrol
				}

				return true
			})
		}


	})
	var tc_form = Vue.component("tc_form",{
		template: `
			<transition name="custom-classes-transition"
				    enter-active-class="animated fadeInUp"
	    			leave-active-class="animated fadeOutDown"
				>
				<div>
					{{cur_mode}}{{title}}

					<br>

					<div class="row-fluid" v-if="nodeExist(cur_obj.enabled)" v-show="nodeShow(cur_obj.enabled)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.whetherEnable")}}:</label>
							<div class="cbi-value-field">
								<select class="cbi-input-select" v-model="cur_obj.enabled.value"
								>
									<option v-bind:value="true">{{$t("message.startUsing")}}</option>
									<option v-bind:value="false">{{$t("message.endUsing")}}</option>
								</select>
							</div>


						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.interface)" v-show="nodeShow(cur_obj.interface)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.interfaceName")}}:</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.interface)"
								:data-vv-as="$t('message.interfaceName')" name="interfaceName"
								v-model="cur_obj.interface.value" v-bind:readonly="mode == 'new'? false: true"
								/>
								<div class="text-error" v-show="errors.has('interfaceName')">
									{{ errors.first('interfaceName') }}
								</div>
							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.egress)" v-show="nodeShow(cur_obj.egress)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title">{{$t("message.egress")}}</label>
							<div class="cbi-value-field">
								<input type="text" class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.egress)"
					          	:data-vv-as="$t('message.egress')" name="egress"
								v-model="cur_obj.egress.value.speed.value"
								/>
								<div class="text-error" v-show="errors.has('egress')">
									{{ errors.first('egress') }}
								</div>
							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.ingress)" v-show="nodeShow(cur_obj.ingress)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.ingress")}}</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.ingress)"
								:data-vv-as="$t('message.ingress')" name="ingress"
								v-model="cur_obj.ingress.value.speed.value"
								/>
								<div class="text-error" v-show="errors.has('ingress')">
									{{ errors.first('ingress') }}
								</div>
							</div>
						</div>
						<div class="span6"></div>
					</div>



					<input type="button" v-bind:value="saveText" class="btn btn-info" v-on:click="subFromSave('net_tc_list')"/>

					<router-link :to="{name : 'net_tc_list'}" tag="button" class="btn btn-info">
						{{cacelText}}
					</router-link>
				</div>
			</transaction>
		`,
		data: function(){
			return {
				"saveText": Vue.t('message.saveBack'),
				"cacelText": Vue.t('message.cancel'),
				"title": Vue.t('message.flowControlRules'),
				"newText": Vue.t('message.newConstruction'),
				"editText":  Vue.t('message.redact'),
				"mode": "new"
			}
		},
		computed:{
			edit_obj: function(){
				//0为table的模版
				//index为数组的索引号,id为接口名称,表示唯一值
				//创建一个新的对象,以免污染原模版对象
				var idx=(parseInt(this.$route.params.index)+1).toString()
				var trow=this.$store.getters.network.trafficcontrol[idx]
				var row={}

				if(trow){
					row = myclone(trow)
				}else{
					row = null
				}

				return row
			},
			templ_obj: function(){
				var tmp = myclone(this.$store.getters.network.trafficcontrol[0])

				return tmp
			},
			cur_mode: function(){
				if(this.edit_obj){
					this.mode = "update"
					return this.editText
				}else{
					this.mode = "new"
					return this.newText
				}
			},
			cur_obj: function(){
				var tmp = myclone(this.$store.getters.network.trafficcontrol[0])
				var idx=(parseInt(this.$route.params.index)+1).toString()
				var trow=this.$store.getters.network.trafficcontrol[idx]
				var row={}

				if(trow){
					row = myclone(trow)
				}else{
					row = null
				}


				delete tmp.$template

				return mix_object(tmp, row, {})

			}
		},
		methods:{
			subFromSave: function(url){
				//保存前无论是新建还是编辑,需要唯一判断

				var test={"interface": this.cur_obj.interface.value}
				var pass=uniqueTest(mystore.getters.network.trafficcontrol, test, this.mode)
				if(!pass){
					alert(Vue.t('message.intNameNotOnly'))
					return false
				}
				var idx = -1
				if(this.mode == "new"){
					idx = 0
				}else{
					idx=(parseInt(this.$route.params.index)+1).toString()
				}

				console.log(idx)
				console.log(this.cur_obj)
				//触发state删除数据,index一定记得+1,因为0被忽略了
				this.$store.commit('tcRowUpdate', {
					"key": idx,
					"action": this.mode,
					"value": this.createRow(this.cur_obj)
				})

				this.$router.push({name : 'net_tc_list'})
//				console.log("----> "+ url)

			},
			createRow : function(new_obj){
				var want={}
				want = {
					"interface": new_obj.interface.value,
					"enabled": new_obj.enabled.value,
					"egress":{
						"speed": new_obj.egress.value.speed.value
					},
					"ingress":{
						"speed": new_obj.ingress.value.speed.value
					}
				}
				return want
			},
			// v-if=" nodeExist(cur_obj.sys_syslog.level) "
			nodeExist: function(cur_obj){
				//判断cur_obj是否存在，不存在返回false，存在不做任何操作
				var exist= true ;
				if( typeof(cur_obj)== 'undefined' ){
					return exist=false
				}
				return exist
			},
			//v-show=" nodeShow(cur_obj.sys_syslog.level) "
			nodeShow: function(cur_obj){
				// 判断cur_obj中的spec属性中的内容 或者 cur_obj中spec属性中的show 是否要显示,不显示赋值为true，只显示spec以外的内容；
				// 如果显示 不做任何操作，显示spec中的内容就可以了
				//json 中-->做数据的显示/隐藏 show：true/false
				var show_exist ;

				if( typeof(cur_obj.spec) == 'undefined' || typeof(cur_obj.spec.show) == 'undefined'){
					show_exist = true
				}else {
					show_exist = cur_obj.spec.show
				}
				return show_exist
			},
			// 验证
			nodeValidate: function(cur_obj){
				var myRule= "required";
				// console.log("cur_obj.type:"+cur_obj.type);
				var is_first = false;
				if( typeof(cur_obj.type) == 'undefined' ){
					//判断是否定义了数据类型，如果未定义，返回空字符串
					return "";
				}
				if( typeof(cur_obj.spec) == 'undefined' ){
					//未定义spec，无法执行后续逻辑
					return "";
				}

				//判断是否是number
				if( cur_obj.type == 'number' ) {
					//port-->如果是number，那么根据range组合出字符串,表示数字的取值范围
					if (typeof(cur_obj.spec.range) != 'undefined') {
						//myRule:  between:3,8
						if (!is_first) {
							myRule += "|"
						} else {
							is_first = true;
						}
						myRule += "between:" + cur_obj.spec.range.min + "," + cur_obj.spec.range.max
						// console.log(myRule)
					}

				}else if( cur_obj.type == 'string' ){//判断是否是string

					//如果是string，那么根据range组合出字符串，.表示字符串的长度
					if(typeof(cur_obj.spec.range) != 'undefined'){
						//myRule:  min:必须至少有 3 字符,max:不能大于 8 字符

						if( ! is_first){
							myRule +="|"
						}else{
							is_first = false
						}
						myRule += "min:"+cur_obj.spec.range.min+"|max:"+cur_obj.spec.range.max
						// console.log(myRule)
					}

				}else if( cur_obj.type == 'object' ){//判断是否是object

					//port-->如果是object，那么根据range组合出字符串,表示数字的取值范围
					if (typeof(cur_obj.value.speed.range) != 'undefined') {
						//myRule:  between:3,8
						if (!is_first) {
							myRule += "|"
						} else {
							is_first = true;
						}
						myRule += "between:" + cur_obj.value.speed.range.min + "," + cur_obj.value.speed.range.max
						// console.log(myRule)
					}

				}else{//判断是否存在必填项

					if( typeof(cur_obj.spec.required) != 'undefined'){

						if( ! is_first){
							myRule +="|"
						}else{
							is_first = false
						}
						myRule += "required"
					}
				}
				console.log(myRule)
				//其他判断
				return myRule
			}
		}
	})

	//关心整体个数
	var route_main = Vue.component("route_main",{
		template: `
			<div>
				<router-link :to="{name : 'net_route_new'}" tag="a" class="btn btn-primary">
					<i class="icon icon-plus">{{$t("message.newRules")}}</i>
				</router-link>

				<div>
					<ns-accfg-grid
						:table-id=tableId
						:header=header
						:rows=rows
						:col-callback=colCallbacks
						:rows-start=pStart
						:rows-limit=pLimit
						ref="ref_grid_route_list"
					>
					<ns-accfg-pager
						slot="pager"
						:show-pager=true
						:total-page=pTotal
						:show-items=4
						:ref-tableid=tableId
						ref="ref_pager_route_list"
					>
					</ns-accfg-pager>
					</ns-accfg-grid>
				</div>
			</div>
		`,
		data:function(){
			return {
				tableId:"grid_route_list",
				header:{
				keys:[
					"enabled",
					"name",
					"interface",
					"dstnet",
					"netmask",
					"gateway",
					"metric",
					"mtu"
				],
				text:[
					Vue.t('message.whetherEnable'),
					Vue.t('message.rulesOfName'),
					Vue.t('message.interface'),
					Vue.t('message.purposeNetwork'),
					Vue.t('message.objectiveMask'),
					Vue.t('message.nextHop'),
					"metric",
					Vue.t('message.mtu')
				],
				ops: {
					"edit":{
						"url": 'net_route_edit',
						"text": Vue.t('message.redact'),
						"params": [
							{
								"key": "id",
								"col": "name"
							}
						],
						"class": "btn btn-primary"
					},
					"delete":{
						"text": Vue.t('message.delete'),
						"params": [
						],
						"class": "btn btn-danger"
					}
				},
				opsText: Vue.t('message.handle')
			},
			colCallbacks: {

				"enabled":{
					cb:function(key,obj,val){

		        		if(obj[key] == true){
		        			return Vue.t('message.startUsing')
		        		}else{
		        			return Vue.t('message.endUsing')
				        }
					}
				}
			},
			pStart: 0,
			pLimit: 8,
			pTotal: 1
			}
		},
		computed:{
			rows: function(){
				//类数组转换成数组
				return sliceArray(this.$store.getters.network.route,1)
			}
		},
		created: function(){
			var tmp = Math.ceil(this.rows.length / this.pLimit)
			if(tmp == 0){
				tmp = 1
			}
			this.pTotal = tmp
			Bus.$on('grid-row-delete', this.delRow)
		},
		methods:{
			delRow: function(tid,param,row,index){

				if(tid == this.tableId){
					var this_idx = (parseInt(index)+1).toString()
					//触发state删除数据,index一定记得+1,因为0被忽略了
					this.$store.commit('routeRowUpdate', {
						"key": this_idx,
						"action": "delete",
						"value": ""
					})
				}
			},
		},
		beforeRouteEnter : function(to, from, next){


			next(function(vm){

				if(vm.$store.getters.network && vm.$store.getters.network.route){
					vm.cur_obj= vm.$store.getters.network.route
				}

				return true
			})
		}


	})
	var route_form = Vue.component("route_form",{
		template: `
			<transition name="custom-classes-transition"
				    enter-active-class="animated fadeInUp"
	    			leave-active-class="animated fadeOutDown"
				>
				<div>
					{{cur_mode}}{{title}}

					<br>

					<div class="row-fluid" v-if="nodeExist(cur_obj.enabled)" v-show="nodeShow(cur_obj.enabled)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.whetherEnable")}}</label>
							<div class="cbi-value-field">
								<select class="cbi-input-select" v-model="cur_obj.enabled.value"
								>
									<option v-bind:value="true">{{$t("message.startUsing")}}</option>
									<option v-bind:value="false">{{$t("message.endUsing")}}</option>
								</select>
							</div>

						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.name)" v-show="nodeShow(cur_obj.name)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.rulesOfName")}}</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.name)"
								:data-vv-as="$t('message.rulesOfName')" name="name"
								v-model="cur_obj.name.value"
								/>
								<div class="text-error" v-show="errors.has('name')">
									 {{ errors.first('name') }}
								</div>

							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.interface)" v-show="nodeShow(cur_obj.interface)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.interfaceName")}}</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.interface)"
								:data-vv-as="$t('message.interfaceName')" name="interface"
								v-model="cur_obj.interface.value"
								/>
								<div class="text-error" v-show="errors.has('interface')">
									 {{ errors.first('interface') }}
								</div>
							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.dstnet)" v-show="nodeShow(cur_obj.dstnet)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.purposeNetwork")}}</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.dstnet)"
								:data-vv-as="$t('message.purposeNetwork')" name="dstnet"
								v-model="cur_obj.dstnet.value"
								/>
								<div class="text-error" v-show="errors.has('dstnet')">
									 {{ errors.first('dstnet') }}
								 </div>
							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.netmask)" v-show="nodeShow(cur_obj.netmask)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.objectiveMask")}}</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.netmask)"
								:data-vv-as="$t('message.objectiveMask')" name="netmask"
								v-model="cur_obj.netmask.value"
								/>
								<div class="text-error" v-show="errors.has('netmask')">
									 {{ errors.first('netmask') }}
								</div>
							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid"  v-if="nodeExist(cur_obj.gateway)" v-show="nodeShow(cur_obj.gateway)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >{{$t("message.nextHop")}}</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.gateway)"
								:data-vv-as="$t('message.nextHop')" name="gateway"
								v-model="cur_obj.gateway.value"
								/>
								<div class="text-error" v-show="errors.has('gateway')">
									 {{ errors.first('gateway') }}
								 </div>
							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.metric)" v-show="nodeShow(cur_obj.metric)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >metric</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.metric)"
								:data-vv-as="cur_obj.metric.key" name="metric"
								v-model="cur_obj.metric.value"
								/>
								<div class="text-error" v-show="errors.has('metric')">
									 {{ errors.first('metric') }}
								 </div>
							</div>
						</div>
						<div class="span6"></div>
					</div>

					<div class="row-fluid" v-if="nodeExist(cur_obj.mtu)" v-show="nodeShow(cur_obj.mtu)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" >mtu:</label>
							<div class="cbi-value-field">
								<input type="text"  class="cbi-input-text"
								v-validate.initial :data-vv-rules="nodeValidate(cur_obj.mtu)"
								:data-vv-as="cur_obj.mtu.key" name="mtu"
								v-model="cur_obj.mtu.value"
								/>
								<div class="text-error" v-show="errors.has('mtu')">
									 {{ errors.first('mtu') }}
								 </div>
							</div>
						</div>
						<div class="span6"></div>
					</div>





					<input type="button" v-bind:value="saveText" class="btn btn-info" v-on:click="subFromSave('net_route_list')"/>

					<router-link :to="{name : 'net_route_list'}" tag="button" class="btn btn-info">
						{{cacelText}}
					</router-link>
				</div>
			</transaction>
		`,
		data: function(){
			return {
				"saveText": Vue.t('message.saveBack'),
				"cacelText": Vue.t('message.cancel'),
				"title": Vue.t('message.routingRules'),
				"newText": Vue.t('message.newConstruction'),
				"editText": Vue.t('message.redact'),
				"mode": "new"
			}
		},
		computed:{
			edit_obj: function(){
				//0为table的模版
				//index为数组的索引号,id为接口名称,表示唯一值
				//创建一个新的对象,以免污染原模版对象
				var idx=(parseInt(this.$route.params.index)+1).toString()
				var trow=this.$store.getters.network.route[idx]
				var row={}

				if(trow){
					row = myclone(trow)
				}else{
					row = null
				}

				return row
			},
			templ_obj: function(){
				var tmp = myclone(this.$store.getters.network.route[0])
				return tmp
			},
			cur_mode: function(){
				if(this.edit_obj){
					this.mode = "update"
					return this.editText
				}else{
					this.mode = "new"
					return this.newText
				}
			},
			cur_obj: function(){
				var tmp = myclone(this.$store.getters.network.route[0])
				var idx=(parseInt(this.$route.params.index)+1).toString()
				var trow=this.$store.getters.network.route[idx]
				var row={}

				if(trow){
					row = myclone(trow)
				}else{
					row = null
				}

				delete tmp.$template

				return mix_object(tmp, row, {})
			}
		},
		methods:{
			subFromSave: function(url){
				//保存前无论是新建还是编辑,需要唯一判断
				var test={"name": this.cur_obj.name.value}
				var pass=uniqueTest(mystore.getters.network.route, test, this.mode)
				if(!pass){
					alert(Vue.t('message.ruleNameNotOnly'))
					return false
				}
				var idx = -1
				if(this.mode == "new"){
					idx = 0
				}else{
					idx=(parseInt(this.$route.params.index)+1).toString()
				}
				var idx = -1
				if(this.mode == "new"){
					idx = 0
				}else{
					idx=(parseInt(this.$route.params.index)+1).toString()
				}

				// console.log(idx)
				// console.log(this.cur_obj)
				//触发state删除数据,index一定记得+1,因为0被忽略了
				this.$store.commit('routeRowUpdate', {
					"key": idx,
					"action": this.mode,
					"value": this.createRow(this.cur_obj)
				})

				this.$router.push({name : url})
//				console.log("----> "+ url)

			},
			createRow : function(new_obj){
				var want={}
				want = {
					"name": new_obj.name.value,
					"enabled": new_obj.enabled.value,
					"interface": new_obj.interface.value,
					"dstnet": new_obj.dstnet.value,
					"netmask": new_obj.netmask.value,
					"gateway": new_obj.gateway.value,
					"metric": new_obj.metric.value,
					"mtu": new_obj.mtu.value
				}
				return want
			},
			// v-if=" nodeExist(cur_obj.sys_syslog.level) "
			nodeExist: function(cur_obj){
				//判断cur_obj是否存在，不存在返回false，存在不做任何操作
				var exist= true ;
				if( typeof(cur_obj)== 'undefined' ){
					return exist=false
				}
				return exist
			},
			//v-show=" nodeShow(cur_obj.sys_syslog.level) "
			nodeShow: function(cur_obj){
				// 判断cur_obj中的spec属性中的内容 或者 cur_obj中spec属性中的show 是否要显示,不显示赋值为true，只显示spec以外的内容；
				// 如果显示 不做任何操作，显示spec中的内容就可以了
				//json 中-->做数据的显示/隐藏 show：true/false
				var show_exist ;

				if( typeof(cur_obj.spec) == 'undefined' || typeof(cur_obj.spec.show) == 'undefined'){
					show_exist = true
				}else {
					show_exist = cur_obj.spec.show
				}
				return show_exist
			},
			// 验证
			nodeValidate: function(cur_obj){
				var myRule= "";

				var is_first = true;
				// return 'required'
				if( typeof(cur_obj.type) == 'undefined' ){
					//判断是否定义了数据类型，如果未定义，返回空字符串
					return "";
				}
				if( typeof(cur_obj.spec) == 'undefined' ){
					//未定义spec，无法执行后续逻辑
					return "";
				}

				//判断是否是number
				if( cur_obj.type == 'number' ) {
					//port-->如果是number，那么根据range组合出字符串,表示数字的取值范围
					if (typeof(cur_obj.spec.range) != 'undefined') {
						//myRule:  between:3,8
						if (!is_first) {
							myRule += "|"
						} else {
							is_first = true;
						}
						myRule += "between:" + cur_obj.spec.range.min + "," + cur_obj.spec.range.max;
						// console.log(myRule)
					}

				}else if( cur_obj.type == 'string' ){//判断是否是string

					//如果是string，那么根据range组合出字符串，.表示字符串的长度
					if(typeof(cur_obj.spec.range) != 'undefined'){
						//myRule:  min:必须至少有 3 字符,max:不能大于 8 字符

						if( ! is_first){
							myRule +="|"
						}else{
							is_first = false
						}
						myRule += "min:"+cur_obj.spec.range.min+"|max:"+cur_obj.spec.range.max;
						// console.log(myRule)
					}

				}else if( cur_obj.type == 'object' ){//判断是否是object

					//port-->如果是object,指出对象的取值范围
					if (typeof(cur_obj.value.speed.range) != 'undefined') {
						//myRule:  between:3,8
						if (!is_first) {
							myRule += "|"
						} else {
							is_first = true;
						}
						myRule += "between:" + cur_obj.value.speed.range.min + "," + cur_obj.value.speed.range.max;
						// console.log(myRule)
					}

				}else if( cur_obj.type == 'ipv4_address' ){//判断是否是ip

					//port-->如果是ip，那么根据ipv4_address规则限制必须符合ip地址要求
					if (typeof(cur_obj.value) != 'undefined') {
						//myRule:  between:3,8
						if (!is_first) {
							myRule += "|"
						} else {
							is_first = true;
						}
						myRule += "ip";
						// console.log(myRule)
					}

				}else{
					//判断是否存在必填项
					if( typeof(cur_obj.spec.required) != 'undefined'){

						if( ! is_first){
							myRule +="|"
						}else{
							is_first = false
						}
						myRule += "required"
					}

				}

				//其他判断
				return myRule

			}
		}
	})


	return {
		ether_main: ether_main,
		tc_main: tc_main,
		tc_form: tc_form,
		route_main: route_main,
		route_form: route_form
	}
}()

//路由条目
const network_routes = [{
	path: '/accfg/network/ethernet',
	name: 'net_ether_list',
	component: network_templ.ether_main
}, {
	path: '/accfg/network/trafficcontrol',
	name: 'net_tc_list',
	component: network_templ.tc_main
}, {
	path: '/accfg/network/trafficcontrol/form/:id',
	name: 'net_tc_edit',
	component: network_templ.tc_form
}, {
	path: '/accfg/network/trafficcontrol/form/',
	name: 'net_tc_new',
	component: network_templ.tc_form
}, {
	path: '/accfg/network/interface',
	name: 'net_interface_list',
	component: interface_templ.interface_main
}, {
	path: '/accfg/network/interface/form/:id',
	name: 'net_interface_edit',
	component: interface_templ.interface_form
}, {
	path: '/accfg/network/interface/form/',
	name: 'net_interface_new',
	component: interface_templ.interface_form
},  {
	path: '/accfg/network/route',
	name: 'net_route_list',
	component: network_templ.route_main
}, {
	path: '/accfg/network/route/form/:id',
	name: 'net_route_edit',
	component: network_templ.route_form
}, {
	path: '/accfg/network/route/form/',
	name: 'net_route_new',
	component: network_templ.route_form
}, {
	path: '/accfg/network/switch',
	name: 'net_switch_list',
	component: switch_templ.switch_main
}, {
	path: '/accfg/network/switch/form/:id',
	name: 'net_switch_edit',
	component: switch_templ.switch_form
}, {
	path: '/accfg/network/switch/form/',
	name: 'net_switch_new',
	component: switch_templ.switch_form
}
]

//路由器
const network_router = new VueRouter({
	routes: network_routes
})

//网络组件
Vue.component('ns-accfg-network', {
	template: heredoc(function() {
		/*
		<div v-bind:class="[cur_active ? 'tab-pane active' : 'tab-pane']" v-if="isRender">
			<ul class="cbi-tabmenu">

				<router-link
					:to="{name : 'net_ether_list'}"
					tag="li" active-class='cbi-tab'
					v-if="data_obj.ethernet">
					<a href="javascript:void(0);">{{$t("message.ethPortInfo")}}</a>
				</router-link>




				<router-link
					:to="{name : 'net_tc_list' }"
					tag="li" active-class='cbi-tab'
					v-if="data_obj.trafficcontrol"
					>
					<a href="javascript:void(0);">{{$t("message.fluidControl")}}</a>
				</router-link>


				<router-link
					:to="{name : 'net_interface_list'}"
					tag="li" active-class='cbi-tab'
					v-if="data_obj.interface"
					>
					<a href="javascript:void(0);">{{$t("message.interface")}}</a>
				</router-link>

				<router-link
					:to="{name : 'net_tc_list'}"
					tag="li" active-class='cbi-tab'
					v-if="data_obj.l2tp_client"
					>
					<a href="javascript:void(0);">{{$t("message.L2TPClient")}}</a>
				</router-link>

				<router-link
					:to="{name : 'net_route_list'}"
					tag="li" active-class='cbi-tab'
					v-if="data_obj.route"
					>
					<a href="javascript:void(0);">{{$t("message.routeConf")}}</a>
				</router-link>

				<router-link
					:to="{name : 'net_switch_list'}"
					tag="li" active-class='cbi-tab'
					v-if="data_obj.switch"
					>
					<a href="javascript:void(0);">{{$t("message.switchConf")}}</a>
				</router-link>


			</ul>
			<transition name="custom-classes-transition"
			    enter-active-class="animated fadeInUp"
    			leave-active-class="animated fadeOutDown"
			>
				<router-view></router-view>
			</transition>
		</div>
		<div v-else v-bind:class="[cur_active ? 'tab-pane active' : 'tab-pane']">
			{{null_msg}}

		</div>
		*/
	}),
	props: {
		'data_obj': Object,
		'cur_active': Boolean,

	},
	data: function() {
		return {
			null_msg: Vue.t('message.nullMsg'),
			cur_sel: 0
		}
	},
	created: function(){
//		this.$router.push({name : 'net_tc_list'})

	},
	computed: {
		isRender: function() {
			return !isEmptyObject(this.data_obj)
		}
	},
	methods: {
		subFromSave: function(url){
			console.log('will jump to '+ url)
		}
	},
	watch: {
		$route: function(a){
			//监听路由变化
//			console.log(a)
		}
	}
})
