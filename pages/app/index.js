export default {
	data() {
		return {
			modalName: null,
			base: {
				avatar: this.$config.avatar,
				CustomBar: this.CustomBar,
				title: this.$config.title
			},
			operate: {
				id: 1
			},
			preview: {
				list: [
					"https://image.aishencn.com/2020/03/17/095817937_81909778-bbs.jpg",
				],
				show: false,
				index: 0,
			},
			cosmos: {
				scrollTop: 0,
				propValue: true,
				loadMore: false
			},
			cosmosList: [],
			menuList: [{
				name: 'user',
				label: '用户中心',
				auth: true,
				list: [{
					label: '安全退出',
					icon: 'cuIcon-exit',
					auth: true,
					url: '/pages/user/exit',
					tag: ''
				}]
			}],
			// 菜单列表
			barList: [{
					label: '社区',
					icon: 'cuIcon-discover',
					icons: 'cuIcon-discoverfill',
					url: '/pages/cms/index',
				}, {
					label: '资讯',
					icon: 'my-information',
					icons: 'my-information-fill',
					url: '/pages/cms/index',
				},
				{
					label: '积分兑换',
					icon: 'cuIcon-shop',
					icons: 'cuIcon-shopfill',
					url: '/pages/shop/index',
				},
				{
					label: '我的',
					icon: 'my-user',
					icons: 'my-user-fill',
					url: '/pages/user/index',
				},
			],
			userInfo: this.$common.userInfo(),
			newMessageList: [],
			messageCount: 0,
			contacts: {
				list: [{
					uid: 1,
					avatar: this.$config.logo,
					nickname: '默毅',
					state: '',
					user: {
						uid: 1,
						avatar: this.$config.logo,
						nickname: '默毅',
						state: ''
					}
				}]
			},

			tabScroll: 0,
			currentTab: 0,

			tabScrollItem: 0,
			currentTabItem: 0,

			//文字笑话
			list: [],
			//加载条数
			pages: 0,
			pages_all: false
		};
	},
	created() {
		console.log('userInfo', this.userInfo)
	},
	onLoad() {
		this.cosmosGetList();
		// 注册打开监听
		uni.$on('socketOpen', () => {
			console.log('socketOpen 服务器连接成功');
		});

		// 注册错误监听
		uni.$on('socketError', () => {
			console.log('socketError');
			this.$common.errorToShow('聊天服务器连接失败，部分功能不可用')
		});

		// 注册接受消息监听
		uni.$on('socketMessage', (res) => {
			console.log('socketMessage', res)
			switch (res.type) {
				case 'init':
					break;
					// 消息
				case 'msg':
					if (res.data.to && res.data.to == this.userInfo.id) {
						console.log('收到来自' + res.data.form + '消息', res.data);
						switch (res.data.type) {
							case 'text':
								this.$audio.palys();
							case 'tips':
								console.log('收到用发来的文本消息');
								this.$common.addNewMessageList(res.data.form, res.data.value, res.data.type);
								this.reMessgaeList();
								this.$common.addRecord(res.data.form, res.data);
								break;
							default:
								console.log('非常规消息', res.data);
								break;
						}
					} else {
						console.log('未知来源消息', res);
						return;
					}
					break;
					// 答复
				case 'response':
					this.$common.updateRecordState(res.data);
					break;
					// 心跳
				case 'ping':
					uni.sendSocketMessage({
						data: JSON.stringify({
							type: 'ping'
						})
					});
					console.log('给服务器ping回去');
					break;
				default:
					console.log('啥玩意数据，我咋不认识')
					break;
			}
		});



		uni.getSystemInfo({
			// 获取当前设备的宽高，文档有
			success: res => {
				this.windowHeight = res.windowHeight;
				this.windowWidth = res.windowWidth;
			}
		});

		// 获取好友列表
		this.$api.friendsList({}, res => {
			if (res.code != 1) {
				this.$common.errorToShow(res.msg);
			} else {
				res.data.forEach((ele, index) => {
					ele.user.avatar = this.$common.CDN(ele.user.avatar);
				});
				this.contacts.list = res.data;
				res.data.forEach((ele, index) => {
					this.$db.set('uid_' + ele.user.id, ele.user);
				});
			}
		});
		this.reMessgaeList();
	},
	methods: {
		srcollTop() {
			console.log('srcollTop');

			//进入页面滚动
			this.$nextTick(function() {
				console.log('srcollTop');
				
				this.cosmos.scrollTop = 0;
			});
		},
		like(index) {
			this.$api.cosmosLike({
				pid: this.cosmosList[index].id
			}, (res) => {
				if (res.code) {
					this.cosmosList[index].isLike = res.data
					if (res.data) {
						this.cosmosList[index].likes++;
					} else {
						this.cosmosList[index].likes--;
					}
				}
			})
		},

		// 宇宙操作
		feedback() {
			this.$common.errorToShow('反馈id:' + this.operate.id);
			return
			uni.navigateTo({
				url: '/pages/app/feedback?id=' + this.operate.id,
			})
		},
		cosmosMoreOperate(index) {
			this.operate = this.cosmosList[index];
			this.modalName = 'cosmosMore'
		},
		userOpen(index) {
			this.$db.set('user', this.cosmosList[index])
			uni.navigateTo({
				url: '/pages/app/user/index'
			})
		},
		cosmosOpen(index) {
			this.$db.set('cosmos', this.cosmosList[index])
			uni.navigateTo({
				url: '/pages/app/cosmos/index?id=' + this.operate.id,
			})
		},

		hideModal() {
			this.modalName = null
		},

		cosmosGetList(id) {
			this.$api.getCosmosList({
				id: id
			}, (res) => {
				if (res.code) {
					this.cosmosList = [...this.cosmosList, ...res.data];
					this.cosmos.loadMore = true;
				}
			});
		},
		cosmosTrigger(i) {
			switch (i) {
				case 0:
					// 松开刷新
					break;
				case 1:
					// 触发刷新

					this.$api.getCosmosList({}, (res) => {
						if (res.code) {
							this.cosmosList = res.data;
							this.cosmos.propValue = !this.cosmos.propValue
						} else {
							this.$common.errorToShow('空空如也');
						}
					});
					break;
				case 2:
					const query = uni.createSelectorQuery().in(this);
					query.select('#more-text').boundingClientRect(data => {
						if (data.top < 1500) {
							if (this.cosmos.loadMore) {
								this.cosmos.loadMore = false;
								this.cosmosGetList(this.cosmosList[this.cosmosList.length - 1].id);
							}
						}
					}).exec();
					// 未触发刷新
					break;
				case 3:
					// 
					// if (this.cosmos.loadMore) {
					// 	this.cosmos.loadMore = false;
					// 	this.cosmosGetList(this.cosmosList[this.cosmosList.length - 1].id);
					// }
					// this.cosmosList[this.cosmosList.length-1];

					// console.log('开始预加载',this.cosmosList[this.cosmosList.length-1])
					break;

				default:
					break;
			}
		},
		previews(list, index) {
			this.preview.index = index;
			this.preview.list = list;
			this.preview.show = !this.preview.show;
		},
		qie() {
			uni.reLaunch({
				url: '/pages/user/login'
			})
		},
		clean() {
			this.newMessageList.forEach((ele, index) => {
				this.$db.del('Record_' + ele.user.id);
			});
			this.newMessageList = [];
			this.$db.del('NewMessageList');
			this.$common.errorToShow('缓存清除成功');
		},
		// 刷新消息列表
		reMessgaeList() {
			let count = 0;
			this.newMessageList = this.$common.getNewMessageList();
			this.newMessageList.forEach((ele, index) => {
				count += ele.tips.count;
				if (count > 99) {
					this.messageCount = count;
					return;
				}
			});
			this.messageCount = count;
		},

		// 初始化时间戳
		timeToDate(time) {
			// console.log('time',time.length)
			if (time < 9999999999) {
				time = time * 1000;
			}
			// 1584445904420
			// 1584433709
			// console.log('time', time)
			var timeDate = new Date(time);
			var currentTime = new Date();
			if (currentTime.getYear() == timeDate.getYear()) {
				if (new Date(time).toDateString() === new Date().toDateString()) {
					var hours = timeDate.getHours();
					var minutes = timeDate.getMinutes();
					if (hours < 10) {
						hours = '0' + hours;
					}
					if (minutes < 10) {
						minutes = '0' + minutes;
					}
					return hours + ':' + minutes;
				} else if (new Date(time + 86400).toDateString() === new Date().toDateString()) {
					return '昨天';
				}
				return timeDate.getMonth() + 1 + '月' + timeDate.getDate() + '日';
			}
			return timeDate.getYear() + '年' + (timeDate.getMonth() + 1) + '月';
		},

		// 打开对话
		openChat(arr) {
			// 打开对话
			this.$db.set('chat', arr)
			uni.navigateTo({
				url: '/pages/app/chat',
			})
			this.$common.readNewMessageList(arr.id);
			this.reMessgaeList();
		},
		//点击tab menu
		clickMenu(e) {
			var current = e.currentTarget.dataset.current; //获取当前tab的index
			// 导航tab共2个，获取一个的宽度
			var tabWidth = this.windowWidth / 4;
			this.tabScroll = (current - 4) * tabWidth; //使点击的tab始终在居中位置
			if (this.currentTab == current) {
				return false;
			} else {
				this.currentTab = current;
			}
		},

		//活动menu 内容
		changeContent(e) {
			var current = e.detail.current; // 获取当前内容所在index,文档有
			var tabWidth = this.windowWidth / 2;
			this.currentTab = current;
			this.tabScroll = (current - 2) * tabWidth;
		},

		//活动menu 内容
		changeContentItem(e) {
			var current = e.detail.current; // 获取当前内容所在index,文档有
			var tabWidth = this.windowWidth / 2;
			this.currentTabItem = current;
			this.tabScrollItem = (current - 2) * tabWidth;
		}

	},
	onShow() {
		console.log('onshow')
		this.$socket.connect();
		this.reMessgaeList();
	},
	onHide() {
		console.log('onHide')
	}
};
