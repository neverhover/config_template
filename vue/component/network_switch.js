var switch_templ = function() {
  var switch_main = Vue.component("switch_main",{
  template: `
      <div>
        <router-link :to="{name : 'net_switch_new'}" tag="a" class="btn btn-primary">
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
            ref="ref_grid_switch_list"
          >
          <ns-accfg-pager
            slot="pager"
            :show-pager=true
            :total-page=pTotal
            :show-items=4
            :ref-tableid=tableId
            ref="ref_pager_switch_list"
          >
          </ns-accfg-pager>
          </ns-accfg-grid>
        </div>
      </div>
    `,
  data:function(){
    return {
      tableId:"grid_switch_list",
      header:{
        keys:[
          "name",
          "mtu",
          "mode",
          "vport"
        ],
        text:[
          Vue.t('message.interfaceName'),
          "mtu",
          Vue.t('message.systemPattern'),
          Vue.t('message.portNum')
        ],
        ops: {
          "edit":{
            "url": 'net_switch_edit',
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

          "mode":{
            cb:function(key,obj,val){

              if(val == "ovs"){
                  return Vue.t('message.OVS_switch')
              }else if(val == "system"){
                  return Vue.t('message.SysBridge')
              }
            }
          },
          "vport":{
            cb:function(key,obj,val){
              if(val.length){
                return val.length
              }else{
                return Object.keys(val).length
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
    return sliceArray(this.$store.getters.network.switch,1)
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
        this.$store.commit('switchRowUpdate', {
      "key": this_idx,
      "action": "delete",
      "value": ""
        })
    }
      },
  },


    })











  var switch_form = Vue.component("switch_form",{
  template: `
      <transition name="custom-classes-transition"
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown"
        >
        <div>
          {{cur_mode}}{{title}}

          <br>
          <!-- @@name -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.name)" v-show="nodeShow(templ_obj.name)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.switchTnterfaceName")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.name)"
                  :data-vv-as="$t('message.switchTnterfaceName')" name="interfce_name"
                  v-model="cur_obj.name" v-bind:readonly="mode == 'new'? false: true"
                />
                <div class="text-error" v-show="errors.has('interfce_name')">
                  {{ errors.first('interfce_name') }}
                </div>
              </div>
            </div>
            <div class="span6"></div>
          </div>
          <!-- @@mtu -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.mtu)" v-show="nodeShow(templ_obj.mtu)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >mtu:</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.mtu)"
                  :data-vv-as="$t('message.mtu')" name="templ_mtu"
                  v-model="cur_obj.mtu"
                />
                <div class="text-error" v-show="errors.has('templ_mtu')">
                   {{ errors.first('templ_mtu') }}
                </div>
              </div>
            </div>
            <div class="span6"></div>
          </div>
          <!-- @@mode -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.mode)" v-show="nodeShow(templ_obj.mode)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.switchModel")}}</label>
              <div class="cbi-value-field">
                <select v-if="mode == 'new'"
                class="cbi-input-select"
                v-model="cur_obj.mode"
                >
                  <option
                    v-for="swmode in templ_obj.mode.list"
                    v-bind:value="swmode" >
                    {{convertMode(swmode)}}
                  </option>
                </select>
                <input v-if="mode == 'update'" type="hidden" class="cbi-input-text"
                v-model="cur_obj.mode"
                />
                <input v-if="mode == 'update'" type="text" class="cbi-input-text"
                v-model="convertMode(cur_obj.mode)"
                readonly="true"/>
              </div>

            </div>
            <div class="span6"></div>
          </div>



          <!-- @@swmode template -->
          <transition-group name="switch-classes-transition"
              enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut"
          >
            <div v-if="'ovs' == cur_obj.mode" key="ovs_view">
              ovs vport
              <!--@@ovs port编辑 -->
              <div >
                <hr>
                <a @click="addItem" class="btn btn-info">
                  <template v-if="item_mode == 'new'">
                  <i class="icon icon-plus"></i>
                  {{newText}}
                  </template>
                  <template v-else>
                    <i class="icon icon-edit"></i>
                    {{editText}}
                  </template>
                </a>

                <div class="row-fluid">
                  <div class="span6 cbi-value">
                    <label class="cbi-value-title" >{{$t("message.thePortName")}}</label>
                    <div class="cbi-value-field">
                      <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.portname)"
                      :data-vv-as="$t('message.thePortName')" name="ovs_port_name"
                      v-model="ovsTmpRow.portname.value"
                      />
                      <div class="text-error" v-show="errors.has('ovs_port_name')">
                        {{ errors.first('ovs_port_name') }}
                      </div>
                    </div>
                  </div>
                  <div class="span6  cbi-value">
                    <label class="cbi-value-title" >{{$t("message.thePortNumber")}}</label>
                    <div class="cbi-value-field">
                      <input type="text" class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.portnumber)"
                      :data-vv-as="$t('message.thePortNumber')" name="ovs_port_number"
                      v-model="ovsTmpRow.portnumber.value"
                      />
                      <div class="text-error" v-show="errors.has('ovs_port_number')">
                        {{ errors.first('ovs_port_number') }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row-fluid">
                  <div class="span6 cbi-value">
                    <label class="cbi-value-title" >{{$t("message.vlanType")}}</label>
                    <div class="cbi-value-field">
                      <select
                      class="cbi-input-select"
                      v-model="ovsTmpRow.vlan_type.value"
                      >
                        <option
                          v-for="vt in ovsTmpRow.vlan_type.list"
                          v-bind:value="vt" >
                          {{vt}}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="span6 cbi-value" v-if="isExistNode(ovsTmpRow.vlan_id_trunk,ovsTmpRow)">
                    <label class="cbi-value-title" >vlan id:</label>
                    <div class="cbi-value-field">
                      <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.vlan_id_trunk)"
                      :data-vv-as="$t('message.vlan_id')" name="ovs_vlan_id_trunk"
                      v-model="ovsTmpRow.vlan_id_trunk.value"
                      />
                      <div class="text-error" v-show="errors.has('ovs_vlan_id_turnk')">
                        {{ errors.first('ovs_vlan_id_trunk') }}
                      </div>
                    </div>

                  </div>
                  <div class="span6 cbi-value" v-if="isExistNode(ovsTmpRow.vlan_id_access,ovsTmpRow)">
                    <label class="cbi-value-title" >vlan id:</label>
                    <div class="cbi-value-field">
                      <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.vlan_id_access)"
                      :data-vv-as="$t('message.vlan_id')" name="ovs_vlan_id_access"
                      v-model="ovsTmpRow.vlan_id_access.value"
                      />
                      <div class="text-error" v-show="errors.has('ovs_vlan_id_access')">
                        {{ errors.first('ovs_vlan_id_access') }}
                      </div>
                    </div>

                  </div>
                </div>

                <div class="row-fluid">
                  <div class="span6 cbi-value">
                    <label class="cbi-value-title" >{{$t("message.thePortType")}}</label>
                    <div class="cbi-value-field">
                      <select
                      class="cbi-input-select"
                      v-model="ovsTmpRow.port_type.value"
                      >
                        <option
                          v-for="vt in ovsTmpRow.port_type.list"
                          v-bind:value="vt" >
                          {{vt}}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="span6"></div>
                </div>

                <div class="row-fluid">
                  <div class="span6 cbi-value" v-if="isExistNode(ovsTmpRow.vni,ovsTmpRow)">
                    <label class="cbi-value-title" >vni:</label>
                    <div class="cbi-value-field">
                      <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.vni)"
                      :data-vv-as="$t('message.vni')" name="ovs_vni"
                      v-model="ovsTmpRow.vni.value"
                      />
                      <div class="text-error" v-show="errors.has('ovs_vni')">
                        {{ errors.first('ovs_vni') }}
                      </div>
                    </div>

                  </div>
                  <div class="span6  cbi-value " v-if="isExistNode(ovsTmpRow.remote_ip,ovsTmpRow)">
                    <label class="cbi-value-title" >{{$t("message.toIPAddress")}}</label>
                    <div class="cbi-value-field">
                      <input type="text" style="width:80%" class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.remote_ip)"
                      :data-vv-as="$t('message.toIPAddress')" name="remote_ip"
                      v-model="ovsTmpRow.remote_ip.value"
                      />
                      <div class="text-error" v-show="errors.has('remote_ip')">
                        {{ errors.first('remote_ip') }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row-fluid">
                  <div class="span6 cbi-value">
                    <label class="cbi-value-title" >{{$t("message.whetherWifiInt")}}</label>
                    <div class="cbi-value-field">
                      <select class="cbi-input-select" v-model="ovsTmpRow.is_wifi.value"
                      >
                        <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                        <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                      </select>
                    </div>

                  </div>
                  <div class="span6"></div>
                </div>

                <div class="row-fluid">
                  <div class="span6 cbi-value" v-if="isExistNode(ovsTmpRow.radio_index,ovsTmpRow)">
                    <label class="cbi-value-title" >{{$t("message.radioIndex")}}</label>
                    <div class="cbi-value-field">
                      <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.radio_index)"
                      :data-vv-as="$t('message.radioIndex')" name="ovs_radio_index"
                      v-model="ovsTmpRow.radio_index.value"
                      />
                      <div class="text-error" v-show="errors.has('ovs_radio_index')">
                        {{ errors.first('ovs_radio_index') }}
                      </div>
                    </div>

                  </div>
                  <div class="span6  cbi-value " v-if="isExistNode(ovsTmpRow.ssid,ovsTmpRow)">
                    <label class="cbi-value-title" >{{$t("message.ssidName")}}</label>
                    <div class="cbi-value-field">
                      <input type="text" style="width:80%" class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(ovsTmpRow.ssid)"
                      :data-vv-as="$t('message.ssidName')" name="ovs_ssid"
                      v-model="ovsTmpRow.ssid.value"
                      />
                      <div class="text-error" v-show="errors.has('ovs_ssid')">
                        {{ errors.first('ovs_ssid') }}
                      </div>
                    </div>
                  </div>
                </div>
                <hr>
              </div>
              <div>
                <ns-accfg-grid
                  :table-id=ovs_header.tableId
                  :header=ovs_header
                  :rows=rows
                  :col-callback=ovs_header.colCallbacks
                  :rows-start=ovs_header.pStart
                  :rows-limit=ovs_header.pLimit
                  ref="ref_grid_switch_ovs_list"
                >
                  <ns-accfg-pager
                    slot="pager"
                    :show-pager=true
                    :total-page=ovs_ptotal
                    :show-items=4
                    :ref-tableid=ovs_header.tableId
                    ref="ref_pager_switch_ovs_vport_list"
                  >
                  </ns-accfg-pager>
                </ns-accfg-grid>
              </div>


            </div>
          </transition-group>
          <transition-group name="switch-classes-transition2"
              enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut"
          >
            <div v-if="'system' == cur_obj.mode" key="system_view">
              system vport
              <!--@@system port编辑 -->
              <div >
                <hr>
                <a @click="addItem" class="btn btn-info">
                  <template v-if="item_mode == 'new'">
                  <i class="icon icon-plus"></i>
                  {{newText}}
                  </template>
                  <template v-else>
                    <i class="icon icon-edit"></i>
                    {{editText}}
                  </template>
                </a>

                    <div class="row-fluid" v-if="nodeExist(systemTmpRow.portname)" v-show="nodeShow(systemTmpRow.portname)">
                  <div class="span6 cbi-value">
                    <label class="cbi-value-title" >{{$t("message.thePortNames")}}</label>
                    <div class="cbi-value-field">
                      <input type="text"  class="cbi-input-text"
                        v-validate.initial :data-vv-rules="nodeValidate(systemTmpRow.portname)"
                        :data-vv-as="$t('message.thePortNames')" name="sys_portname"
                        v-model="systemTmpRow.portname.value"
                      />
                          <div class="text-error" v-show="errors.has('sys_portname')">
                             {{ errors.first('sys_portname') }}
                           </div>
                    </div>
                  </div>
                  <div class="span6  cbi-value">
                    <label class="cbi-value-title" >vlan id:</label>
                    <div class="cbi-value-field">
                      <input type="text" style="width:80%" class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(systemTmpRow.vlan_id)"
                      :data-vv-as="$t('message.vlan_id')" name="vlan_id"
                      v-model="systemTmpRow.vlan_id.value"
                      />
                      <div class="text-error" v-show="errors.has('vlan_id')">
                         {{ errors.first('vlan_id') }}
                      </div>
                    </div>
                  </div>
                </div>

                    <div class="row-fluid" v-if="nodeExist(systemTmpRow.is_wifi)" v-show="nodeShow(systemTmpRow.is_wifi)">
                  <div class="span6 cbi-value">
                    <label class="cbi-value-title" >{{$t("message.whetherWifiInt")}}</label>
                    <div class="cbi-value-field">
                      <select class="cbi-input-select" v-model="systemTmpRow.is_wifi.value"
                      >
                        <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                        <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                      </select>
                    </div>

                  </div>
                  <div class="span6"></div>
                </div>

                    <div class="row-fluid" v-if="nodeExist(systemTmpRow.radio_index)" v-show="nodeShow(systemTmpRow.radio_index)">
                  <div class="span6 cbi-value" v-if="isExistNode(systemTmpRow.radio_index,systemTmpRow)">
                    <label class="cbi-value-title" >{{$t("message.radioIndex")}}</label>
                    <div class="cbi-value-field">
                      <input type="text"  class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(systemTmpRow.radio_index)"
                      :data-vv-as="$t('message.radioIndex')" name="radio_index"
                      v-model="systemTmpRow.radio_index.value"
                      />
                      <div class="text-error" v-show="errors.has('radio_index')">
                         {{ errors.first('radio_index') }}
                       </div>
                    </div>

                  </div>
                  <div class="span6  cbi-value " v-if="isExistNode(systemTmpRow.ssid,systemTmpRow)">
                    <label class="cbi-value-title" >{{$t("message.ssidName")}}</label>
                    <div class="cbi-value-field">
                      <input type="text" style="width:80%" class="cbi-input-text"
                      v-validate.initial :data-vv-rules="nodeValidate(systemTmpRow.ssid)"
                      :data-vv-as="$t('message.ssidName')" name="ssid"
                      v-model="systemTmpRow.ssid.value"
                      />
                      <div class="text-error" v-show="errors.has('ssid')">
                         {{ errors.first('ssid') }}
                      </div>
                    </div>
                  </div>
                </div>
                <hr>

              </div>

              <div>
                <ns-accfg-grid
                  :table-id=system_header.tableId
                  :header=system_header
                  :rows=rows
                  :col-callback=system_header.colCallbacks
                  :rows-start=system_header.pStart
                  :rows-limit=system_header.pLimit
                  ref="ref_grid_switch_system_list"
                >
                  <ns-accfg-pager
                    slot="pager"
                    :show-pager=true
                    :total-page=system_ptotal
                    :show-items=4
                    :ref-tableid=system_header.tableId
                    ref="ref_pager_switch_system_vport_list"
                  >
                  </ns-accfg-pager>
                </ns-accfg-grid>
              </div>

            </div>
          </transition-group>



          <input type="button" v-bind:value="saveText" class="btn btn-info" v-on:click="subFromSave('net_switch_list')"/>

          <router-link :to="{name : 'net_switch_list'}" tag="button" class="btn btn-info">
            {{cacelText}}
          </router-link>
        </div>
      </transition>
    `,
  data: function(){
      return {
    "saveText": Vue.t('message.saveBack'),
    "cacelText": Vue.t('message.cancel'),
    "title": Vue.t('message.exchangeRules'),
    "newText": Vue.t('message.addSave'),
    "editText": Vue.t('message.editSave'),
    "opsText": Vue.t('message.handle'),
    "mode": "new",
    "cur_obj": {},
    "item_mode": "new",
    "item_obj": {},
    "item_index": 0,
    "pStart": 0,
    "pLimit": 8,
    "pTotal": 1,
    "system_header":{
        "tableId": "grid_switch_system_vport_list",
        "text":[
      Vue.t('message.interfaceName'),
      Vue.t('message.vlanId'),
      Vue.t('message.whetherWifi'),
      Vue.t('message.radioNumber'),
      Vue.t('message.ssidName')
        ],
        "keys":[
      "portname",
      "vlan_id",
      "is_wifi",
      "radio_index",
      "ssid"
        ],
        "ops": {
      "edit":{
          "event": true,
          "text": Vue.t('message.redact'),
          "type": 'system',
          "params": [
        {
            "key": "id",
            "col": "interface"
        }
          ],
          "class": "btn btn-primary"
      },
      "delete":{
          "event": true,
          "text": Vue.t('message.delete'),
          "type": 'system',
          "params": [
          ],
          "class": "btn btn-danger"
      }
        },
        "opsText": Vue.t('message.handle'),
        "colCallbacks": {

      "is_wifi":{
          cb:function(key,obj,val){

        if(val == true){
            return Vue.t('message.right')
        }else{
            return Vue.t('message.deny')
        }
          }
      }
        },
        pStart: 0,
        pLimit: 8,
        pTotal: 1,
    },
    systemTmpRow: {},
    ovs_header:{
        "tableId": "grid_switch_ovs_vport_list",
        "text":[
      Vue.t('message.interfaceName'),
      Vue.t('message.thePortNum'),
      Vue.t('message.vlanTypes'),
      Vue.t('message.vlanId'),
      Vue.t('message.portTypes'),
      Vue.t('message.IPAddress'),
      Vue.t('message.whetherWifi'),
      Vue.t('message.radioNumber'),
      Vue.t('message.ssidName')
        ],
        "keys":[
      "portname",
      "portnumber",
      "vlan_type",
      "vlan_id",
      "port_type",
      "remote_ip",
      "is_wifi",
      "radio_index",
      "ssid"
        ],
        "ops": {
      "edit":{
          "event": true,
          "type": 'ovs',
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
          "event": true,
          "text": Vue.t('message.delete'),
          "type": 'ovs',
          "params": [
          ],
          "class": "btn btn-danger"
      }
        },
        "opsText": Vue.t('message.handle'),
        "colCallbacks": {

      "is_wifi":{
          cb:function(key,obj,val){

        if(val == true){
            return Vue.t('message.right')
        }else{
            return Vue.t('message.deny')
        }
          }
      }
        },
        pStart: 0,
        pLimit: 8,
        pTotal: 1,
    },
    ovsTmpRow:{}
      }
  },
  created: function(){
      Bus.$on('grid-row-delete', this.rowDelete)
      Bus.$on('grid-row-edit', this.rowEdit)
      console.log("###########################")
      console.log(this.cur_obj)
      this.cur_obj = this.data_obj
      console.log("###########################")
  },
  computed:{
    edit_obj: function(){
        //0为table的模版
        //index为数组的索引号,id为接口名称,表示唯一值
        //创建一个新的对象,以免污染原模版对象
        var idx=(parseInt(this.$route.params.index)+1).toString()
        var trow=this.$store.getters.network.switch[idx]
        var row={}

        if(trow){
            row = myclone(trow)
        }else{
            row = null
        }

        return row
    },
    templ_obj: function(){
      var tmp = myclone(this.$store.getters.network.switch[0])

      return tmp
    },
    cur_mode: function(){
        console.log("cur page mode changed............."+ this.mode)
        if(this.mode == "update"){
            return this.editText
        }else{
            return this.newText
        }
    },
    data_obj: function(){
      var tmpl = myclone(this.$store.getters.network.switch[0])
      var idx=(parseInt(this.$route.params.index)+1).toString()
      var trow=this.$store.getters.network.switch[idx]
      var edit_row={}

      if(trow){
          edit_row = myclone(trow)
          this.mode = "update"
      }else{
          this.mode = "new"
          edit_row = null
      }

      var tmp_obj = {}
      if(this.mode == "new"){
          tmp_obj.name = this.templ_obj.name.default
          tmp_obj.mtu = this.templ_obj.mtu.default
          tmp_obj.mode = this.templ_obj.mode.default
          tmp_obj.vport = []

      }else{
          tmp_obj.name = this.edit_obj.name
          tmp_obj.mtu = this.edit_obj.mtu
          tmp_obj.mode = this.edit_obj.mode
          tmp_obj.vport = this.edit_obj.vport
      }

      this.initItem()
      console.log("init cur_obj end ....")
      this.cur_obj = Object.assign({}, tmp_obj)
      return tmp_obj

    },
    rows: {
      get : function(){
          return sliceArray(this.cur_obj.vport, 0)
      }
    },
    system_ptotal: function(){
      return Math.ceil(this.rows.length / this.pLimit) == 0 ? 1 : Math.ceil(this.rows.length / this.pLimit)
    },
    ovs_ptotal: function(){
      return Math.ceil(this.rows.length / this.pLimit) == 0 ? 1 : Math.ceil(this.rows.length / this.pLimit)
    }
  },
  methods:{
      addItem: function(){
    var test = {}
    var new_obj = {}
    if(this.cur_obj.mode == "system"){
        test={"portname": this.systemTmpRow.portname.value}
        new_obj = this.systemTmpRow
    }else if(this.cur_obj.mode == "ovs"){
        test={"portname": this.ovsTmpRow.portname.value}
        new_obj = this.ovsTmpRow
    }

    var pass=uniqueTest(this.cur_obj.vport, test, this.item_mode)
    if(!pass){
        alert( Vue.t("message.modifyAgain") );
        return false
    }
    var idx = -1
    if(this.item_mode == "new"){
        idx = 0
    }else{
        idx= parseInt(this.item_index).toString()
    }
    ret = resetVueRows(this.cur_obj.vport, {
        "key": idx,
        "action": this.item_mode,
        "value": this.createItem(new_obj)
    })

    Vue.set(this.cur_obj, "vport", ret)
    this.item_mode = "new"
    this.initItem()
    console.log("add Item done .......................................")
      },
      initItem: function(){
    for(var i in this.templ_obj.vport){
        var line = this.templ_obj.vport[i]

        var tmp_line = {}
        if(line["$selector"] == "system"){
      tmp_line = myclone(line.default)
      mix_object(tmp_line,{},{})
      this.systemTmpRow= Object.assign({},tmp_line)
        }else if(line["$selector"] == "ovs"){

      tmp_line= myclone(line.default)
      mix_object(tmp_line,{},{})
      this.ovsTmpRow= Object.assign({},tmp_line)

        }
    }
      },
      rowEdit: function(tid,param,row,index){
    if( (tid == this.system_header.tableId) || (tid == this.ovs_header.tableId)){
        //更新时,修改当前模式,并且把对象清零0后修改
        console.log(row)
        this.item_mode = "update"
        this.item_obj = row
        this.createItem(row)
        this.item_index = index
        if(this.cur_obj.mode == "system"){
      mix_object(this.systemTmpRow, row)
        }else if(this.cur_obj.mode == "ovs"){
      mix_object(this.ovsTmpRow, row)
        }
    }

      },
      rowDelete: function(tid,param,row,index){
    //事件触发了2次 on f5

    if( (tid == this.system_header.tableId) || (tid == this.ovs_header.tableId)){
        var this_idx = parseInt(index).toString()
        var ret = resetVueRows(this.cur_obj.vport, {
      "key": this_idx,
      "action": "delete",
      "value": ""
        })

        Vue.set(this.cur_obj, "vport", ret)
        //          this.cur_obj.vport = ret
        //          this.rows.splice(index,1)

    }
    console.log("event on rowDelete2")
      },

      convertMode: function(swmode){
    switch(swmode){
    case "ovs":
        return Vue.t('message.ovsBridgeModel');
        break;
    case "system":
        return Vue.t('message.systemPattern');
        break;
    default:
        return Vue.t('message.notSupportMode');
        break;
    }
      },
      getParentValue: function(obj, parent){
    //返回上一层的值,逻辑存在,非物理上下级.用树的关系来描述if-else关系
    var p_key = obj["$parent"]
    var p_value = ""

    if(parent[p_key]){

    }else{
        alert( Vue.t('message.noParentValue') )
        throw "parent node not found"
    }
    if(this.mode == "new"){
        p_value = parent[p_key].value
    }else{
        p_value = parent[p_key].value
    }

    return p_value
      },
      isExistNode: function(obj, parenet){

    return obj.$selector === this.getParentValue(obj, parenet)
      },
      subFromSave: function(url){
    //保存前无论是新建还是编辑,需要唯一判断

    var test={"name": this.cur_obj.name.value}
    var pass=uniqueTest(mystore.getters.network.switch, test, this.mode)
    if(!pass){
        alert( Vue.t('message.intNameNotOnly') );
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
    this.$store.commit('switchRowUpdate', {
        "key": idx,
        "action": this.mode,
        "value": this.createRow(this.cur_obj)
    })

    this.$router.push({name : url})
    //        console.log("----> "+ url)

      },
      swmodeChange: function(e){
    console.log(e)
      },
      createRow : function(new_obj){
    var want={}
    want = this.cur_obj
    return want
      },
      createItem : function(new_obj){
    var tmp_obj = myclone(new_obj)

    if(this.cur_obj.mode == "system"){
        tmp_obj = clone_cfg(tmp_obj,{})

    }else if(this.cur_obj.mode == "ovs"){
        //制作之前,先根据类型,删除对应节点
        //此方法不好
        if(tmp_obj.vlan_type.value == "trunk"){
      delete tmp_obj.vlan_id_access
        }else if(tmp_obj.vlan_type.value == "access"){
      delete tmp_obj.vlan_id_trunk
        }
        tmp_obj = clone_cfg(tmp_obj,{})

    }

    return tmp_obj
      },
      // v-if=" nodeExist(cur_obj.sys_syslog.level) "
      nodeExist: function(templ_obj){
    console.log(templ_obj)
    //判断cur_obj是否存在，不存在返回false，存在不做任何操作
    var exist= true ;
    if( typeof(templ_obj)== 'undefined' ){
        return exist=false
    }
    return exist
      },
      //v-show=" nodeShow(templ_obj.sys_syslog.level) "
      nodeShow: function(templ_obj){
    // 判断templ_obj中的spec属性中的内容 或者 templ_obj中spec属性中的show 是否要显示,不显示赋值为true，只显示spec以外的内容；
    // 如果显示 不做任何操作，显示spec中的内容就可以了
    //json 中-->做数据的显示/隐藏 show：true/false
    var show_exist ;

    if( typeof(templ_obj.spec) == 'undefined' || typeof(templ_obj.spec.show) == 'undefined'){
        show_exist = true
    }else {
        show_exist = templ_obj.spec.show
    }
    return show_exist
      },
      //v-show=" nodeShows(templ_obj.level) "
      nodeShows: function(templ_obj){
    // 判断templ_obj中的spec属性中的内容 或者 templ_obj中spec属性中的show 是否要显示,不显示赋值为true，只显示spec以外的内容；
    // 如果显示 不做任何操作，显示spec中的内容就可以了
    //json 中-->做数据的显示/隐藏 show：true/false
    var show_exist ;

    if( typeof(templ_obj.default.spec) == 'undefined' || typeof(templ_obj.default.spec.show) == 'undefined'){
        show_exist = true
    }else {
        show_exist = templ_obj.default.spec.show
    }
    return show_exist
      },
      // 验证
      nodeValidate: function(templ_obj){

    var myRule= "required";
    console.log("templ_obj.type:"+templ_obj.type);

    var is_first = false;
    if( typeof(templ_obj.type) == 'undefined' ){
        //判断是否定义了数据类型，如果未定义，返回空字符串
        return "";
    }
    if( typeof(templ_obj.spec) == 'undefined' ){
        //未定义spec，无法执行后续逻辑
        return "";
    }

    //判断是否是number
    if( templ_obj.type == 'number' ) {
        //port-->如果是number，那么根据range组合出字符串,表示数字的取值范围
        if (typeof(templ_obj.spec.range) != 'undefined') {
        //myRule:  between:3,8
        if (!is_first) {
            myRule += "|"
        } else {
            is_first = true;
        }
        myRule += "between:" + templ_obj.spec.range.min + "," + templ_obj.spec.range.max;
        // console.log(myRule)
        }

    }else if( templ_obj.type == 'string' ){//判断是否是string
        //如果是string，那么根据range组合出字符串，.表示字符串的长度
        if(typeof(templ_obj.spec.range) != 'undefined'){
      //myRule:  min:必须至少有 3 字符,max:不能大于 8 字符

        if( ! is_first){
            myRule +="|"
        }else{
            is_first = false
        }
        myRule += "min:"+templ_obj.spec.range.min+"|max:"+templ_obj.spec.range.max;
        // console.log(myRule)
        }

    }else if( templ_obj.type == 'object' ){//判断是否是object

        //port-->如果是object,指出对象的取值范围
        if (typeof(templ_obj.value.speed.range) != 'undefined') {
      //myRule:  between:3,8
      if (!is_first) {
          myRule += "|"
      } else {
          is_first = true;
      }
      myRule += "between:" + templ_obj.value.speed.range.min + "," + templ_obj.value.speed.range.max;
      // console.log(myRule)
        }

    }else if( templ_obj.type == 'ipv4_address' ){//判断是否是ip

        //port-->如果是ip，那么根据ipv4_address规则限制必须符合ip地址要求
        if (typeof(templ_obj.value) != 'undefined') {
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
        if( typeof(templ_obj.spec.required) != 'undefined'){

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
  watch:{
      'cur_obj.mode' : function(e){
    console.log(e)
    if(this.mode == "new"){
        this.cur_obj.vport = []
        console.log("mode changed")
        this.initItem()
    }

      }
  }
    })

    return {
  switch_main: switch_main,
  switch_form: switch_form
    }
}()
