
import baseHttpProvider from '../base/baseHttpProvider';

/*前台************************************************************************************************************/
//  获取发票公司下拉列表
const getCompanyListBySort = (params) => {
  return baseHttpProvider.getApi('company/getCompanyListBySort', params, {
    tokenless: true
  })
}

//  获取发票公司详情（根据数据库物理Id）
const getCompanyDetailById = (params) => {
  return baseHttpProvider.getApi('company/getCompanyDetail', params, {
    tokenless: true
  })
}

/*后台************************************************************************************************************/

// 编辑新增发票公司
const saveOrUpdateCompany = (params) => {
  return baseHttpProvider.postFormApi('api/company/saveOrUpdate', params)
}

// 编辑新增发票公司
const searchCompanyList = (params) => {
  return baseHttpProvider.postFormApi('api/company/searchCompanyList', {
    page: 1,
    size: 10,
    ...params
  }, {
      total: true
    })
}

// 保存发票公司排序
const saveCompanySort = (params) => {
  return baseHttpProvider.postApi('api/company/saveSort', params)
}

// 删除发票公司
const deleteCompany = (params) => {
  return baseHttpProvider.getApi('api/company/delete', params)
}


export {
  getCompanyListBySort,
  getCompanyDetailById,
  searchCompanyList,
  saveOrUpdateCompany,
  saveCompanySort,
  deleteCompany
}