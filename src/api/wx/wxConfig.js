import { getWxConfig } from './common';
import wx from 'weixin-js-sdk';


let isWEIXInBrowser = false;
let ua = navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) == "micromessenger") {
    isWEIXInBrowser = true
}

// 微信页面JS SDK配置
const wxConfigInit = (url,callback) => {
    url = url || window.location.href;
    // url='http://h5.trace.adorsmart.com/frontEnd/index'
    getWxConfig({ url })
        .then(data => {
            let { appId, timestamp, nonceStr, signature } = data;
            wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId, // 必填，公众号的唯一标识
                timestamp, // 必填，生成签名的时间戳
                nonceStr, // 必填，生成签名的随机串
                signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareAppMessage',
                    "scanQRCode"
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

            });
            callback && callback()
        })
}


//分享给朋友
const shareToFriend = (title, desc, link, imgUrl, successFn, cancelFn, failFn) => {
    wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            //alert('用户点击发送给朋友');
        },
        success: function (res) {
            if (typeof (successFn) == "function") {
                successFn && successFn();
            }
        },
        cancel: function (res) {
            if (typeof (cancelFn) == "function") {
                cancelFn && cancelFn();
            }
        },
        fail: function (res) {
            if (typeof (failFn) == "function") {
                failFn && failFn();
            }
        }
    });
}
//分享至朋友圈
const shareToTimeLine = (title, link, imgUrl, successFn, cancelFn, failFn) => {
    wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: imgUrl,
        trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            //alert('用户点击分享到朋友圈');
        },
        success: function (res) {
            if (typeof (successFn) == "function") {
                successFn();
            }
        },
        cancel: function (res) {
            if (typeof (cancelFn) == "function") {
                cancelFn();
            }
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
            if (typeof (failFn) == "function") {
                failFn();
            }
        }
    });
}
const shareToTimeLineWithContent = (title, desc, link, imgUrl, successFn, cancelFn, failFn) => {
    wx.onMenuShareTimeline({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            //alert('用户点击分享到朋友圈');
        },
        success: function (res) {
            if (typeof (successFn) == "function") {
                successFn();
            }
        },
        cancel: function (res) {
            if (typeof (cancelFn) == "function") {
                cancelFn();
            }
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
            if (typeof (failFn) == "function") {
                failFn();
            }
        }
    });
}
//分享至QQ
const shareToQQ = (title, desc, link, imgUrl, completeFn, successFn, cancelFn, failFn) => {
    wx.onMenuShareQQ({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        trigger: function (res) {
            alert('用户点击分享到QQ');
        },
        complete: function (res) {
            if (typeof (completeFn) == "function") {
                completeFn();
            }
        },
        success: function (res) {
            if (typeof (successFn) == "function") {
                successFn();
            }
        },
        cancel: function (res) {
            if (typeof (cancelFn) == "function") {
                cancelFn();
            }
        },
        fail: function (res) {
            if (typeof (failFn) == "function") {
                failFn();
            }
        }
    });
}
//分享至微博
const shareToWeiBo = (title, desc, link, imgUrl, completeFn, successFn, cancelFn, failFn) => {
    wx.onMenuShareWeibo({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        trigger: function (res) {
            alert('用户点击分享到微博');
        },
        complete: function (res) {
            if (typeof (completeFn) == "function") {
                completeFn();
            }
        },
        success: function (res) {
            if (typeof (successFn) == "function") {
                successFn();
            }
        },
        cancel: function (res) {
            if (typeof (cancelFn) == "function") {
                cancelFn();
            }
        },
        fail: function (res) {
            if (typeof (failFn) == "function") {
                failFn();
            }
        }
    });
}
//隐藏菜单
const HideOptionMenu = () => {
    wx.hideOptionMenu();
}
//显示菜单
const showOptionMenu = () => {
    wx.showOptionMenu();
}
//批量隐藏菜单项
const hideMenuItems = (menuList) => {
    wx.hideMenuItems({
        menuList: menuList,
        //[
        //  'menuItem:readMode', // 阅读模式
        //  'menuItem:share:timeline', // 分享到朋友圈
        //  'menuItem:copyUrl' // 复制链接
        //],
        success: function (res) {
            //alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
        }
    });
}
//批量显示菜单项
const showMenuItems = (menuList) => {
    wx.showMenuItems({
        menuList: menuList,
        //[
        //  'menuItem:readMode', // 阅读模式
        //  'menuItem:share:timeline', // 分享到朋友圈
        //  'menuItem:copyUrl', // 复制链接
        //  'menuItem:profile', // 查看公众号（已添加）
        //  'menuItem:addContact' // 查看公众号（未添加）
        //],
        success: function (res) {
            //alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
        }
    });
}
//隐藏所有非基本菜单项
const hideAllNonBaseMenuItems = () => {
    wx.hideAllNonBaseMenuItem({
        success: function () {
            alert('已隐藏所有非基本菜单项');
        }
    });
}
//显示所有被隐藏的非基本菜单项
const showAllNonBaseMenuItems = () => {
    wx.showAllNonBaseMenuItem({
        success: function () {
            alert('已显示所有非基本菜单项');
        }
    });
}
//关闭当前窗口
const closeWindow = () => {
    wx.closeWindow();
}

// 扫描接口
const scanQRCode = () => {

    return new Promise((resolve, reject) => {
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: (res) => {
                let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }

        });
    })
}

export {
    wxConfigInit,
    shareToTimeLine,
    shareToFriend,
    shareToTimeLineWithContent,
    shareToQQ,
    hideAllNonBaseMenuItems,
    showAllNonBaseMenuItems,
    closeWindow,
    scanQRCode
}