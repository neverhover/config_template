/*
 * @author: zhangleyi
 * @date  : 2016年8月13日 21:44:46
 * @note  : 没有做成package，饿哦。
 */

function heredoc(fn) {
	return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
	replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}

//对象克隆
function myclone(myObj) {
	if(typeof(myObj) != 'object' || myObj == null) return myObj;
	var newObj = new Object();
	for(var i in myObj) {
		newObj[i] = myclone(myObj[i]);
	}
	return newObj;
}

//判断是否是一个数组
function this_isArray(obj) {
	if (Object.prototype.toString.call(obj) === '[object Array]'){
		return true
	}else if(obj["0"] != null && typeof(obj["0"]) == 'object'){
		return true
	}
	return false
}

//判断一个元素是否在一个特定中，返回true 或false
function in_array(needle, haystack) {
  var i = 0
  var n = haystack.length;

  for (;i < n;++i)
    if (haystack[i] === needle)
      return true;

  return false;
}

//混合base_obj和new_obj
/*
* 支持调用 
* mix_object(cur_pro, null) 新添加配置
* mix_object(cur_pro, cur_cfg) 编辑配置
*/
function mix_object(base_obj, new_obj){
			
	for (var i in base_obj) {
		//找到新对象中对应属性的值
		var val_obj = {}
		if(new_obj != null){
			val_obj = new_obj[i]
		}
		 
//				if(val_obj != null && typeof(val_obj) != 'object'){
//					//如果该值不为空且也不是对象，说明是真正的值。
//					//则需要覆盖到对应base对象的值
//					console.log("i="+i+" typeof:"+ typeof(val_obj)+ "\n"
//					+ "cur base is:"+ base_obj[i].key)
//				}
		if(typeof(base_obj[i]) == 'object' && base_obj[i].key != null){
			//表示该对象是我们想找的对象，那么赋值给它
			var want_key = base_obj[i].key
			if( typeof(new_obj) != 'undefined' && new_obj[want_key] !=null){
				
				base_obj[i].value = new_obj[want_key]
			}else{
				//在new_obj中并没有这个值，那么采用默认值
				base_obj[i].value = base_obj[i].default != null ? base_obj[i].default : "error! please check your base object"
			}
//					console.log("changing key:"+ want_key+"\n"+
//					"value:"+base_obj[i].default + "\n" +
//					"val_obj.val:" + val_obj )
//					console.log(new_obj[want_key])
		}else if(typeof(base_obj[i]) != 'object' || base_obj[i] == null){
			//表明到了当前base对象的值了
//					console.log("我们找到了")
		}else{
			mix_object(base_obj[i], val_obj)
		}
	}
	return base_obj
}

/*
 * @brief: 生成配置
 *  支持调用 
 *  clone_cfg(cur_pro, {}) 
 * 
 */
function clone_cfg(base_obj, new_obj){
//	console.log("=================")
//	console.log(typeof(base_obj))
//	console.log("\\\\\\\\\\\\\\\\\\")
	for (var i in base_obj) {
		// console.log("base_obj key="+ i)

		if(typeof(base_obj[i]) == 'object' && base_obj[i].key != null){
			//表示该对象是我们想找的对象，那么赋值给它
			var want_key = base_obj[i].key
			// console.log("开始加入键:"+want_key + " 值:"+base_obj[i].value)
			new_obj[want_key] = base_obj[i].value
		}else if( (typeof(base_obj[i]) != 'object') && (typeof(base_obj[i]) != 'function') &&  (base_obj[i] != null)){
			// console.log("开始加入非对象 键:"+i+" 值:"+ base_obj[i])
			new_obj[i] = base_obj[i]
		}else{
			// console.log("打算进入一下层 键:"+i + " 当前对象是否为数组:" + this_isArray(base_obj[i]))
			var val_obj = {}
			if(this_isArray(base_obj[i])){
				new_obj[i] = new Array();
			}else{
				new_obj[i] = new Object();
			}
			val_obj = new_obj[i]
			clone_cfg(base_obj[i], val_obj)
		}
	}
	return new_obj
}


