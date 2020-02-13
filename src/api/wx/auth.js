


import { appId, appSecret } from '../../config/app.config';
import baseHttpProvider from '../base/baseHttpProvider';

// const wxLogin = (params) => {
//   return baseHttpProvider.getApi('auth/wxLogin', { ...params },{tokenless:true})
// }
const wxLogin = (params) => {
  return baseHttpProvider.getApi('authorize/concernedAbout', { ...params },{tokenless:true})
}
const getWxAuthRedirectUri = (url, scopeType, params) => {
  let scope = scopeType == "user" ? "snsapi_userinfo" : "snsapi_base";
  params = params || "STATE";
  url = encodeURIComponent(url);
  let redirect_uri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=http://h5.trace.adorsmart.com/frontEnd/index&response_type=code&scope=${scope}&state=${params}#wechat_redirect`
  return redirect_uri;
}

export {
  wxLogin,
  getWxAuthRedirectUri
}
