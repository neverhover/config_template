function heredoc(fn) {
	return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
	replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}



//判断是否是个空对象
function isEmptyObject(e) {
	var t;
	for (t in e)
		return !1;
	return !0
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

var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/
/*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
/* istanbul ignore next */
function isArrayLike(obj) {
    if (!obj) return false
    var n = obj.length
    if (n === n >>> 0) {
        //检测length属性是否为非负整数
        var type = Object.prototype.toString.call(obj).slice(8, -1)
        if (rarraylike.test(type)) return true
        if (type === 'Array') return true
        try {
            if ({}.propertyIsEnumerable.call(obj, 'length') === false) {
                //如果是原生对象
                return rfunction.test(obj.item || obj.callee)
            }
            return true
        } catch (e) {
            //IE的NodeList直接抛错
            return !obj.window //IE6-8 window
        }
    }
    return false
}

function arrayEach (obj, fn) {
    if (obj) {
        //排除null, undefined
        var i = 0
        if (isArrayLike(obj)) {
            for (var n = obj.length; i < n; i++) {
                if (fn(i, obj[i]) === false) break
            }
        } else {
            for (i in obj) {
                if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                    break
                }
            }
        }
    }
}

function convertArray(array) {
    var ret = [],
        i = 0
    for (var key in array) {
        if (array.hasOwnProperty(key)) {
            ret[i] = array[key]
            i++
        }
    }
    return ret
}

function recovery(ret, array, callback) {
    for (var i = 0, n = array.length; i < n; i++) {
        callback(array[i])
    }
    return ret
}

function sliceArray(obj, index){
	var tmp_obj={}
	tmp_obj=convertArray(obj)
//	var n = tmp_obj.length
//	var data=[]
//	for(i=0;i<n;i++){
//		data.push(tmp_obj[i])
//	}
//	console.log(data)
// 	var target = {}
//  target=recovery(target, data, function (el) {
//      target[el.key] = el.value
//  })
//  console.log(target)
	return Array.prototype.slice.call(tmp_obj,index)
}

function resetVueRows(src, new_obj){
	var tmp_obj = myclone(src)
	switch (new_obj.action){
		case "delete":
			Vue.delete(tmp_obj, new_obj.key)
			break;
		case "update":
			Vue.set(tmp_obj, new_obj.key, new_obj.value)
			break;
		case "new":
			break;
		default:
			throw "Error.not support action"
			break;
	}
	//修改完对象后push到数组中
	var i = 0
	var ret=[]
	for (var key in tmp_obj) {
	  if (tmp_obj.hasOwnProperty(key)) {
	    ret[i] = tmp_obj[key]
	    i++
	  }
	}
	if(new_obj.action == "new"){
		ret[i] = new_obj.value
	}
	//返回后的对象请自行进行Set
	//如Vue.set(mystore.state.pro_model[0].network,"trafficcontrol",ret)
	return ret
}
//不唯一，即没有通过测试，则返回false
//唯一，则通过测试，返回true
function uniqueTest(objects, test, mode){
	var tmp_arr= convertArray(objects)
	var count = 0
	//遍历每一个元素，只有全部都与test不符合时，才是测试通过
	return tmp_arr.every(function(item){
	    var r = true
		for(var key in test){
			r = r && (item[key] == test[key])
		}
		if(mode == "update" && count == 0 && r){
			count+=1
			r = false
		}
	    return !r
	})
}



