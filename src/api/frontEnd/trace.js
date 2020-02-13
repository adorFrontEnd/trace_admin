import baseHttpProvider from '../base/baseHttpProvider';
const traceabilityCheck = (params) => {
  return baseHttpProvider.postFormApi('api/security/traceabilityCheck', params,{
    tokenless: true
  })
}
const securityCheck = (params) => {
  return baseHttpProvider.postFormApi('api/security/securityCheck', params,{
    tokenless: true
  })
}
const getDetailByUserId = (params) => {
  return baseHttpProvider.getApi('api/decoration/getDetailByUserId', params,{
    tokenless: true
  })
}


export {
  traceabilityCheck,
  securityCheck,
  getDetailByUserId
}