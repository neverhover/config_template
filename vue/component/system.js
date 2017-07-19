Vue.component('ns-accfg-system',{
	template: heredoc(function () {
		/*
		<div v-bind:class="[cur_active ? 'tab-pane active' : 'tab-pane']" v-if="isRender">
			<ul class="cbi-tabmenu">

				<li  	v-if="nodeExist(data_obj.tun_syslog)"
					v-bind:class="[isShowSubTab('tun_syslog')? 'cbi-tab' : 'cbi-tab-disabled']"
					v-on:click="changeSubTab('tun_syslog')">
					<a href="javascript:void(0);">{{$t("message.tunnelProxyLog")}}</a>
				</li>
				<li  	v-if="nodeExist(data_obj.sys_syslog)"
					v-bind:class="[isShowSubTab('sys_syslog')? 'cbi-tab' : 'cbi-tab-disabled']"
					v-on:click="changeSubTab('sys_syslog')">
					<a href="javascript:void(0);">{{$t("message.systemLog")}}</a>
				</li>
			</ul>
			<div class="cbi-section-node cbi-section-node-tabbed">
				<div class="cbi-tabcontainer" v-if="nodeExist(data_obj.tun_syslog)"  v-show="isShowSubTab('tun_syslog')" >
					<!-- @@tun_syslog.enabled -->
				    <div class="row-fluid" v-if="nodeExist(data_obj.tun_syslog.enabled)" v-show="nodeShow(data_obj.tun_syslog.enabled)">
				        <div class="span6 cbi-value">
				            <label class="cbi-value-title"
				                v-bind:for="'tun_syslog-'+ data_obj.tun_syslog.enabled.key">
				                {{$t("message.enableTunnelLog")}}
				            </label>
				            <div class="cbi-value-field">
				                <select class="cbi-input-select"
				                	v-model="data_obj.tun_syslog.enabled.value"
				                	v-bind:id="'tun_syslog-'+ data_obj.tun_syslog.enabled.key"
				                >
				                    <option v-bind:value="true">{{$t("message.startUsing")}}</option>
				                    <option v-bind:value="false">{{$t("message.endUsing")}}</option>
				                </select>
				            </div>
				        </div>
				        <div class="span6">

				        </div>
				    </div>
				    <!-- @@tun_syslog.ipaddr -->
				    <div class="row-fluid" v-if="nodeExist(data_obj.tun_syslog.ipaddr)" v-show="nodeShow(data_obj.tun_syslog.ipaddr)">
				        <div class="span6 cbi-value">
				            <label class="cbi-value-title"
				                v-bind:for="'tun_syslog-'+ data_obj.tun_syslog.ipaddr.key">
				                {{$t("message.listenOnAddress")}}
				            </label>
				            <div class="cbi-value-field">
				                <input type="text" class="cbi-input-text"
							v-validate.initial :data-vv-rules="nodeValidate(data_obj.tun_syslog.ipaddr)"
		 					:data-vv-as="$t('message.listenOnAdd')" name="ipaddress"
				                	v-bind:id="'tun_syslog-'+ data_obj.tun_syslog.ipaddr.key"
				                	v-model="data_obj.tun_syslog.ipaddr.value"
				                />
				                <div class="text-error" v-show="errors.has('ipaddress')">
		 							{{ errors.first('ipaddress') }}
				                 </div>
				            </div>
				        </div>
				        <div class="span6">

				        </div>
				    </div>
				    <!-- @@tun_syslog.port -->
				    <div class="row-fluid" v-if="nodeExist(data_obj.tun_syslog.port)" v-show="nodeShow(data_obj.tun_syslog.port)">
				        <div class="span6 cbi-value">
				            <label class="cbi-value-title"
				            	v-bind:for="'tun_syslog-'+ data_obj.tun_syslog.port.key"
				            >
				                {{$t("message.portNumber")}}
				            </label>
				            <div class="cbi-value-field">
				            	<input type="text" class="cbi-input-text"
								    v-validate.initial :data-vv-rules="nodeValidate(data_obj.tun_syslog.port)"
		 								:data-vv-as="$t('message.portNumb')" name="portNum"
				                	v-bind:id="'tun_syslog-'+ data_obj.tun_syslog.port.key"
				                	v-model.number="data_obj.tun_syslog.port.value"
				                />
					            <div class="text-error" v-show="errors.has('portNum')">
		 							{{ errors.first('portNum') }}
					            </div>

				            </div>
				        </div>
				        <div class="span6">

				        </div>
				    </div>
				</div>
				<div class="cbi-tabcontainer" v-if="nodeExist(data_obj.sys_syslog)" v-show="isShowSubTab('sys_syslog')" >
					<!-- @@sys_syslog.enabled -->
				    <div class="row-fluid" v-if="nodeExist(data_obj.sys_syslog.enabled)" v-show="nodeShow(data_obj.sys_syslog.enabled)">
				        <div class="span6 cbi-value">
				            <label class="cbi-value-title"
				                v-bind:for="'sys_syslog-'+ data_obj.sys_syslog.enabled.key">
				                {{$t("message.enableSystemLog")}}
				            </label>
				            <div class="cbi-value-field">
				                <select class="cbi-input-select"
				                	v-model="data_obj.sys_syslog.enabled.value"
				                	v-bind:id="'sys_syslog-'+ data_obj.sys_syslog.enabled.key"
				                >
				                    <option v-bind:value="true">{{$t("message.startUsing")}}</option>
				                    <option v-bind:value="false">{{$t("message.endUsing")}}</option>
				                </select>
				            </div>
				        </div>
				        <div class="span6">

				        </div>
				    </div>
				    <!-- @@sys_syslog.ipaddr -->
				    <div class="row-fluid" v-if="nodeExist(data_obj.sys_syslog.ipaddr)" v-show="nodeShow(data_obj.sys_syslog.ipaddr)">
				        <div class="span6 cbi-value">
				            <label class="cbi-value-title"
				                v-bind:for="'sys_syslog-'+ data_obj.sys_syslog.ipaddr.key">
				                {{$t("message.listenOnAddress")}}
				            </label>
				            <div class="cbi-value-field">
				                <input type="text" class="cbi-input-text"
							v-validate.initial :data-vv-rules="nodeValidate(data_obj.sys_syslog.ipaddr)"
							:data-vv-as="$t('message.listenOnAdd')" name="ipaddr"
				                	v-bind:id="'sys_syslog-'+ data_obj.sys_syslog.ipaddr.key"
				                	v-model="data_obj.sys_syslog.ipaddr.value"
				                />
				                <div class="text-error" v-show="errors.has('ipaddr')">
								 	{{ errors.first('ipaddr') }}
								</div>
				            </div>
				        </div>
				        <div class="span6">

				        </div>
				    </div>
				    <!-- @@sys_syslog.port -->
				    <div class="row-fluid" v-if="nodeExist(data_obj.sys_syslog.port)" v-show="nodeShow(data_obj.sys_syslog.port)">
				        <div class="span6 cbi-value">
				            <label class="cbi-value-title"
				            	v-bind:for="'sys_syslog-'+ data_obj.sys_syslog.port.key"
				            >
				                {{$t("message.serverPortNumber")}}
				            </label>
				            <div class="cbi-value-field">
				            	<input type="text" class="cbi-input-text"
							v-validate.initial :data-vv-rules="nodeValidate(data_obj.sys_syslog.port)"
							:data-vv-as="$t('message.serverPortNum')" name="portNums"
				                	v-bind:id="'sys_syslog-'+ data_obj.sys_syslog.port.key"
				                	v-model.number="data_obj.sys_syslog.port.value"
				                />
					           	<div class="text-error" v-show="errors.has('portNums')">
								 	{{ errors.first('portNums') }}
								</div>

				            </div>
				        </div>
				        <div class="span6">

				        </div>
				    </div>
				    <!-- @@sys_syslog.level -->
					<div class="row-fluid" v-if="nodeExist(data_obj.sys_syslog.level)" v-show="nodeShow(data_obj.sys_syslog.level)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title"
								v-bind:for="'sys_syslog-'+ data_obj.sys_syslog.level.key"
							>
							{{$t("message.logLevel")}} :
							</label>
							<div class="cbi-value-field">
							<select class="cbi-input-select"
								v-model="data_obj.sys_syslog.level.value"
								v-bind:id="'sys_syslog-'+ data_obj.sys_syslog.level.key"
							>
								<option v-for="level in data_obj.sys_syslog.level.list" >{{level}}</option>
							</select>

							</div>
						</div>
						<div class="span6">
						</div>

					</div>

				</div>
			</div>

		</div>
		<div v-else v-bind:class="[cur_active ? 'tab-pane active' : 'tab-pane']">
			{{null_msg}}
		</div>
		*/
	}),
	props: {
		data_obj : Object,
		cur_active : Boolean
	},
	data:function () {
		return {
			null_msg: Vue.t('message.nullMsg'),
			sub_tab_sel: "tun_syslog",
		}
	},
	computed: {
		isRender: function(){
			// console.log(this.data_obj)
			// console.log(typeof(this.data_obj))
			return !isEmptyObject(this.data_obj)
		}
	},
	methods: {
		changeSubTab: function(cur_tab){
			this.sub_tab_sel = cur_tab
		},
		isShowSubTab: function(cur_tab){
			return this.sub_tab_sel == cur_tab
		},
		// v-if=" nodeExist(data_obj.sys_syslog.level) "
		nodeExist: function(data_obj){
			//判断data_obj是否存在，不存在返回false，存在不做任何操作
			var exist= true ;
			if( typeof(data_obj)== 'undefined' ){
				return exist=false
			}
			return exist
		},
        //v-show=" nodeShow(data_obj.sys_syslog.level) "
		nodeShow: function(data_obj){
			// 判断data_obj中的spec属性中的内容 或者 data_obj中spec属性中的show 是否要显示,不显示赋值为true，只显示spec以外的内容；
			// 如果显示 不做任何操作，显示spec中的内容就可以了
			//json 中-->做数据的显示/隐藏 show：true/false
			var show_exist ;

			if( typeof(data_obj.spec) == 'undefined' || typeof(data_obj.spec.show) == 'undefined'){
				show_exist = true
			}else {
				show_exist = data_obj.spec.show
			}
			 return show_exist
		},
		// 验证
		nodeValidate: function(data_obj){
			var myRule= "required";
			// console.log("data_obj.type:"+data_obj.type);
			var is_first = false;
			if( typeof(data_obj.type) == 'undefined' ){
				//判断是否定义了数据类型，如果未定义，返回空字符串
				return "";
			}
			if( typeof(data_obj.spec) == 'undefined' ){
				//未定义spec，无法执行后续逻辑
				return "";
			}


			//判断是否是number
			if( data_obj.type == 'number' ) {
				//port-->如果是number，那么根据range组合出字符串,表示数字的取值范围
				if (typeof(data_obj.spec.range) != 'undefined') {
					//myRule:  between:3,8
					if (!is_first) {
						myRule += "|"
					} else {
						is_first = true;
					}
					myRule += "between:" + data_obj.spec.range.min + "," + data_obj.spec.range.max
					// console.log(myRule)
				}

			}else if( data_obj.type == 'string' ){//判断是否是string

				//如果是string，那么根据range组合出字符串，.表示字符串的长度
				if(typeof(data_obj.spec.range) != 'undefined'){
					//myRule:  min:必须至少有 3 字符,max:不能大于 8 字符
					if( ! is_first){
						myRule +="|"
					}else{
						is_first = false
					}
					myRule += "min:"+data_obj.spec.range.min+"|max:"+data_obj.spec.range.max
					// console.log(myRule)
				}

			}else if( data_obj.type == 'ipv4_address' ){//判断是否是ip

				//port-->如果是ip，那么根据ipv4_address规则限制必须符合ip地址要求
				if (typeof(data_obj.value) != 'undefined') {
					//myRule:  between:3,8
					if (!is_first) {
						myRule += "|"
					} else {
						is_first = true;
					}
					myRule += "ip";
					// console.log(myRule)
				}

			}else{//判断是否存在必填项

				if( typeof(el.spec.required) != 'undefined'){

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
