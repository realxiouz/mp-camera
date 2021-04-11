<script>
import '@/common/color-ui/main.css'
import '@/common/color-ui/icon.css'
import '@/common/color-ui/animate.css'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
	onLaunch() {
		let token = this.$getStorage('token')
		if (token) {
			this.$store.commit('user/setToken', token)
			console.log('token默认登录成功')
		} else {
			this.getSessionKey()
				.then(r => {
					
				})
		}
	},
	onShow() {
		// console.log('App Show')
	},
	onHide() {
		// console.log('App Hide')
	},
	computed: {
		...mapState('user', ['openId'])
	},
	methods: {
		...mapActions('user', ['getSessionKey']),
		...mapMutations('user', ['setToken'])
	}
}
</script>
