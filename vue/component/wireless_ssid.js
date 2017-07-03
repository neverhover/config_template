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
        if(this.cur_config_idx < 0){
          //应该使用store来处理
          this.$store.getters.config_intf.push(this.cur_config_intf)
          // this.$set(this.cur_obj.agentargs.acl.deny.host, len , item)
        }else{
          this.$store.getters.config_intf[this.cur_config_idx] = this.cur_config_intf
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
      // tmp_row.agentargs.acl.deny.ip4 = convertArray(tmp_row.agentargs.acl.deny.ip4)
      // tmp_row.agentargs.acl.deny.host = convertArray(tmp_row.agentargs.acl.deny.host)
      // tmp_row.agentargs.acl.free.ip4 = convertArray(tmp_row.agentargs.acl.free.ip4)
      // tmp_row.agentargs.acl.free.host = convertArray(tmp_row.agentargs.acl.free.host)
      //从list中查找
      this.search_config_intf(tmp_row)

      //值对象，不含有规则
      return tmp_row
    },
    search_config_intf: function(cur_tmp_obj){
        let res = this.$store.getters.config_intf_temp
        let i_type = 1
        let i_idx = -1
        if(cur_tmp_obj.iftype == "ethernet"){
          i_type = 0
        }
        res.if_type = i_type
        res.phy = this.radio_idx
        res.vap = this.vap_idx
        arrayEach(this.$store.getters.config_intf, function(idx, obj){

          if(obj.if_type  == i_type
            && obj.phy == this.radio_idx
            && obj.vap == cur_tmp_obj.index ){
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
  }
})
