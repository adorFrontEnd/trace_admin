import baseHttpProvider from '../base/baseHttpProvider';

// 获取发票列表
const searchInvoiceList = (params) => {
  if (params && params.page) {
    return baseHttpProvider.postFormApi('api/invoice/searchInvoiceList', {
      size:10,
      page:1,
      ...params
    },{
      total:true
    })
  }
}



// 删除发票
const deleteInvoice = (params) => {
  return baseHttpProvider.getApi('api/invoice/delete', params)
}

// 导出发票列表
const exportInvoice = (params) => {
  let result =  baseHttpProvider.getReqObj('api/invoice/export', params)
  if (result.url) {
    return result.url
  }
}

// 导出发票列表
const existVerifyCode = (params) => {
  return baseHttpProvider.getApi('auth/existVerifyCode', params,{
    tokenless:true
  }) 
}

// 保存发票
const saveInvoice = (params) => {
  return baseHttpProvider.postApi('invoice/save', params,{
    tokenless:true
  })
}

export {
  searchInvoiceList,
  saveInvoice,
  deleteInvoice,
  exportInvoice,
  existVerifyCode
}