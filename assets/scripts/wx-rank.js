cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        this.wxSubContextView = cc.find("WXSubContentView", this.node);
        this.subContextViewComp = this.wxSubContextView.getComponent(cc.WXSubContextView);
        this.subContextViewComp.enabled = false;
        this.wxSubContextView.active = false;

        cc.find("ShowRankButton", this.node).on("click", button => {
            let updateTime = parseInt(new Date().getTime() / 1000);
            let getArr = new Array();
            getArr.push("score");

            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                type: "GET",
                data: getArr,
                timer: updateTime
            });

            this.subContextViewComp.enabled = true;
            this.wxSubContextView.active = true;
            this.subContextViewComp.update();
        });
        cc.find("HideRankButton", this.node).on("click", button => {
            this.subContextViewComp.enabled = false;
            this.wxSubContextView.active = false;
        });
        cc.find("RefreshRankButton", this.node).on("click", button => {
            let updateTime = parseInt(new Date().getTime() / 1000); 
            let value = JSON.stringify({
                "wxgame": {
                    "score": Math.floor(10000 * Math.random()),
                    "update_time": updateTime
                }
            });

            let getArr = new Array();
            getArr.push({key: "score", value: value});

            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                type: "SET",
                data: getArr,
                timer: updateTime
            });
        });
        cc.find("DeleteRankButton", this.node).on("click", button => {
            let updateTime = parseInt(new Date().getTime() / 1000);
            let getArr = new Array();
            getArr.push("score");

            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                type: "DELETE",
                data: getArr,
                timer: updateTime
            });
        });
    },
});
