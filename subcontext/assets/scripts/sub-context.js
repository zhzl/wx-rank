cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		prefab: cc.Prefab
	},
	
  start () {
		wx.onMessage(reData => {
			if (reData.type === "GET") {
				// 清空排行榜列表
				for (let child of this.content.children) {
					child.destroy();
				}
				// 获取好友列表
				wx.getFriendCloudStorage({
					keyList: reData.data,
					success: res => {
						console.log("好友消息：", res.data, reData.data);
						let tempArr = [];
						for (let i in res.data) {
							if (res.data[i].KVDataList.length === 0) continue;
							let score = JSON.parse(res.data[i].KVDataList[0].value).wxgame.score;
							tempArr.push([i, score]);
						}
						console.log(tempArr);
						// 排序
						tempArr.sort((a, b) => b[1] - a[1]);
						for (let v of tempArr) {
							this.createUserBlock(res.data[v[0]]);
						}
					}
				});
			} else if (reData.type === "SET") {
				wx.setUserCloudStorage({
					KVDataList: reData.data,
					success: res => {
						console.log("存储成功：", res, reData.data);
					},
					fail: res => {
						console.error(res);
					}
				});
			} else if (reData.type === "DELETE") {
				wx.removeUserCloudStorage({
					keyList: reData.data,
					success: res => {
						console.log("删除数据成功");
					}
				});
			}
		});
  },
	
	createUserBlock(user) {
		let node = cc.instantiate(this.prefab);
		node.parent = this.content;
		node.x = 0;
		
		let userName = cc.find("Name", node).getComponent(cc.Label);
		userName.string = user.nickName || user.nickname;
		
		let score = cc.find("Score", node).getComponent(cc.Label);
		score.string = JSON.parse(user.KVDataList[0].value).wxgame.score;
		
		if (!user.avatarUrl){ return; }
		let headSprite = cc.find("mask/Icon", node).getComponent(cc.Sprite);
		cc.loader.load({url: user.avatarUrl, type: "jpg"}, (err, texture) => {
				if (!err) {
						headSprite.spriteFrame = new cc.SpriteFrame(texture);
				} else {
						console.log("加载头像失败！");
				}
		});
	}
});
