Vue.component('ns-accfg-ssid', {
  template: `

    <modal v-if="isOpen" @close="modalClose" @save="modalSave">
        <h3 slot="header">{{title_action}}{{title}} ssid</h3>
        <div slot="body">
          <!-- @@是否启用 -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.enabled)" v-show="nodeShow(templ_obj.enabled)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.whetherEnable")}}</label>
              <div class="cbi-value-field">
                <select class="cbi-input-select" v-model="cur_obj.enabled">
                  <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                  <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                </select>
              </div>
            </div>
            <div class="span4"></div>
          </div>
          <!-- @@ssid_name -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.essid)" v-show="nodeShow(templ_obj.essid)">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.SSIDName")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  v-validate.initial :data-vv-rules="nodeValidate(templ_obj.essid)"
                  :data-vv-as="$t('message.SSIDName')" name="templ_essid"
                  v-model="cur_obj.essid" />
                <div class="text-error" v-show="errors.has('templ_essid')">
                   {{ errors.first('templ_essid') }}
                </div>
              </div>
            </div>
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.whetherEnable")}}广播</label>
              <div class="cbi-value-field ">
                <select class="cbi-input-select" v-model="cur_obj.hidden">
                  <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                  <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- @@安全 settings  -->
          <a href="javascript:void(0);" v-on:click="changeVisible('security')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.security ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
               安全设置项<!--:TODO-->
            </div>
          </a>
          <br>
          <!-- @@ 安全选项-->
          <div class="row-fluid" v-show="visible.security">
            <div class="span12">
              <!-- @@ 安全list -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.security)" v-show="nodeShow(templ_obj.security)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >安全<!--:TODO --></label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.security.mode">
                      <option v-for="etext in templ_obj.security.default.mode.list" >{{etext}}</option>
                    </select>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@ 认证类型 -->
              <div class="row-fluid" v-if="isExistNode(templ_obj.security.default.wpacomb, cur_obj.security)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >安全<!--:TODO --></label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.security.wpacomb">
                      <option v-for="etext in templ_obj.security.default.wpacomb.list" >{{etext}}</option>
                    </select>
                  </div>
                </div>
                <div class="span6"></div>
              </div>
              <!-- @@ 加密算法 -->
              <div class="row-fluid" v-if="isExistNode(templ_obj.security.default.encryption, cur_obj.security)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >加密算法<!--:TODO --></label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.security.encryption">
                      <option v-for="etext in templ_obj.security.default.encryption.list" >{{etext}}</option>
                    </select>
                  </div>
                </div>
                <div class="span6"></div>
              </div>
              <!-- @@ 密码 -->
              <div class="row-fluid" v-if="isExistNode(templ_obj.security.default.wpapsk, cur_obj.security)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >密码<!--:TODO --></label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text" name="templ_security_wpapsk_passphrase"
                      v-model="cur_obj.security.wpapsk.passphrase" />
                    <div class="text-error" v-show="errors.has('templ_security_wpapsk_passphrase')">
                       {{ errors.first('templ_security_wpapsk_passphrase') }}
                    </div>

                  </div>
                </div>
                <div class="span6"></div>
              </div>

            </div><!-- @@安全选项-->
          </div>

          <!-- @@带宽 settings  -->
          <a href="javascript:void(0);" v-on:click="changeVisible('bandwidth')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.bandwidth ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
              带宽设置项<!--:TODO-->
            </div>
          </a>
          <br>
          <div class="row-fluid" v-show="visible.bandwidth">

            <div class="span12">
              <!-- @@trafficcontrol.enabled -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.trafficcontrol)" v-show="nodeShow(templ_obj.trafficcontrol)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.trafficcontrol")}}</label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.trafficcontrol.enabled">
                      <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                      <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                    </select>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@trafficcontrol.egress -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.trafficcontrol)" v-show="nodeShow(templ_obj.trafficcontrol) && cur_obj.trafficcontrol.enabled">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.trafficcontrolEgress")}}{{$t("message.whetherEnable")}}</label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.trafficcontrol.egress.enabled">
                      <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                      <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                    </select>
                  </div>
                </div>
                <div class="span6 cbi-value"  v-if="nodeExist(templ_obj.trafficcontrol)" v-show="nodeShow(templ_obj.trafficcontrol) && cur_obj.trafficcontrol.egress.enabled">
                  <label class="cbi-value-title" >{{$t("message.trafficcontrolEgress")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text"
                    v-validate.initial :data-vv-rules="nodeValidate(templ_obj.trafficcontrol.default.egress.default.speed)"
                    :data-vv-as="$t('message.trafficcontrolEgress')" name="templ_tc_egress_speed"
                      v-model.number="cur_obj.trafficcontrol.egress.speed" />
                    <div class="text-error" v-show="errors.has('templ_tc_egress_speed')">
                       {{ errors.first('templ_tc_egress_speed') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- @@trafficcontrol.ingress -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.trafficcontrol)" v-show="nodeShow(templ_obj.trafficcontrol) && cur_obj.trafficcontrol.enabled">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.trafficcontrolIngress")}}{{$t("message.whetherEnable")}}</label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.trafficcontrol.ingress.enabled">
                      <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                      <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                    </select>
                  </div>
                </div>
                <div class="span6 cbi-value"  v-if="nodeExist(templ_obj.trafficcontrol)" v-show="nodeShow(templ_obj.trafficcontrol) && cur_obj.trafficcontrol.ingress.enabled">
                  <label class="cbi-value-title" >{{$t("message.trafficcontrolIngress")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text" name="templ_tc_ingress_speed"
                      v-model="cur_obj.trafficcontrol.ingress.speed" />
                    <div class="text-error" v-show="errors.has('templ_tc_ingress_speed')">
                       {{ errors.first('templ_tc_ingress_speed') }}
                    </div>
                  </div>
                </div>
              </div>

            </div><!-- @@end of class='span12'-->

          </div>


          <!-- @@WACL settings  -->
          <a href="javascript:void(0);" v-on:click="changeVisible('wacl')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.wacl ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
              WACL设置 <!--:TODO-->
            </div>
          </a>
          <br>

          <!-- @@macacl.enabled -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.macacl)" v-show="nodeShow(templ_obj.macacl) && visible.wacl">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.macacl")}}</label>
              <div class="cbi-value-field">
                <select class="cbi-input-select" v-model="cur_obj.macacl.enabled">
                  <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                  <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                </select>
              </div>
            </div>
            <div class="span6"></div>
          </div>

          <!-- @@macacl.policy -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.macacl)" v-show="nodeShow(templ_obj.macacl) && visible.wacl && cur_obj.macacl.enabled">
            <div class="span6 cbi-value">
              <label class="cbi-value-title" >{{$t("message.macacl")}}</label>
              <div class="cbi-value-field">
                <select class="cbi-input-select" v-model="cur_obj.macacl.policy">
                  <option v-for="etext in templ_obj.macacl.default.policy.list" >{{etext}}</option>
                </select>
              </div>
            </div>
            <div class="span6"></div>
          </div>

          <!-- @@macacl.mac_list -->
          <div class="row-fluid" v-if="nodeExist(templ_obj.macacl)" v-show="nodeShow(templ_obj.macacl) && visible.wacl && cur_obj.macacl.enabled">

            <div class="span10 cbi-value">
              <label class="cbi-value-title" >{{$t("message.wacl")}}</label>
              <div class="cbi-value-field">
                <input type="text"  class="cbi-input-text"
                  name="templ_agentargs_portal_prturl"
                  v-model="tmp_obj.mac_list" />
                <a class="btn btn-info" v-on:click="acl_add_one(tmp_obj.mac_list, 'mac_list')">
                  <i class="icon icon-plus"></i>
                  {{$t("message.commonAdd")}}
                </a>
                <a class="btn btn-warning" v-on:click="acl_rm_all('mac_list')">
                  <i class="icon icon-remove"></i>
                  {{$t("message.commonFlush")}}
                </a>
                <div class="text-error" v-show="errors.has('templ_mac_list')">
                   {{ errors.first('templ_mac_list') }}
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
                    <tr v-for="obj,index in cur_obj.macacl.mac_list">
                      <td>
                        {{index}}
                      </td>
                      <td>
                        <input v-model="obj" />
                      </td>
                      <td>
                        <a class="btn btn-danger" v-on:click="acl_rm_one(obj, 'mac_list')">
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


          <!-- @@SSID高级 settings  -->
          <a href="javascript:void(0);" v-on:click="changeVisible('advanced')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.advanced ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
              高级设置项<!--:TODO-->
            </div>
          </a>
          <br>
          <div class="row-fluid" v-show="visible.advanced">

            <div class="span12">

              <!-- @@client isolate -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.l2isolation)" v-show="nodeShow(templ_obj.l2isolation)">
                <div class="span6 cbi-value">
                  <label class="cbi-value-title" >{{$t("message.isolate")}}</label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.isolate">
                      <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                      <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                    </select>
                    <div class="text-error" v-show="errors.has('templ_isolate')">
                       {{ errors.first('templ_isolate') }}
                    </div>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@wmm -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.wmm)" v-show="nodeShow(templ_obj.wmm)">
                <div class="span6 cbi-value" v-if="nodeExist(templ_obj.wmm)" v-show="nodeShow(templ_obj.wmm)">
                  <label class="cbi-value-title" >{{$t("message.wmm")}}</label>
                  <div class="cbi-value-field">
                    <select class="cbi-input-select" v-model="cur_obj.wmm">
                      <option v-bind:value="true">{{$t("message.startUsing")}}</option>
                      <option v-bind:value="false">{{$t("message.endUsing")}}</option>
                    </select>
                    <div class="text-error" v-show="errors.has('templ_wmm')">
                       {{ errors.first('templ_wmm') }}
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
                      name="templ_ssdi2vlan_vlanid"
                      v-model.number="cur_obj.ssid2vlan.id" />
                   <span class="text-error" v-show="errors.has('templ_ssdi2vlan_vlanid')">
                       {{ errors.first('templ_ssdi2vlan_vlanid') }}
                   </span>
                </div>
              </div>

              <!-- @@maxclients -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.maxclients)" v-show="nodeShow(templ_obj.maxclients)">
                <div class="span6 cbi-value" v-if="nodeExist(templ_obj.maxclients)" v-show="nodeShow(templ_obj.maxclients)">
                  <label class="cbi-value-title" >{{$t("message.maxclients")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text" name="templ_maxclients"
                      v-model="cur_obj.maxclients" />
                    <div class="text-error" v-show="errors.has('templ_maxclients')">
                       {{ errors.first('templ_maxclients') }}
                    </div>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

              <!-- @@minsignal -->
              <div class="row-fluid" v-if="nodeExist(templ_obj.minsignal)" v-show="nodeShow(templ_obj.minsignal)">
                <div class="span6 cbi-value" v-if="nodeExist(templ_obj.minsignal)" v-show="nodeShow(templ_obj.minsignal)">
                  <label class="cbi-value-title" >{{$t("message.minsignal")}}</label>
                  <div class="cbi-value-field">
                    <input type="text"  class="cbi-input-text" name="templ_minsignal"
                      v-model="cur_obj.minsignal" />
                    <div class="text-error" v-show="errors.has('templ_minsignal')">
                       {{ errors.first('templ_minsignal') }}
                    </div>
                  </div>
                </div>
                <div class="span6"></div>
              </div>

            </div><!--@@end of class='span12' -->
          </div>




          <!-- @@portal agentargs -->

          <a href="javascript:void(0);" v-on:click="changeVisible('portal')">
            <div style="border-bottom:1px solid ;">
              <span class="icon">
                <i v-bind:class="[visible.portal ? 'icon-minus-sign' :'icon-plus-sign']"></i>
              </span>
             {{$t("message.portalSetting")}}
            </div>
          </a>
          <br>
          <transition name="fade"
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown"
          >
            <div key="view_portal">
              <!-- @@是否启用portal -->
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


                  <!-- @@idletimeout @@accttimeout -->
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
            </div>

          </transition>


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
                    v-model="cur_config_intf.sta_quota_session" />
              </div>
            </div>
          </div>


        </div><!-- @@end of slot 'body'-->
    </modal>
  `,
  props: {
    radio_obj: Object,
    radio_idx: Number
  },
  data: function () {
    return {
      "isOpen": false,
      "title": "",
      "action": "new",
      "vap_idx": -1,
      "vap_obj": null,
      "cur_obj": {},
      "cur_config_intf" : {},
      "cur_config_idx" : -1,
      "visible": {
        "security": true,
        "bandwidth": false,
        "wacl": false,
        "advanced": false,
        "portal": true,
        "rad_auth_account" : false,
        "mac_auth": false
      },
      "tmp_obj": {
        "deny": {
          "host": "",
          "ip4": ""
        },
        "free": {
          "host": "",
          "ip4": ""
        },
        "mac_list" : "",
        "always_portal":{
          "ip4": ""
        },
        "security": {
          "account": {},
          "auth": {}
        }
      }
    }
  },
  computed: {

    templ_obj: function(){
      var tmp = myclone(this.radio_obj.vap[0])

      return tmp
    },
    cur_mode : function(){
      if(this.action == "new"){
        return "new"
      }else if(this.action == "update"){
        return "update"
      }
    },
    title_action : function(){
      if(this.cur_mode == "new"){
        return Vue.t('message.newConstruction')
      }else if(this.cur_mode == "update"){
        return Vue.t('message.redact')
      }
    }
  },
  methods: {
    modalOpen(info) {

      if(!this.isOpen){
        //当打开时，同时通知外部组件，即调用者
        this.$emit("ssidOpen")
        this.title = info.title
        this.action = info.action
        this.vap_idx = info.vap_idx
        this.vap_obj = info.vap_obj

        //不要在create的时候创建，在打开Modal的时候才开始渲染
        this.cur_obj = this.getDataObj()
        console.warn(this.cur_obj)
      }
      console.info("SSid modal open")
      this.isOpen = true
    },
    modalClose(info) {
      if(this.isOpen){
        this.$emit("ssidClose")
      }
      console.info("SSid modal close")
      this.isOpen = false
    },
    modalSave(info) {
      if(this.isOpen){
        let noErrors=true
        this.$validator.validateAll()
        noErrors = noErrors && (!this.errors.any())
        if(!noErrors){
          alert( Vue.t('message.haveError') );
          return false
        }
        //执行业务

        //生成new_vap 对象，并发送事件到父组件
        this.cur_obj.index = this.vap_idx
        this.cur_obj.ifname = this.cur_obj.pre_ifname + this.radio_idx + "-" + this.vap_idx
        this.$emit("ssidSave",
          // {
          //   "mode": "ap",
          //   "wds": false,
          //   "index": 1,
          //   "ifname": "ath0-1",
          //   "enabled": false,
          //   "essid": "Lintest223333",
          //   "hidden": false
          // }
         this.cur_obj, this.vap_obj, this.vap_idx, this.action)
        //自己把interface部分保存到全局的store中
        this.cur_config_intf.phy = this.radio_idx
        this.cur_config_intf.vap = this.vap_idx
        console.info(this.cur_config_intf)
        if(this.cur_config_idx < 0){
          //应该使用store来处理
          this.$store.getters.config_intf.push(myclone(this.cur_config_intf))
          // this.$set(this.cur_obj.agentargs.acl.deny.host, len , item)
        }else{
          this.$store.getters.config_intf[this.cur_config_idx] = myclone(this.cur_config_intf)
        }
      }
      console.info("SSid modal saved and close")
      this.isOpen = false

    },
    getDataObj(){
      console.log("in data_obj")
      //模版，带有规则
      var tmpl = myclone(this.templ_obj)
      //当前vap list中的索引，非interface_list中的索引
      var idx=(parseInt(this.vap_idx)+1).toString()
      //获得当前vap中的row对象
      var trow=this.vap_obj
      var edit_row={}
      //用于最终返回
      var tmp_row = {}


      if(this.cur_mode == "new"){
        edit_row = null
      }else{
        edit_row = myclone(trow)
      }
      //混合对象
      tmp_row = mix_object(tmpl, edit_row, {})
      tmp_row = clone_cfg(tmp_row, {})
      delete tmp_row.$template
      console.info(tmp_row)
      tmp_row.agentargs.acl.deny.ip4 = convertArray(tmp_row.agentargs.acl.deny.ip4)
      tmp_row.agentargs.acl.deny.host = convertArray(tmp_row.agentargs.acl.deny.host)
      tmp_row.agentargs.acl.free.ip4 = convertArray(tmp_row.agentargs.acl.free.ip4)
      tmp_row.agentargs.acl.free.host = convertArray(tmp_row.agentargs.acl.free.host)
      tmp_row.macacl.mac_list = convertArray(tmp_row.macacl.mac_list)

      //以下代码为历史原因，实际这个Server只有一个，不需要放到数组中
      //虽然openwrt中支持多个server...
      //非常之丑陋的代码..
      if(this.cur_mode == "new"){
        let tmp_server = {}
        tmp_server=clone_cfg(tmp_row.security.wpaenterprise.accounting.servers,{})
        tmp_row.security.wpaenterprise.accounting.servers = []
        tmp_row.security.wpaenterprise.accounting.servers.push(tmp_server)

        //翻译默认配置
        let tmp_server2 = {}
        tmp_server2=clone_cfg(tmp_row.security.wpaenterprise.authentication.servers,{})
        tmp_row.security.wpaenterprise.authentication.servers = []
        tmp_row.security.wpaenterprise.authentication.servers.push(tmp_server2)
      }else{
        //翻译默认配置
        let tmp_server = {}
        tmp_server=clone_cfg(tmp_row.security.wpaenterprise.accounting.servers,{})
        tmp_row.security.wpaenterprise.accounting.servers = []
        //只push第一个server
        tmp_row.security.wpaenterprise.accounting.servers.push(tmp_server[0])

        let tmp_server2 = {}
        tmp_server2=clone_cfg(tmp_row.security.wpaenterprise.authentication.servers,{})
        tmp_row.security.wpaenterprise.authentication.servers = []
        tmp_row.security.wpaenterprise.authentication.servers.push(tmp_server2[0])
      }




      //从list中查找
      this.search_config_intf(tmp_row)

      //值对象，不含有规则
      return tmp_row
    },
    get_server_list: function(name) {
      if(name == "portal_list"){
        return this.$store.getters.portal_list
      }else if( name == "auth_list") {
        return this.$store.getters.auth_list
      }else if( name == "acct_list") {
        return this.$store.getters.acct_list
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
        //初始化当前接口的属性
        res.if_type = i_type
        res.phy = this.radio_idx
        res.vap = this.vap_idx

        arrayEach(this.$store.getters.config_intf, function(idx, obj){

          if(obj.if_type  == i_type
            && obj.phy == res.phy
            && obj.vap == res.vap ){
            console.log("found this interface config of " + idx)
            i_idx = idx
            res = Object.assign(obj, {})
            return false
          }

        })
        //将当前配置指向res
        this.cur_config_intf = res
        this.cur_config_idx = i_idx
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
        }else if(arr_name == "mac_list"){
          if(act == "add"){
            let len = 0
            arrayEach(this.cur_obj.macacl.mac_list, function(idx, obj){
              if(obj == item){
                alert(item + Vue.t('message.commonExists'))
                len = -1
                return false
              }
              len += 1
            })
            if(len >= 0){
              this.$set(this.cur_obj.macacl.mac_list, len , item)
              // this.cur_obj.agentargs.acl.deny.ip4.push(item)
            }
          }else if(act == "rm"){
            let index = this.cur_obj.macacl.mac_list.indexOf(item)
            if (index !== -1) {
                this.cur_obj.macacl.mac_list.splice(index, 1)
            }
          }else {
            //remove all
            this.cur_obj.macacl.mac_list = []
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
    getParentValue: function(obj, parent){
      //返回上一层的值,逻辑存在,非物理上下级.用树的关系来描述if-else关系
      var p_key = obj["$parent"]
      var p_value = ""
      if(parent[p_key]){

      }else{
          alert( Vue.t('message.noParentValue') )
          throw "parent node not found"
      }
      if(this.cur_mode == "new"){
          p_value = parent[p_key]
      }else{
          p_value = parent[p_key]
      }

      return p_value
    },
    isExistNode: function(obj, parenet){

      let value = this.getParentValue(obj, parenet)
      let eq = false
      if(typeof(obj.$selector) == 'object'){
        arrayEach(obj.$selector, function(idx, obj){
          if( obj == value){
            eq = true
            return false
          }
        })
        return eq
      }else{
        return obj.$selector === value
      }

    },
    nodeExist: function(cur_obj){
        //判断cur_obj是否存在，不存在返回false，存在不做任何操作
        var exist= true ;
        if( typeof(cur_obj)== 'undefined' ){
          return exist=false
        }
        return exist
    },
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
      console.warn(cur_obj)
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
   'cur_obj.essid': function(e){
      console.log("xxyyyyyyyyyyyyyyyyyzzzzzz")
      this.cur_config_intf.ssid = this.cur_obj.essid
    },
    'cur_obj.agentargs.enabled': function(e){
      console.log("xxyyyyyyyyyyyyyyyyyzzzzzz")
      this.cur_config_intf.is_portal = this.cur_obj.agentargs.enabled ? 1 : 0
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
      if(this.cur_obj.agentargs && this.cur_obj.agentargs.portal){
        this.cur_obj.agentargs.portal.prtipaddr = want_ip
      }

    }

  }
})
