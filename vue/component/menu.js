Vue.component('ns-accfg-menu',{
	template: heredoc(function () {
		/*
		<ul class="nav nav-tabs" v-if="menus.length > 0">
				<li v-for="(item,index) in menus" v-bind:class="[cur_active== item.name ? 'active' : '']" v-on:click="changeIdx(item.name)">
					<a href="javascript:void(0);">{{item.label}}</a>
				</li>				
		</ul>
		*/
	}),
	props: {
		'menus' : Array,
		'cur_active': String
	},
	data:function () {
		return {
			count:0
		}
	},
	methods: {
		changeIdx: function(cur_id){
			
			this.cur_active !=cur_id && this.$emit('menu_idx_change',cur_id) && console.log("sec change to:"+cur_id)
		}
	}
})
