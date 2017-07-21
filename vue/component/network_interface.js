var interface_templ = function() {
	var interface_main = Vue.component("interface_main",{
		template: `
			<div>
				<router-link :to="{name : 'net_interface_new'}" tag="a" class="btn btn-primary">
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
						ref="ref_grid_interface_list"
					>
					<ns-accfg-pager
						slot="pager"
						:show-pager=true
						:total-page=pTotal
						:show-items=4
						:ref-tableid=tableId
						ref="ref_pager_interface_list"
					>
					</ns-accfg-pager>
					</ns-accfg-grid>
				</div>
			</div>
		`,
		data: function(){
			return {
				tableId:"grid_interface_list",
				header:{
					keys:[
						"ifname",
						"enabled",
						"vlanid"
					],
					text:[
						Vue.t('message.interfaceName'),
						Vue.t('message.enabled'),
						Vue.t('message.vlanId')

					],
					ops: {
						"edit":{
							"url": 'net_interface_edit',
							"text": Vue.t('message.redact'),
							"params": [
								{
									"key": "id",
									"col": "ifname"
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
				return sliceArray(this.$store.getters.network.interface,1)
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
					this.$store.commit('interfaceRowUpdate', {
						"key": this_idx,
						"action": "delete",
						"value": ""
					})
				}
			}
		}
	})

	var interface_form = Vue.component("interface_form",{
		template: `
			<transition name="custom-classes-transition"
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown"
			>
				<div>
					{{cur_mode}}{{title}}

					<br>
          <!--@@接口类型 -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.iftype)" v-show="nodeShow(templ_obj.iftype)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.iftype")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-model="cur_obj.iftype" v-bind:readonly="templ_obj.iftype.spec.readonly"/>
              </div>
            </div>

             <!-- @@接口名 -->
            <div class="span6 cbi-value" v-if="nodeExist(templ_obj.ifname)" v-show="nodeShow(templ_obj.ifname)">
              <label class="cbi-value-title" >{{$t("message.ifname")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.ifname)"
                  :data-vv-as="$t('message.ifname')" name="templ_ifname"
                  v-model="cur_obj.ifname"/>
                <div class="text-error" v-show="errors.has('templ_ifname')">
                   {{ errors.first('templ_ifname') }}
                </div>
              </div>
            </div>
          </div>


          <!-- @@是否启用 -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.enabled)" v-show="false">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.whetherEnable")}}</label>
              <div class="cbi-value-field">
                <select class="cbi-input-select" v-model="cur_obj.enabled"
                >
                  <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                  <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                </select>
              </div>
            </div>
            <div class="span6"></div>
          </div>
          <!-- @@phy_index -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.phy_index)" v-show="nodeShow(templ_obj.phy_index)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.interfaceIndex")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.phy_index)"
                  :data-vv-as="$t('message.interfaceIndex')" name="templ_phy_index"
                  v-model="cur_obj.phy_index" />
                <div class="text-error" v-show="errors.has('templ_phy_index')">
                   {{ errors.first('templ_phy_index') }}
                </div>
              </div>
            </div>
            <!-- @@vlanid -->
            <div class="span6 cbi-value" v-if="nodeExist(templ_obj.vlanid)" v-show="nodeShow(templ_obj.vlanid)">
              <label class="cbi-value-title" >{{$t("message.vlanId")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.vlanid)"
                  :data-vv-as="$t('message.vlanId')" name="templ_vlanid"
                  v-model="cur_obj.vlanid"/>
                <div class="text-error" v-show="errors.has('templ_vlanid')">
                   {{ errors.first('templ_vlanid') }}
                </div>
              </div>
            </div>
          </div>

          <!-- @@ssid_name -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.ssid_name)" v-show="nodeShow(templ_obj.ssid_name)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.SSIDName")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.ssid_name)"
                  :data-vv-as="$t('message.SSIDName')" name="templ_ssid_name"
                  v-model="cur_obj.ssid_name"/>
                <div class="text-error" v-show="errors.has('templ_ssid_name')">
                   {{ errors.first('templ_ssid_name') }}
                </div>
              </div>
            </div>
            <div class="span6"></div>
          </div>
          <!-- @@ssid2vlan -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.ssid2vlan)" v-show="nodeShow(templ_obj.ssid2vlan)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title">ssid2vlan</label>
              <div class="cbi-value-field">
                <select  class="cbi-input-select"
                v-model="cur_obj.ssid2vlan.enabled" >
                   <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                   <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                </select>

              </div>
            </div>
            <div class="span6 cbi-value" v-show="cur_obj.ssid2vlan.enabled">
              <label class="cbi-value-title" >{{$t("message.vlanId")}}</label>
              <input style="width:10%" type="text" class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.ssid2vlan)"
                   :data-vv-as="$t('message.vlanId')" name="templ_ssdi2vlan_vlanid"
                  v-model.number="cur_obj.ssid2vlan.id" />
               <span class="text-error" v-show="errors.has('templ_ssdi2vlan_vlanid')">
                   {{ errors.first('templ_ssdi2vlan_vlanid') }}
               </span>
            </div>
          </div>
           <!-- @@源地址黑白名单 hr -->
          <a href="javascript:void(0);" v-on:click="changeVisible('src_policy')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.src_policy ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
             {{$t("message.srcPolicy")}}
            </div>
          </a>
          <br>
          <!-- @@源地址黑白名单 div -->
          <div v-show="visible.src_policy">
            <!-- srcIPBlock -->
            <div class="row-fluid">
              <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.srcIPBlock")}}</label>
                  <div class="cbi-value-field">
                  <Select v-model="cur_config_intf.srcIPBlock" multiple>
                      <Option v-for="item in get_server_list('src_ip_list')" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  </div>
                </div>
                <div class="span6"></div>
            </div>

            <!-- srcMACBlock -->
            <div class="row-fluid">
              <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.srcMACBlock")}}</label>
                  <div class="cbi-value-field">

                    <Select v-model="cur_config_intf.srcMACBlock" multiple>
                      <Option v-for="item in get_server_list('src_mac_list')" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </div>
                </div>
                <div class="span6"></div>
            </div>

            <!-- srcIPAccept -->
            <div class="row-fluid">
              <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.srcIPAccept")}}</label>
                  <div class="cbi-value-field">

                   <Select v-model="cur_config_intf.srcIPAccept" multiple>
                      <Option v-for="item in get_server_list('src_ip_list')" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  </div>
                </div>
                <div class="span6"></div>
            </div>

            <!-- srcMACAccept -->
            <div class="row-fluid">
              <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.srcMACAccept")}}</label>
                  <div class="cbi-value-field">

                    <Select v-model="cur_config_intf.srcMACAccept" multiple>
                      <Option v-for="item in get_server_list('src_mac_list')" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </div>
                </div>
                <div class="span6"></div>
            </div>
          </div>

          <!-- @@portal agentargs -->
          <!-- @@是否启用portal -->
          <a href="javascript:void(0);" v-on:click="changeVisible('portal')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.portal ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
             {{$t("message.portalSetting")}}
            </div>
          </a>
          <br>

          <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs)" v-show="nodeShow(templ_obj.agentargs) && visible.portal">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.whetherEnable")}}Portal</label>
              <div class="cbi-value-field">
                <select class="cbi-input-select" v-model="cur_obj.agentargs.enabled"
                >
                  <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                  <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                </select>
              </div>
            </div>
            <div class="span6"></div>
          </div>
          <div class="row-fluid" v-show="cur_obj.agentargs.enabled && visible.portal">

            <div class="span12">
              <!--@@接口类型 -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.iftype)" v-show="nodeShow(templ_obj.agentargs.default.iftype)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.iftype")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-model="cur_obj.agentargs.iftype" v-bind:readonly="templ_obj.agentargs.default.iftype.spec.readonly"
                    />
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@idletimeout -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.idletimeout)" v-show="nodeShow(templ_obj.agentargs.default.idletimeout)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.idletimeout")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.idletimeout)"
                      :data-vv-as="$t('message.idletimeout')" name="templ_agentargs_idletimeout"
                      v-model="cur_obj.agentargs.idletimeout"/>
                    <div class="text-error" v-show="errors.has('templ_agentargs_idletimeout')">
                       {{ errors.first('templ_agentargs_idletimeout') }}
                    </div>
                  </div>
                </div>
                 <!-- @@accttimeout -->
                <div class="span6 cbi-value" v-if="nodeExist(templ_obj.agentargs.default.accttimeout)" v-show="nodeShow(templ_obj.agentargs.default.accttimeout)">
                  <label class="cbi-value-title" >{{$t("message.accttimeout")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.accttimeout)"
                      :data-vv-as="$t('message.accttimeout')" name="templ_agentargs_accttimeout"
                      v-model="cur_obj.agentargs.accttimeout"/>
                    <div class="text-error" v-show="errors.has('templ_agentargs_accttimeout')">
                       {{ errors.first('templ_agentargs_accttimeout') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- @@portal_method -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.portal_method)" v-show="nodeShow(templ_obj.agentargs.default.portal_method)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.portalRedirectMethod")}}</label>
                  <div class="cbi-value-field">

                    <select class="cbi-input-select" v-model="cur_obj.agentargs.portal_method" >
                      <option
                        v-for="pmode in templ_obj.agentargs.default.portal_method.list"
                        v-bind:value="pmode" >
                        {{pmode}}
                      </option>

                    </select>
                  </div>
                </div>
                <div class="span6"></div>
              </div>


              <!-- @@portal.nasaddr -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.portal)" v-show="nodeShow(templ_obj.agentargs.default.portal.default.nasaddr)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.nasAddr")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.portal.default.nasaddr)"
                      :data-vv-as="$t('message.nasAddr')" name="templ_agentargs_portal_nasaddr"
                      v-model="cur_obj.agentargs.portal.nasaddr" />
                    <div class="text-error" v-show="errors.has('templ_agentargs_portal_nasaddr')">
                       {{ errors.first('templ_agentargs_portal_nasaddr') }}
                    </div>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@portal.prtipaddr -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.portal)" v-show="nodeShow(templ_obj.agentargs.default.portal.default.prtipaddr)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.prtIpaddr")}}</label>
                  <div class="cbi-value-field">
                    <input type="hidden"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.portal.default.prtipaddr)"
                      :data-vv-as="$t('message.prtIpaddr')" name="templ_agentargs_portal_prtipaddr"
                      v-model="cur_obj.agentargs.portal.prtipaddr" />

                    <select class="cbi-input-select" v-model="cur_config_intf.portal_id" >
                      <option
                        v-for="obj in get_server_list('portal_list')"
                        v-bind:value="obj.id" >
                        {{obj.descr}} (ip: {{obj.ip}})
                      </option>
                    </select>

                    <div class="text-error" v-show="errors.has('templ_agentargs_portal_prtipaddr')">
                       {{ errors.first('templ_agentargs_portal_prtipaddr') }}
                    </div>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@portal.prturl -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.portal)" v-show="nodeShow(templ_obj.agentargs.default.portal.default.prturl)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.prtUrl")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.portal.default.prturl)"
                      :data-vv-as="$t('message.prtUrl')" name="templ_agentargs_portal_prturl"
                      v-model="cur_obj.agentargs.portal.prturl" />
                    <div class="text-error" v-show="errors.has('templ_agentargs_portal_prturl')">
                       {{ errors.first('templ_agentargs_portal_prturl') }}
                    </div>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@acl.deny.ip4 -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.acl)" v-show="nodeShow(templ_obj.agentargs.default.acl.default.deny)">
                <div class="span10 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.dstDenyIp4")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.portal.default.prturl)"
                      :data-vv-as="$t('message.dstDenyIp4')" name="templ_agentargs_portal_prturl"
                      v-model="tmp_obj.deny.ip4" />
                    <a class="btn btn-info" v-on:click="acl_add_one(tmp_obj.deny.ip4, 'deny_ip4')">
                      <i class="icon icon-plus"></i>
                      {{$t("message.commonAdd")}}
                    </a>
                    <a class="btn btn-warning" v-on:click="acl_rm_all('deny_ip4')">
                      <i class="icon icon-remove"></i>
                      {{$t("message.commonFlush")}}
                    </a>
                    <div class="text-error" v-show="errors.has('templ_agentargs_acl_deny_ipv4')">
                       {{ errors.first('templ_agentargs_acl_deny_ipv4') }}
                    </div>
                    <table class="cbi-section-table">
                  <thead class="cbi-section-table-titles">
                    <tr>
                      <th style="text-align: left; width=5%" class="cbi-section-table-cell">id</th>
                      <th style="text-align: left;" class="cbi-section-table-cell">content</th>
                      <th style="text-align: left;width=5%" class="cbi-section-table-cell">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="obj,index in cur_obj.agentargs.acl.deny.ip4">
                      <td>
                          {{index}}
                      </td>
                      <td>
                          <input v-model="obj" />
                      </td>
                      <td>
                          <a class="btn btn-danger" v-on:click="acl_rm_one(obj, 'deny_ip4')">
                            <i class="icon icon-remove"></i>
                          </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                  </div>
                </div>
                <div class="span2">

                </div>
              </div>

              <!-- @@acl.deny.host -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.acl)" v-show="nodeShow(templ_obj.agentargs.default.acl.default.deny)">
                <div class="span10 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.dstDenyHost")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.portal.default.prturl)"
                      :data-vv-as="$t('message.dstDenyHost')" name="templ_agentargs_acl_deny_host"
                      v-model="tmp_obj.deny.host" />
                    <a class="btn btn-info" v-on:click="acl_add_one(tmp_obj.deny.host, 'deny_host')">
                      <i class="icon icon-plus"></i>
                      {{$t("message.commonAdd")}}
                    </a>
                    <a class="btn btn-warning" v-on:click="acl_rm_all('deny_host')">
                      <i class="icon icon-remove"></i>
                      {{$t("message.commonFlush")}}
                    </a>
                    <div class="text-error" v-show="errors.has('templ_agentargs_acl_deny_host')">
                       {{ errors.first('templ_agentargs_acl_deny_host') }}
                    </div>
                    <table class="cbi-section-table">
                  <thead class="cbi-section-table-titles">
                    <tr>
                      <th style="text-align: left; width=5%" class="cbi-section-table-cell">id</th>
                      <th style="text-align: left;" class="cbi-section-table-cell">content</th>
                      <th style="text-align: left;width=5%" class="cbi-section-table-cell">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="obj,index in cur_obj.agentargs.acl.deny.host">
                      <td>
                          {{index}}
                      </td>
                      <td>
                          <input v-model="obj" />
                      </td>
                      <td>
                          <a class="btn btn-danger" v-on:click="acl_rm_one(obj, 'deny_host')">
                            <i class="icon icon-remove"></i>
                          </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                  </div>
                </div>
                <div class="span2">

                </div>
              </div>

              <!-- @@acl.free.ip4 -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.acl)" v-show="nodeShow(templ_obj.agentargs.default.acl.default.free)">
                <div class="span10 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.dstFreeIp4")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.portal.default.prturl)"
                      :data-vv-as="$t('message.dstFreeIp4')" name="templ_agentargs_acl_free_ip4"
                      v-model="tmp_obj.free.ip4" />
                    <a class="btn btn-info" v-on:click="acl_add_one(tmp_obj.free.ip4, 'free_ip4')">
                      <i class="icon icon-plus"></i>
                      {{$t("message.commonAdd")}}
                    </a>
                    <a class="btn btn-warning" v-on:click="acl_rm_all('free_ip4')">
                      <i class="icon icon-remove"></i>
                      {{$t("message.commonFlush")}}
                    </a>
                    <div class="text-error" v-show="errors.has('templ_agentargs_acl_free_ipv4')">
                       {{ errors.first('templ_agentargs_acl_free_ipv4') }}
                    </div>
                    <table class="cbi-section-table">
                  <thead class="cbi-section-table-titles">
                    <tr>
                      <th style="text-align: left; width=5%" class="cbi-section-table-cell">id</th>
                      <th style="text-align: left;" class="cbi-section-table-cell">content</th>
                      <th style="text-align: left;width=5%" class="cbi-section-table-cell">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="obj,index in cur_obj.agentargs.acl.free.ip4">
                      <td>
                          {{index}}
                      </td>
                      <td>
                          <input v-model="obj" />
                      </td>
                      <td>
                          <a class="btn btn-danger" v-on:click="acl_rm_one(obj, 'free_ip4')">
                            <i class="icon icon-remove"></i>
                          </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                  </div>
                </div>
                <div class="span2">

                </div>
              </div>

              <!-- @@acl.free.host -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs.default.acl)" v-show="nodeShow(templ_obj.agentargs.default.acl.default.free)">
                <div class="span10 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.dstFreeHost")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(templ_obj.agentargs.default.portal.default.prturl)"
                      :data-vv-as="$t('message.dstFreeHost')" name="templ_agentargs_acl_free_host"
                      v-model="tmp_obj.free.host" />
                    <a class="btn btn-info" v-on:click="acl_add_one(tmp_obj.free.host, 'free_host')">
                      <i class="icon icon-plus"></i>
                      {{$t("message.commonAdd")}}
                    </a>
                    <a class="btn btn-warning" v-on:click="acl_rm_all('free_host')">
                      <i class="icon icon-remove"></i>
                      {{$t("message.commonFlush")}}
                    </a>
                    <div class="text-error" v-show="errors.has('templ_agentargs_acl_free_host')">
                       {{ errors.first('templ_agentargs_acl_free_host') }}
                    </div>
                    <table class="cbi-section-table">
                  <thead class="cbi-section-table-titles">
                    <tr>
                      <th style="text-align: left; width=5%" class="cbi-section-table-cell">id</th>
                      <th style="text-align: left;" class="cbi-section-table-cell">content</th>
                      <th style="text-align: left;width=5%" class="cbi-section-table-cell">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="obj,index in cur_obj.agentargs.acl.free.host">
                      <td>
                          {{index}}
                      </td>
                      <td>
                          <input v-model="obj" />
                      </td>
                      <td>
                          <a class="btn btn-danger" v-on:click="acl_rm_one(obj, 'free_host')">
                            <i class="icon icon-remove"></i>
                          </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                  </div>
                </div>
                <div class="span2">

                </div>
              </div>


            </div><!-- end of div span12 -->
          </div>



          <!-- @@rad_auth_account settings  -->
          <a href="javascript:void(0);" v-on:click="changeVisible('rad_auth_account')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.rad_auth_account ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
              {{$t("message.radAuthAccount")}}
            </div>
          </a>
          <br>
          <!-- @@认证服务器选择 -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs)" v-show="nodeShow(templ_obj.agentargs) && visible.rad_auth_account">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.radAuthServer")}}</label>
              <div class="cbi-value-field">
              <select class="cbi-input-select" v-model="cur_config_intf.radauth_id" >
                  <option
                    v-for="obj in get_server_list('auth_list')"
                    v-bind:value="obj.id" >
                    {{obj.descr}} (ip: {{obj.ip}})
                  </option>
                </select>
              </div>
            </div>
            <div class="span6"></div>
          </div>
          <!-- @@计费服务器选择 -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs)" v-show="nodeShow(templ_obj.agentargs) && visible.rad_auth_account">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.radAccountServer")}}</label>
              <div class="cbi-value-field">
                <select class="cbi-input-select" v-model="cur_config_intf.is_acct"
                >
                  <option v-bind:value="1">{{$t("message.startUsing")}}</option>
                  <option v-bind:value="0">{{$t("message.endUsing")}}</option>
                </select>

              </div>
            </div>
            <div class="span6 cbi-value" v-show="cur_config_intf.is_acct">
              <label class="cbi-value-title" >{{$t("message.radAccountServer")}} id</label>
              <div class="cbi-value-field">

                <select class="cbi-input-select" v-model="cur_config_intf.radacct_id" >
                  <option
                    v-for="obj in get_server_list('acct_list')"
                    v-bind:value="obj.id" >
                    {{obj.descr}} (ip: {{obj.ip}})
                  </option>
                </select>
              </div>
            </div>
          </div>
          <!-- @@mac无感知 -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.agentargs) && cur_config_intf.is_portal " v-show="nodeShow(templ_obj.agentargs) && visible.rad_auth_account">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.macAuth")}}</label>
              <div class="cbi-value-field">
                <select class="cbi-input-select" v-model="cur_config_intf.is_mac_auth"
                >
                  <option v-bind:value="1">{{$t("message.startUsing")}}</option>
                  <option v-bind:value="0">{{$t("message.endUsing")}}</option>
                </select>


              </div>
            </div>
            <div class="span6 cbi-value" v-show="cur_config_intf.is_mac_auth">
              <label class="cbi-value-title" >{{$t("message.macAuthSession")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                    v-validate.initial :data-vv-rules="nodeValidate(templ_obj.ifname)"
                    :data-vv-as="$t('message.macAuthSession')" name="templ_macauth_session"
                    v-model="cur_config_intf.sta_quota_session"
                  />
              </div>
            </div>
          </div>



          <!-- @@buttons -->
					<input type="button" v-bind:value="saveText" class="btn btn-info" v-on:click="subFromSave('net_interface_list')"/>
					<router-link :to="{name : 'net_interface_list'}" tag="button" class="btn btn-info">
						{{cacelText}}
					</router-link>
        </div>
      </div>
			</transition>
		`,
		data: function(){
			return {
				"saveText": Vue.t('message.saveBack'),
				"cacelText": Vue.t('message.cancel'),
				"title": Vue.t('message.interfaceRule'),
				"newText": Vue.t('message.newConstruction'),
				"editText":  Vue.t('message.redact'),
				"mode": "new",
        "visible": {
          "portal": true,
          "rad_auth_account" : false,
          "mac_auth": false,
          "src_policy": false
        },
        "cur_obj": {},
        "cur_config_intf" : {},
        "cur_config_idx" : -1,
        "tmp_obj": {
          "deny": {
            "host": "",
            "ip4": ""
          },
          "free": {
            "host": "",
            "ip4": ""
          }
        }
			}
		},
    created: function(){

      console.log("###########################")
      console.log(this.cur_obj)
      this.cur_obj = this.data_obj
      console.log(this.$route.params.index)
      console.log("###########################")
    },
		computed:{
			edit_obj: function(){
				//0为table的模版
				//index为数组的索引号,id为接口名称,表示唯一值
				//创建一个新的对象,以免污染原模版对象

				var idx=(parseInt(this.$route.params.index)+1).toString()
				var trow=this.$store.getters.network.interface[idx]
				var row={}

				if(trow){
					row = myclone(trow)
				}else{
					row = null
				}
        console.log(row)
				return row
			},
			templ_obj: function(){
				var tmp = myclone(this.$store.getters.network.interface[0])

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
			data_obj: function(){

				var tmpl = myclone(this.$store.getters.network.interface[0])
        var idx=(parseInt(this.$route.params.index)+1).toString()
        var trow=this.$store.getters.network.interface[idx]
        var edit_row={}
        var tmp_row = {}

        if(trow){
            edit_row = myclone(trow)
            this.mode = "update"
        }else{
            this.mode = "new"
            edit_row = null
        }
        var tmp_obj = {}
        tmp_row = mix_object(tmpl, edit_row, {})
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1111")
        console.log("current mode is " + this.mode)
        console.log(edit_row)
        console.log(tmpl)
        console.log(tmp_row)
        console.log(clone_cfg(tmp_row, {}))
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx2222")
        tmp_row = clone_cfg(tmp_row, {})
        delete tmp_row.$template

        console.log("init cur_obj end ....")
        console.log(tmp_row)
        tmp_row.agentargs.acl.deny.ip4 = convertArray(tmp_row.agentargs.acl.deny.ip4)
        tmp_row.agentargs.acl.deny.host = convertArray(tmp_row.agentargs.acl.deny.host)
        tmp_row.agentargs.acl.free.ip4 = convertArray(tmp_row.agentargs.acl.free.ip4)
        tmp_row.agentargs.acl.free.host = convertArray(tmp_row.agentargs.acl.free.host)
        //从list中查找
        this.search_config_intf(tmp_row)
        // this.cur_obj = tmp_row
        return tmp_row

			}
		},
		methods:{
      get_server_list: function(name) {
        if(name == "portal_list"){
          return this.$store.getters.portal_list
        }else if( name == "auth_list") {
          return this.$store.getters.auth_list
        }else if( name == "acct_list") {
          return this.$store.getters.acct_list
        }else if( name == "src_ip_list") {
          return this.$store.getters.src_ip_list
        }else if( name == "src_mac_list") {
          return this.$store.getters.src_mac_list
        }

      },
      changeVisible: function(name) {
        this.visible[name] = !this.visible[name]
      },
      search_config_intf: function(cur_tmp_obj){
        let res = this.$store.getters.config_intf_temp
        let i_type = 1
        let i_idx = -1
        if(cur_tmp_obj.iftype == "ethernet"){
          i_type = 0
        }
        res.if_type = i_type
        arrayEach(this.$store.getters.config_intf, function(idx, obj){


          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>   "+idx + " i_type " + i_type + "  p_id: "
            + cur_tmp_obj.phy_index + " v: " + cur_tmp_obj.vlanid + "")
          console.log("<<<<<<<<<<<<<<<<<<<<<<<<<   "+idx + " i_type " + i_type + "  phy: "
            + obj.phy + " vap: " + obj.vap + "")
          if(obj.if_type  == i_type
            && obj.phy == cur_tmp_obj.phy_index
            && obj.vap == cur_tmp_obj.vlanid ){
            console.log("found this interface config of " + idx)
            i_idx = idx
            res = Object.assign(obj, {})
            return false
          }

        })
        console.log(this.$store.getters.config_intf)
        this.cur_config_intf = res
        this.cur_config_idx = i_idx

      },
			subFromSave: function(url){
				//保存前无论是新建还是编辑,需要唯一判断

				var test={"ifname": this.cur_obj.ifname.value}
				var pass=uniqueTest(mystore.getters.network.interface, test, this.mode)
				if(!pass){
					alert(Vue.t('message.intNameNotOnly'))
					return false
				}
				var idx = -1
				if(this.mode == "new"){
					idx = 0
				}else{
					idx = (parseInt(this.$route.params.index)+1).toString()
				}

				console.log(idx)
				console.log(this.cur_obj)
				//触发state删除数据,index一定记得+1,因为0被忽略了
				this.$store.commit('interfaceRowUpdate', {
					"key": idx,
					"action": this.mode,
					"value": this.createRow(this.cur_obj)
				})
        console.log("----> "+ url)
				this.$router.push({name : url})

			},
			createRow : function(new_obj){
				var want={}
        want = this.cur_obj
        //同时插入数据
        if(this.cur_config_idx < 0){
          //应该使用store来处理
          this.$store.getters.config_intf.push(this.cur_config_intf)
          // this.$set(this.cur_obj.agentargs.acl.deny.host, len , item)
        }else{
          this.$store.getters.config_intf[this.cur_config_idx] = this.cur_config_intf
        }
				return want
			},
      acl_arr_act: function(arr_name, act, item){

        if(arr_name == "deny_ip4"){

          if(act == "add"){
            let len = 0
            arrayEach(this.cur_obj.agentargs.acl.deny.ip4, function(idx, obj){
              if(obj == item){
                alert(item + Vue.t('message.commonExists'))
                len = -1
                return false
              }
              len += 1
            })
            if(len >= 0){
              this.$set(this.cur_obj.agentargs.acl.deny.ip4, len , item)
              // this.cur_obj.agentargs.acl.deny.ip4.push(item)
            }
          }else if(act == "rm"){
            let index = this.cur_obj.agentargs.acl.deny.ip4.indexOf(item)
            if (index !== -1) {
                this.cur_obj.agentargs.acl.deny.ip4.splice(index, 1)
            }
          }else {
            //remove all
            this.cur_obj.agentargs.acl.deny.ip4 = []
          }
        }else if(arr_name == "deny_host"){
          if(act == "add"){
            let len = 0
            arrayEach(this.cur_obj.agentargs.acl.deny.host, function(idx, obj){
              if(obj == item){
                alert(item + Vue.t('message.commonExists'))
                len = -1
                return false
              }
              len += 1
            })
            if(len >= 0){
              this.$set(this.cur_obj.agentargs.acl.deny.host, len , item)
              // this.cur_obj.agentargs.acl.deny.ip4.push(item)
            }
          }else if(act == "rm"){
            let index = this.cur_obj.agentargs.acl.deny.host.indexOf(item)
            if (index !== -1) {
                this.cur_obj.agentargs.acl.deny.host.splice(index, 1)
            }
          }else {
            //remove all
            this.cur_obj.agentargs.acl.deny.host = []
          }
        }else if(arr_name == "free_ip4"){
          if(act == "add"){
            let len = 0
            arrayEach(this.cur_obj.agentargs.acl.free.ip4, function(idx, obj){
              if(obj == item){
                alert(item + Vue.t('message.commonExists'))
                len = -1
                return false
              }
              len += 1
            })
            if(len >= 0){
              this.$set(this.cur_obj.agentargs.acl.free.ip4, len , item)
              // this.cur_obj.agentargs.acl.deny.ip4.push(item)
            }
          }else if(act == "rm"){
            let index = this.cur_obj.agentargs.acl.free.ip4.indexOf(item)
            if (index !== -1) {
                this.cur_obj.agentargs.acl.free.ip4.splice(index, 1)
            }
          }else {
            //remove all
            this.cur_obj.agentargs.acl.free.ip4 = []
          }
        }else if(arr_name == "free_host"){
          if(act == "add"){
            let len = 0
            arrayEach(this.cur_obj.agentargs.acl.free.host, function(idx, obj){
              if(obj == item){
                alert(item + Vue.t('message.commonExists'))
                len = -1
                return false
              }
              len += 1
            })
            if(len >= 0){
              this.$set(this.cur_obj.agentargs.acl.free.host, len , item)
              // this.cur_obj.agentargs.acl.deny.ip4.push(item)
            }
          }else if(act == "rm"){
            let index = this.cur_obj.agentargs.acl.free.host.indexOf(item)
            if (index !== -1) {
                this.cur_obj.agentargs.acl.free.host.splice(index, 1)
            }
          }else {
            //remove all
            this.cur_obj.agentargs.acl.free.host = []
          }
        }
      },
      acl_rm_one: function(item, arr_name){
        this.acl_arr_act(arr_name, "rm", item)
      },
      acl_rm_all: function(arr_name){
        this.acl_arr_act(arr_name, "rm_all")

      },
      acl_add_one: function(item, arr_name){
        this.acl_arr_act(arr_name, "add", item)
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
          if (typeof(cur_obj.default.id.range) != 'undefined') {
              //myRule:  between:3,8
              if (!is_first) {
                   myRule += "|"
              } else {
                   is_first = true;
              }
              myRule += "between:" + cur_obj.default.id.range.min + "," + cur_obj.default.id.range.max
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
				//其他判断
				return myRule
			}
		},
    watch: {
      'cur_obj.agentargs.enabled': function(e){
        console.log("xxyyyyyyyyyyyyyyyyyzzzzzz")
        this.cur_config_intf.is_portal = this.cur_obj.agentargs.enabled ? 1 : 0
      },
      'cur_obj.ssid_name': function(e){
        console.log("xxyyyyyyyyyyyyyyyyyzzzzzz")
        this.cur_config_intf.ssid = this.cur_obj.ssid_name
      },
      'cur_obj.phy_index': function(e){
        console.log("xxyyyyyyyyyyyyyyyyyzzzzzz")
        this.cur_config_intf.phy = this.cur_obj.phy_index
      },
      'cur_obj.vlanid': function(e){
        console.log("xxyyyyyyyyyyyyyyyyyzzzzzz")
        this.cur_config_intf.vap = this.cur_obj.vlanid
      },
      'cur_config_intf.portal_id' : function(e){
        let want_ip = ""
        let cur_set_id =  this.cur_config_intf.portal_id

        arrayEach(this.get_server_list("portal_list"), function(idx, obj){

          if(obj.id  == cur_set_id ){
            want_ip = obj.ip
            return false
          }

        })
        this.cur_obj.agentargs.portal.prtipaddr = want_ip
      }


    }
	})

	return {
		interface_main: interface_main,
		interface_form: interface_form
	}
}()