avalon.component('ms-pager', {
    template: heredoc(function () {
    /*
<div>
  
    <div class="pagination pagination-right" style="margin-right: 20px;">
    <ul  ms-visible='@totalPages'>
	    <li class="first" 
	        ms-class='{disabled: @isDisabled("first", 1)}'>
	        <a ms-attr='{href:@getHref("first"),title:@getTitle("first")}'
	           ms-click='@cbProxy($event,"first")'
	           >
	            {{@firstText}}
	        </a>
	    </li>
	    <li class="prev" 
	        ms-class='{disabled: @isDisabled("prev",1)}'>
	        <a ms-attr='{href:@getHref("prev"),title:@getTitle("prev")}'
	           ms-click='@cbProxy($event,"prev")'
	           >
	            {{@prevText}}
	        </a>
	    </li>
	    <li ms-for='page in @pages' 
	        ms-class='{active: page === @currentPage}' >
	        <a ms-attr='{href:@getHref(page),title:@getTitle(page)}'
	           ms-click='@cbProxy($event,page)'
	           >
	            {{page}}
	        </a>
	    </li>
	    <li class="next" 
	        ms-class='{disabled: @isDisabled("next",@totalPages)}'>
	        <a ms-attr='{href:@getHref("next"),title: @getTitle("next")}'
	           ms-click='@cbProxy($event,"next")'
	           >
	            {{@nextText}}
	        </a>
	    </li>
	    <li class="last" 
	        ms-class='{disabled: @isDisabled("last",@totalPages)}'>
	        <a ms-attr='{href:@getHref("last"),title: @getTitle("last")}'
	           ms-click='@cbProxy($event,"last")'
	           >
	            {{@lastText}}
	        </a>
	    </li>
	</ul>
	</div>
</div>

     */
    }),
    defaults: {
        getHref: function (a) {
            return '#page-' + this.toPage(a)
        },
        getTitle: function (title) {
            return title
        },
        isDisabled: function (name, page) {
            return this.$buttons[name] = (this.currentPage === page)
        },
        $buttons: {},
        showPages: 5,
        pages: [],
        totalPages: 15,
        currentPage: 1,
        firstText: 'First',
        prevText: 'Previous',
        nextText: 'Next',
        lastText: 'Last',
        pager_prefixText : 'Page',
        pager_suffixText : '',
        onPageClick: avalon.noop,
        toPage: function (p) {
            var cur = this.currentPage
            var max = this.totalPages
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

        cbProxy: function (e, p) {
            if (this.$buttons[p] || p === this.currentPage) {
                e.preventDefault()
                return //disabled, active不会触发
            }
            var cur = this.toPage(p)
            this.render(cur)
            return this.onPageClick(e, p)
        },
        render: function(cur){
            var obj = pager_getPages.call(this, cur)
            this.pages = obj.pages
            this.currentPage = obj.currentPage
        },
        rpage: /(?:#|\?)page\-(\d+)/,
        onInit: function () {
            var cur = this.currentPage
            var match = this.rpage && location.href.match(this.rpage)
            if (match && match[1]) {
                var cur = ~~match[1]
                if (cur < 0 || cur > this.totalPages) {
                    cur = 1
                }
            }
            var that = this
            this.$watch('totalPages', function(){
                setTimeout(function(){
                    that.render(that.currentPage)
                },4)
            })
            this.render(cur)
        }
    }
})
function pager_getPages(currentPage) {
    var pages = []
    var s = this.showPages
    var total = this.totalPages
    var half = Math.floor(s / 2)
    var start = currentPage - half + 1 - s % 2
    var end = currentPage + half

    // handle boundary case
    if (start <= 0) {
        start = 1;
        end = s;
    }
    if (end > total) {
        start = total - s + 1
        end = total
    }

    var itPage = start;
    while (itPage <= end) {
        pages.push(itPage)
        itPage++
    }

    return {currentPage: currentPage, pages: pages};
}

avalon.component('ms-grid', {
    template: heredoc(function () {
/*
         <div class="grid">
         <div><slot name="header"/></div>
         <div>
          	<table class="cbi-section-table" ms-attr="{id:@table_id}">
	        	<tr class="cbi-section-table-titles">
	        		<th ms-if="@multiSelect" style="text-align: left;">
	                    <input type="checkbox" 
	                    ms-duplex-checked="@allchecked"
	                    data-duplex-changed="@checkAll"/> 
	                </th>
	                <th :for="th in @header.col_text" style="text-align: left;" class="cbi-section-table-cell">
	                    {{th}}
	                </th>
	            </tr>
	            <tr :for="($index,obj) in @table_data |limitBy(@count, @start)" class="cbi-section-table-row">
	            	<td ms-if="@multiSelect && @multiArr">
	            		<input type="checkbox" 
	            		ms-duplex-checked="@multiArr[@start+$index].checked"
	            		data-duplex-changed="@checkOne">
	            		
	            		
	            	</td>
	                <td :for="($idx,td) in obj | selectBy(@header.col_key)" >{{@render_td(@header.col_key[$idx],obj,td) | html}}</td>
	            </tr>
	        </table> 
         </div>
         <slot name="pager" />
         </div>
*/         
    }),
    defaults: {
    	header : {
			col_key:[
				"wlan_id",
				"user_name",
				"config_name",
				"ssid_name",
				"portal_enable"
			],
			col_text:[
				"WLAN编号",
				"所属人",
				"WLAN配置名称",
				"SSID名称",
				"是否开启Portal"
			]
		},
		table_data : [
			{"user_name":"1111","ssid_name":"SSID_1","config_name":"22:33:44:55:66:77","portal_enable":1,"wlan_id":1},
			{"user_name":"1111","ssid_name":"SSID_15","config_name":"22:33:44:55:66:77","portal_enable":1,"wlan_id":2}
		],
		count : 8,
		start : 0,
		table_id : 'ms_table',
		tables_idx : 0,
		multiSelect : false,
		//checkbox所要比较的值
        multiKeyName : "ssid_name",
        //checkbox所要采用的值
        multiValue : "wlan_id",
        //check最大可选数量,
        multiMaxChecked : 0,
        multiChecked : 0,
        //checkbox对象集合
        multiArr : null,
        //默认是否是全选
        allchecked: false,
        //列回调
        colModel : null,
        checkAll: function (e) {
            var checked = e.target.checked
            this.multiArr.forEach(function (el) {
                el.checked = checked
            })
        },
        checkOne: function (e, a, b) {
            var checked = e.target.checked
            // if(checked ==== true){
            // 	multiChecked += 1;
            // }
            // if(multiChecked == multiMaxChecked){
            // 	this.multiArr.forEach(function (el) {
            // 		if(el.checked == false)
            //     	el.checked 
            // 	})
            // }

            if (checked === false) {
                this.allchecked = false
            } else {//avalon已经为数组添加了ecma262v5的一些新方法
                this.allchecked = this.multiArr.every(function (el) {
                    return el.checked
                })
            }
        },
        render_td : function (key,obj,val){
        	
        	if(this.colModel == null || typeof(this.colModel[key]) == 'undefined'){
				return val
			}else if ( typeof(this.colModel[key].cb) == 'function' ){
				return this.colModel[key].cb(key,obj,val)
			}
        }
    }
})
