
import baseHttpProvider from '../base/baseHttpProvider';


/*后台************************************************************************************************************/

// 获取部门列表
const getDepartmentList = (params) => {
  return baseHttpProvider.getApi('department/getDepartmentList', params, {
    tokenless: true
  })
}

// 添加或者编辑部门
const saveOrUpdateDepartment = (params) => {
  return baseHttpProvider.postFormApi('api/department/saveOrUpdate', params)
}

// 删除部门
const deleteDepartment = (params) => {
  return baseHttpProvider.getApi('api/department/delete', params)
}

// 删除部门
const saveDepartmentSort = (params) => {
  return baseHttpProvider.postApi('api/department/saveSort', params)
}

export {
  getDepartmentList,
  saveOrUpdateDepartment,
  deleteDepartment,
  saveDepartmentSort
}