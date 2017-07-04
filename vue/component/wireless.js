Vue.component('ns-accfg-wireless',{
	template: heredoc(function () {
		/*
		<div v-bind:class="[cur_active ? 'tab-pane active' : 'tab-pane']" v-if="isRender">
			<!-- @@创建tabs的button -->
			<ul class="cbi-tabmenu" >

				<li v-for="(item, idx) in data_obj.radio"
					v-on:click="changeRadioTab(idx)"
					v-bind:class="[isShowRadioTab(idx)? 'cbi-tab' : 'cbi-tab-disabled']"
					>
					<a href="javascript:void(0);">{{$t("message.wrelessTit")}}-{{item.frequence.value}}(Radio{{idx}})</a>
				</li>
			</ul>
      <!-- @@ssid pannel -->
      <ns-accfg-ssid ref="modal_ssid_list"
          :radio_obj.sync="data_obj.radio[radio_sel]"
          :radio_idx="radio_sel"
          @ssidSave="vapSave"
      />
			<!-- @@创建tabs的pannels -->
			<div class="cbi-section-node cbi-section-node-tabbed">
				<div class="cbi-tabcontainer"  v-if="nodeExist(el)" v-for="(el,radio_idx) in data_obj.radio" v-show="isShowRadioTab(radio_idx)" >
					<!-- @@放置所有的wifi模版 -->
					<!-- @@基础配置 -->
					<!-- @@使能开关 -->
				  <div class="row-fluid" v-if="nodeExist(el.enabled)" v-show="nodeShow(el.enabled)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" v-bind:for="el.enabled.key + radio_idx">{{$t("message.startUsingRadio")}}</label>
							<div class="cbi-value-field">
								<select class="cbi-input-select" v-model="el.enabled.value"
								v-bind:id="el.enabled.key + radio_idx">
									<option v-bind:value="true">{{$t("message.startUsing")}}</option>
									<option v-bind:value="false">{{$t("message.endUsing")}}</option>
								</select>
							</div>
						</div>
						<div class="span6"></div>
					</div>
					<!-- @@IEEE模式 -->
				  <div class="row-fluid" v-if="nodeExist(el.ieeemode)" v-show="nodeShow(el.ieeemode)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title">{{$t("message.IEEEPattern")}}</label>
							<div class="cbi-value-field">
								<select class="cbi-input-select" v-model="el.ieeemode.value">
									<option v-for="etext in el.ieeemode.list" >{{etext}}</option>
								</select>

								<span class="form_error"> </span>
							</div>
						</div>
						<div class="span6"></div>
					</div>
					<!-- @@信道及频宽 -->
				  <div class="row-fluid" v-if="nodeExist(el.channel)" v-show="nodeShow(el.channel)">
						<div class="span5 cbi-value">
							<label class="cbi-value-title" v-bind:for="'channel'+ radio_idx">信道:</label>
							<div class="cbi-value-field">
								<select style="width:80%" class="cbi-input-select"
								v-bind:id="'channel'+ radio_idx"
								v-model="el.channel.value"
								v-on:change="channelChanged(el, $event)"
								>
									<option v-for="etext in templ_info.channelList[radio_idx]"
									v-bind:value="etext.val">{{etext.text}}</option>
								</select>

								<span class="form_error"> </span>
							</div>
						</div>
						<div class="span5 cbi-value">
							<label class="cbi-value-title" v-bind:for="el.htmode.key + radio_idx">频宽:</label>
							<div class="cbi-value-field">
								<select style="width:50%" class="cbi-input-select" v-model="el.htmode.value"
									v-bind:id="el.htmode.key + radio_idx" >
									<option v-for="etext in el.htmode.list" >{{etext}}</option>
								</select>

								<span class="form_error"> </span>
							</div>
						</div>
					</div>
					<!-- @@功率 -->
				  <div class="row-fluid" v-if="nodeExist(el.txpower)" v-show="nodeShow(el.txpower)">
						<div class="span6 cbi-value">
							<label class="cbi-value-title" v-bind:for="el.txpower.key + radio_idx">发射功率(dbm):</label>
							<div class="cbi-value-field">
								<input type="text" style="width:80%" class="cbi-input-text"
									v-validate.initial :data-vv-rules="nodeValidate(el.txpower)"
									 :data-vv-as="$t('message.transmittedPo')" v-bind:name="el.txpower.key + radio_idx"
								v-model="el.txpower.value"
								v-bind:id="el.txpower.key + radio_idx"
								/>
							 <div class="text-error" v-show="errors.has(el.txpower.key + radio_idx)">
							 	{{ errors.first(el.txpower.key + radio_idx) }}
							 </div>
							</div>
						</div>
						<div class="span6"></div>
					</div>
					<!-- <span style="text-decoration:underline">我带下划线</span> -->
					<a href="javascript:void(0);" v-on:click="changeAdvance(el)">
						<div style="border-bottom:1px solid ;">
							<span class="icon">
								<i v-bind:class="[el.advance.visible? 'icon-chevron-down' :'icon-chevron-up']"></i>
							</span>
						 {{$t("message.advancedConf")}}
						</div>
					</a>
					<!-- @@高级配置panel -->
					<div class="row-fluid" v-show="el.advance.visible">
						<div class="span12">
						 <!-- @@bawinsize -->
						 <div class="row-fluid" v-if="nodeExist(el.bawinsize)" v-show="nodeShow(el.bawinsize)">
								<div class="span8 cbi-value">
									<label class="cbi-value-title"
										v-bind:for="el.bawinsize.key + radio_idx">
										bawinsize :
									</label>
									<div class="cbi-value-field">
										<input type="text" class="cbi-input-text"
										v-bind:id="el.bawinsize.key + radio_idx"
										v-model.number="el.bawinsize.value"
										v-validate.initial :data-vv-rules="nodeValidate(el.bawinsize)"
											 :data-vv-as="el.acktimeout.key" v-bind:name="el.bawinsize.key + radio_idx"
										/>
										 <div class="text-error" v-show="errors.has(el.bawinsize.key + radio_idx)">
										 		{{ errors.first(el.bawinsize.key + radio_idx) }}
										</div>
									</div>
								</div>
								<div class="span4"></div>
						 </div>
						 <!-- @@fragmentation -->
						 <div class="row-fluid" v-if="nodeExist(el.fragmentation)" v-show="nodeShow(el.fragmentation)">
								<div class="span5 cbi-value">
									<label class="cbi-value-title"
									v-bind:for="el.fragmentation.key + radio_idx">
									fragmentation :</label>
									<div class="cbi-value-field">
										<select style="width:80%" class="cbi-input-select"
										v-model="el.fragmentation.value.enabled"
										v-bind:id="el.fragmentation.key + radio_idx">
											 <option v-bind:value="true">{{$t("message.startUsing")}}</option>
											 <option v-bind:value="false">{{$t("message.endUsing")}}</option>
										</select>

									</div>
								</div>
								<div  style="width:50%" class="span5 cbi-value" v-show="el.fragmentation.value.enabled">
									<label class="cbi-value-title"
									v-bind:for="el.fragmentation.key + radio_idx + 'vv'">
									fragmentation size :</label>
									<input style="width:10%" type="text" class="cbi-input-text"
											v-validate.initial :data-vv-rules="nodeValidate(el.fragmentation)"
											 :data-vv-as="$t('message.fragmentationSize')" v-bind:name="el.fragmentation.key + radio_idx"
										v-bind:id="el.fragmentation.key + radio_idx + 'vv'"
										v-model.number="el.fragmentation.value.size.value"
									/>
									 <div class="text-error" v-show="errors.has('fragmentation'+ radio_idx)">
											 {{ errors.first('fragmentation'+ radio_idx) }}
									 </div>
								</div>
						 </div>
						 <!-- @@rts -->
						 <div class="row-fluid" v-if="nodeExist(el.rts)" v-show="nodeShow(el.rts)">
								<div class="span5 cbi-value">
									<label class="cbi-value-title" v-bind:for="el.rts.key + radio_idx">
									rts :</label>
									<div class="cbi-value-field">
										<select style="width:80%" class="cbi-input-select" v-model="el.rts.value.enabled">
											 <option v-bind:value="true">{{$t("message.startUsing")}}</option>
											 <option v-bind:value="false">{{$t("message.endUsing")}}</option>
										</select>
									</div>
								</div>
								<div style="width:50%" class="span5 cbi-value" v-show="el.rts.value.enabled">
									<label class="cbi-value-title"
									v-bind:for="el.rts.key + radio_idx + 'vv'">
									rts size :</label>
									<input style="width:10%" type="text" class="cbi-input-text"
											v-validate.initial :data-vv-rules="nodeValidate(el.rts)"
											 :data-vv-as="el.rts.value.size.key" name="rts"
										v-bind:id="el.rts.key + radio_idx + 'vv'"
										v-model.number="el.rts.value.size.value"

										/>
									<div class="text-error" v-show="errors.has('rts')">
										 {{ errors.first('rts') }}
									</div>
								</div>
						 </div>
						 <!-- @@acktimeout -->
						 <div class="row-fluid" v-if="nodeExist(el.acktimeout)" v-show="nodeShow(el.acktimeout)">
								<div class="span6 cbi-value">
									<label class="cbi-value-title" v-bind:for="el.acktimeout.key + radio_idx">
									acktimeout :</label>
									<div class="cbi-value-field">
										<input style="width:80%" type="text" class="cbi-input-text"
											v-validate.initial :data-vv-rules="nodeValidate(el.acktimeout)"
											:data-vv-as="el.acktimeout.key" v-bind:name="el.acktimeout.key + radio_idx"
  										v-bind:for="el.acktimeout.key + radio_idx"
  										v-model.number="el.acktimeout.value"
										 />
									  <div class="text-error" v-show="errors.has(el.acktimeout.key + radio_idx)">
                      {{ errors.first(el.acktimeout.key + radio_idx) }}
									  </div>
									</div>
								</div>
								<div class="span6"></div>
						 </div>
						 <!-- @@atpc -->
						 <div class="row-fluid" v-if="nodeExist(el.atpc)" v-show="nodeShow(el.atpc)">
								<div class="span5 cbi-value">
									<label class="cbi-value-title" v-bind:for="el.atpc.key + radio_idx"> atpc :</label>
									<div class="cbi-value-field">
										<select style="width:80%" class="cbi-input-select" v-model="el.atpc.value">
										 <option v-bind:value="true">{{$t("message.startUsing")}}</option>
										 <option v-bind:value="false">{{$t("message.endUsing")}}</option>
										</select>
									</div>
								</div>
								<div class="span5"></div>
						 </div>
						 <!-- @@prohibited -->
						 <div class="row-fluid" v-if="nodeExist(el.prohibited)" v-show="nodeShow(el.prohibited)">
								<div class="span5 cbi-value">
									<label class="cbi-value-title" v-bind:for="el.prohibited.key + radio_idx"> prohibited :</label>
									<div class="cbi-value-field">
										<select style="width:80%" class="cbi-input-select" v-model="el.prohibited.value">
										 <option v-bind:value="true">{{$t("message.startUsing")}}</option>
										 <option v-bind:value="false">{{$t("message.endUsing")}}</option>
										</select>
									</div>
								</div>
								<div class="span5">
								</div>
						 </div>
						 <!-- @@AMSDU -->
						 <div class="row-fluid" v-if="nodeExist(el.amsdu)" v-show="nodeShow(el.amsdu)">
								<div class="span5 cbi-value">
									<label class="cbi-value-title" v-bind:for="el.amsdu.key + radio_idx"> AMSDU :</label>
									<div class="cbi-value-field">
										<select style="width:80%" class="cbi-input-select" v-model="el.amsdu.value">
  										<option v-bind:value="true">{{$t("message.startUsing")}}</option>
  										<option v-bind:value="false">{{$t("message.endUsing")}}</option>
										</select>
									</div>
								</div>
								<div class="span5">
								</div>
						 </div>
						 <!-- @@wjet -->
  					 <div class="row-fluid">
  							<div class="span5 cbi-value">
  								<label class="cbi-value-title" v-bind:for="el.wjet.key + radio_idx"> wjet :</label>
  								<div class="cbi-value-field">
  									<select style="width:80%" class="cbi-input-select" v-model="el.wjet.value.enabled">
  										<option v-bind:value="true">启用</option>
  										<option v-bind:value="false">禁用</option>
  									</select>
  								</div>
  							</div>
  							<div class="span6 cbi-value" v-if="el.wjet" v-show="el.wjet.value.enabled">
  								<label class="cbi-value-title" v-bind:for="el.wjet.key + radio_idx + 'vv'">
  									{{$t("message.wjetAgreement")}}
  								</label>
  								<select style="50%" class="cbi-input-select"
  									v-bind:id="el.wjet.key + radio_idx + 'vv'"
  									v-model="el.wjet.value.version" >
  									<option v-for="etxt in el.wjet.list">{{etxt}}</option>
  								</select>
  							</div>
  					 </div>
						 <!-- @@dfs -->
						 <div class="row-fluid" v-if="nodeExist(el.dfs)" v-show="nodeShow(el.dfs)">
								<div class="span5 cbi-value">
									<label class="cbi-value-title" v-bind:for="el.dfs.key + radio_idx"> DFS :</label>
									<div class="cbi-value-field">
										<select style="width:80%" class="cbi-input-select" v-model="el.dfs.value">
  									 <option v-bind:value="true">{{$t("message.startUsing")}}</option>
  									 <option v-bind:value="false">{{$t("message.endUsing")}}</option>
										</select>
									</div>
								</div>
								<div class="span5">
                </div>
						 </div>
						</div>
					</div><!-- end of @@高级配置pannel -->

          <!-- @@无线AP配置 -->
          <div class="row-fluid">
            <div class="span12">
              <div class="widget-box">
                <div class="widget-title" data-toggle="collapse" >
                  <span class="icon">
                    <i class="icon-align-justify"></i>
                  </span>
                  <div class="pull-left">
                    <h5>Radio{{radio_sel}} {{$t("message.SSIDCon")}}</h5>
                  </div>
                  <div class="pull-right">
                    <button class="btn btn-info" type="button" title="Add a vap" @click="ssidModalAction('new')">
                      <i class="icon icon-plus"></i>
                        Add vap
                    </button>
                  </div>
                </div>
                <div class="widget-content nopadding" >
                  <ns-accfg-grid
                    :table-id=getTableId(radio_idx)
                    :header=ssid_header
                    :rows=curVaps_arr
                    :col-callback=colCallbacks
                    :rows-start=pStart
                    :rows-limit=pLimit
                    v-bind:ref=getRefTableId(radio_idx)
                    @grid-row-delete="vapDel"
                    @grid-row-edit="vapUpdateClick"
                  >
                    <ns-accfg-pager
                        slot="pager"
                        :show-pager=true
                        :total-page=pTotal
                        :show-items=4
                        :ref-tableid=getTableId(radio_idx)
                        v-bind:ref=getRefPagerId(radio_idx)
                      >
                    </ns-accfg-pager>
                  </ns-accfg-grid>

                </div>
              </div>
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
		'data_obj' : Object,
		'cur_active': Boolean,
		'templ_info' : Object
	},
	data:function () {
		return {
			null_msg: Vue.t('message.nullMsg'),
			radio_sel: 0,
			debug : false,
			ssid_header:{
				keys:[
					"essid",
					"enabled",
					"hidden"
				],
				text:[
					Vue.t('message.SSIDName'),
					Vue.t('message.whetherEnable'),
					Vue.t('message.whetherHide')
				],
        ops: {
            "edit":{
              "event": 'net_interface_edit',
              "text": Vue.t('message.redact'),
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
				"hidden":{
					cb:function(key,obj,val){

		        		if(obj[key] == 1){
		        			return Vue.t('message.right')
		        		}else{
		        			return Vue.t('message.deny')
				        }
					}
				},
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
	computed: {
		isRender: function(){
			return !isEmptyObject(this.data_obj)
		},
    curVaps: function(){
      return this.data_obj.radio[this.radio_sel].vap
    },
    curVaps_arr: function(){
      let tmp_obj = myclone(this.curVaps)
      if(tmp_obj == null){
        return []
      }
      delete tmp_obj[0]
      return convertArray(tmp_obj)
    }
	},
	methods: {
    vapDel: function(tableId, param, row, index){
      console.info("deeeeeeeeee")
      console.info(row)
      //index为table中的索引，从0开始，故需要加1(0为template)
      //删除table内记录,这里是违反原则的做法！！
      //因为不能在父组件中直接修改子组件的props内的属性
      let  t = this.$refs[this.getRefTableId(this.radio_sel)]
      t[0].dataRows.splice(index,1)
      //最正确的删除
      //this.curVaps_arr.splice(index, 1)
      //从vap真实列表中删除,注意索引号
      //以下方法也不好，不应该修改props内的属性
      let real_idx = -1
      let arr_num = 0
      arrayEach(this.curVaps, function(obj_key, obj){
        if(arr_num == index +1 ){
          real_idx = obj_key
          return false
        }
        arr_num += 1


      })
      if(real_idx > 0){
        Vue.delete(this.curVaps, real_idx)
      }


    },
    vapSave: function(new_vap, old_row, index, action){
      console.info("uuuuuuuuuuuuu")

      if( action == "new"){
        let  t = this.$refs[this.getRefTableId(this.radio_sel)]
        t[0].dataRows.push(new_vap)

        // this.curVaps_arr.push(new_vap)
        //总是找到vap类对象的索引的最大一个
        let real_idx = -1
        arrayEach(this.curVaps, function(obj_key, obj){
          real_idx = obj_key
        })
        this.$set(this.curVaps, parseInt(real_idx)+1, new_vap)
      }else{
        let  t = this.$refs[this.getRefTableId(this.radio_sel)]
        this.$set(t[0].dataRows, index, new_vap)


        //找到数组中对应的vap索引，非顺序的哟
        let real_idx = -1
        let arr_num = 0
        arrayEach(this.curVaps, function(obj_key, obj){
          if(arr_num == index + 1){
            real_idx = obj_key
            return false
          }
          arr_num += 1


        })
        console.log("read idx is " + real_idx)
        if(real_idx > 0){
          this.$set(this.curVaps, parseInt(real_idx), new_vap)
        }


      }




    },
    vapUpdateClick: function(tableId, param, row, index){
      console.warn("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
      console.warn(row)
      console.warn("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
      this.ssidModalAction('update', index, row)
    },
    getVaps: function(idx){


      // this.pTotal = Math.ceil(this.ssid_arr.length / this.pLimit)
      // console.log("总共:" + this.pTotal +"页，每页:" + this.pLimit)
    },
    ssidModalAction: function(action, vap_idx, obj){
      //控制modal的展示与否
      console.warn(this.radio_sel)
      console.info(obj)
       console.warn("zzzzzzzz")
      if(action == "new"){
        this.$refs.modal_ssid_list.modalOpen({
          'title': '',
          'action': 'new',
          'vap_idx': this.curVaps_arr.length,
          'vap_obj': null
        })
      }else{
        this.$refs.modal_ssid_list.modalOpen({
          'title': '',
          'action': 'update',
          'vap_idx': vap_idx,
          'vap_obj': obj
        })
      }

    },
		getRefTableId: function(radio_idx){
			return "ref_"+this.getTableId(radio_idx)
		},
		getRefPagerId: function(radio_idx){
			return "ref_pager_sec"+ radio_idx
		},
		getTableId: function(radio_idx){
			return "ssid_table_"+ radio_idx
		},
		getRadioId: function(table_id){
			return parseInt(table_id.split("ssid_table_")[1])
		},
		changeRadioTab: function(cur_tab){
			console.log("change raio idx to:" + cur_tab)
			this.radio_sel = parseInt(cur_tab)
		},
		isShowRadioTab: function(cur_tab){
			return this.radio_sel == cur_tab
		},
		changeAdvance: function(obj){
			obj.advance.visible = !obj.advance.visible
		},
		channelChanged: function(radio_obj, ev){
			//信道变化将会引起其他连锁反应

			if(typeof(ev) == 'string'){
				console.log( Vue.t('message.externalEvent') )
			}else if(typeof(ev) == 'object'){
				console.log( Vue.t('message.internalEvent') )
			}
			//用于计算最大功率，最大功率不应该超过该channel的max_eirp,也不能超过最大板子的功率
			this.debug && console.log("current channel changed to  " + radio_obj.channel.value)
			el = radio_obj

			var cur_channel = el.channel.value
			var cur_txpower = el.txpower.value
			var max_txpower = 0
			var cur_antenna_count = el.antennacount.value
			var max_bw = 20

			//保存原始最大主板功率
			if(typeof(el.board_power.spec.range["max_const"]) == 'undefined'){
				el.board_power.spec.range["max_const"] = el.board_power.spec.range.max
			}
			var max_board_power = el.board_power.spec.range["max_const"]
			var max_eirp_power = 0
			var radio_idx = el.ifindex.value
			avalon.each(this.templ_info.channelList[radio_idx], function(list_idx, el){
				//获取当前channel的最大eirp和bandwidth
				if(el.val == cur_channel){
					max_eirp_power =  el.max_eirp
					max_bw = el.max_bw
				}
			});
			// console.log(index+":channel为"+ cur_channel+"\n" + "当前发射功率为"
			// 	+ cur_txpower + "\n天线增益为"
			// 	+ antennagain + "\ncur_antenna_count为" + cur_antenna_count
			// 	+ "\n最大功率" + max_eirp_power
			// 	+ "\n板子功率" + max_board_power)
			if(max_eirp_power == 0){
				return false
			}
			//如果eirp > (max_board_power + 3* 天线数量),则最大可配置为max_board_power。反之最大为可配置为eirp - 天线增益
			if( max_eirp_power > (max_board_power  + (cur_antenna_count * 3)) ){
				console.log("max_board_power" + max_board_power)
				max_txpower = max_board_power
			}else{
				max_txpower = max_eirp_power- (cur_antenna_count * 3)
			}
			console.log("当前最大txpower应该为"+ max_txpower)
			//给txpower加上限制
			el.txpower.spec.range.max = max_txpower
			if(cur_txpower > max_txpower){
				el.txpower.value = max_txpower
			}

			//接下来频宽也需要发生变化
			// if(cur_channel <= 14){
			// 	max_bw = 40
			// }

		},

		// v-if=" nodeExist(el.sys_syslog.level) "
		//el = radio_obj
		nodeExist: function(el){
			//判断el是否存在，不存在返回false，存在不做任何操作
			var exist= true ;
			if( typeof(el)== 'undefined' ){
				return exist=false
			}
			return exist
		},
		//v-show=" nodeShow(el.sys_syslog.level) "
		nodeShow: function(el){
			// 判断el中的spec属性中的内容 或者 el中spec属性中的show 是否要显示,不显示赋值为true，只显示spec以外的内容；
			// 如果显示 不做任何操作，显示spec中的内容就可以了
			//json 中-->做数据的显示/隐藏 show：true/false
			var show_exist ;

			if( typeof(el.spec) == 'undefined' || typeof(el.spec.show) == 'undefined'){
				show_exist = true
			}else {
				show_exist = el.spec.show
			}
			return show_exist
		},
		// 验证
		nodeValidate: function(el){

			var myRule= "required";
			// console.log("el.type:"+el.type);
			var is_first = false;
			if( typeof(el.type) == 'undefined' ){
				//判断是否定义了数据类型，如果未定义，返回空字符串
				return "";
			}
			if( typeof(el.spec) == 'undefined' ){
				//未定义spec，无法执行后续逻辑
				return "";
			}
			//判断是否是number
			if( el.type == 'number' ) {
				//port-->如果是number，那么根据range组合出字符串,表示数字的取值范围
				if (typeof(el.spec.range) != 'undefined') {
					//myRule:  between:3,8
					if (!is_first) {
						myRule += "|"
					} else {
						is_first = true;
					}
					myRule += "between:" + el.spec.range.min + "," + el.spec.range.max
					// console.log(myRule)
				}

			}else if(el.type == 'string' ){//判断是否是string

				//如果是string，那么根据range组合出字符串，.表示字符串的长度
				if(typeof(el.spec.range) != 'undefined'){
					//myRule:  min:必须至少有 3 字符,max:不能大于 8 字符

					if( ! is_first){
						myRule +="|"
					}else{
						is_first = false
					}
					myRule += "min:"+el.spec.range.min+"|max:"+el.spec.range.max
					// console.log(myRule)
				}

			}else if( el.type == 'object' ){//判断是否是object

				//port-->如果是object，那么根据range组合出字符串,表示数字的取值范围
				if (typeof(el.value.size.range) != 'undefined') {
					//myRule:  between:3,8
					if (!is_first) {
						myRule += "|"
					} else {
						is_first = true;
					}
					myRule += "between:" + el.value.size.range.min + "," + el.value.size.range.max
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
	},
	created: function(){
		//监听事件
    this.allRadio = this.data_obj
		Bus.$on('channel-change', this.channelChanged)
		Bus.$on('grid-checkedArr-change', this.change_sel_ssid)
	},
})