//判断一个元素是否在一个特定中，返回true 或false
function in_array(needle, haystack) {
  var i = 0
  var n = haystack.length

  for (;i < n;++i)
    if (haystack[i] === needle)
      return {"found": true, "index": i}

  return  {"found": false, "index": i}
}
//混合base_obj和new_obj
/*
* 支持调用
* mix_object(cur_pro, null, {}) 新添加配置
* mix_object(cur_pro, cur_cfg, {}) 编辑配置
*/
function mix_object(base_obj, new_obj, parent_obj){

	for (var i in base_obj) {
		//找到新对象中对应属性的值
		if(base_obj[i].$template == true){
			//是个table，那么跳过此template的赋值，并将new_obj对象混入到base_obj中来
			var index=parseInt(i)+1
			for(var j in new_obj){
				base_obj[index]=new_obj[j]
				index=index+1
			}
			break;
		}
//		console.log( "键:"+ i + " ")
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
			if( typeof(new_obj) != 'undefined'
			&& new_obj != null
			&& new_obj !={}
			&& new_obj[want_key] !=null
			&& base_obj[i].$template != true
			&& base_obj[i].type != "object"){
//				console.log(i+ " 普通赋值  "+ want_key )
				base_obj[i].value = new_obj[want_key]
			}else if( typeof(new_obj) != 'undefined' && new_obj != null && new_obj !={} && new_obj[want_key] !=null && base_obj[i].$template != true && base_obj[i].type == "object"){
//				console.log(i+ " 嵌套子对象  "+ want_key )
				base_obj[i].value = myclone(base_obj[i].default)
				mix_object(base_obj[i].value, val_obj, base_obj)
			}else{
				//在new_obj中并没有这个值，那么采用默认值
//				console.log(i+ " 他是模版-->  "+ base_obj[i].$template )
				base_obj[i].value = base_obj[i].default != null ? base_obj[i].default : "error! please check your base object"
				if(typeof(base_obj[i].value) =='object' && base_obj[i].type == "object"){
					mix_object(base_obj[i], val_obj, base_obj)
				}
			}
//			console.log("changing key:"+ want_key+"\n"+
//			"value:"+base_obj[i].default + "\n" +
//			"val_obj.val:" + val_obj )
//			console.log(new_obj[want_key])
		}else if(typeof(base_obj[i]) != 'object' || base_obj[i] == null){
			//表明到了当前base对象的值了
//			console.log("我们找到了,不理他")
//			console.log(base_obj[i])
		}else{
//			console.log(i + "----------")
			mix_object(base_obj[i], val_obj, base_obj)
		}
	}
	return base_obj
}
var okokok={}
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
//		 console.log("base_obj key="+ i)

		if(typeof(base_obj[i]) == 'object' && base_obj[i].key != null && base_obj[i].type != 'object'){
			//表示该对象是我们想找的对象，那么赋值给它
			var want_key = base_obj[i].key
//			 console.log("开始加入键:"+want_key + " 值:"+base_obj[i].value)
			new_obj[want_key] = base_obj[i].value
		}else if(typeof(base_obj[i]) == 'object' && base_obj[i].key != null && base_obj[i].type == 'object'){
//			console.log("嵌套对象组合:"+i + " 打算进入其子对象")
			var val_obj = {}
			if(this_isArray(base_obj[i])){
				new_obj[i] = new Array();
			}else{
				new_obj[i] = new Object();
			}
			val_obj = new_obj[i]
			clone_cfg(base_obj[i].value, val_obj)
		}else if( (typeof(base_obj[i]) != 'object') && (typeof(base_obj[i]) != 'function') &&  (base_obj[i] != null)){
//			 console.log("开始加入非对象 键:"+i+" 值:"+ base_obj[i])
			new_obj[i] = base_obj[i]
		}else if(typeof(base_obj[i]) == 'object' &&  (base_obj[i].key == null || typeof(base_obj[i].key) == 'undefined') && base_obj[i].isview == true ){
//			console.log("view 忽略属性:"+ i)
		}else if(typeof(base_obj[i]) == 'object'  && base_obj[i].$template == true ){
//			console.log("view 忽略对象:"+ i)
			new_obj[i] = {}
		}else{
//			 console.log("打算进入一下层 键:"+i + " 当前对象是否为数组:" + this_isArray(base_obj[i]))
			var val_obj = {}
			if(this_isArray(base_obj[i])){
				new_obj[i] = new Array();
			}else{
				new_obj[i] = new Object();
			}
			val_obj = new_obj[i]
			console.log(val_obj)
			clone_cfg(base_obj[i], val_obj)
		}
	}
	return new_obj
}
