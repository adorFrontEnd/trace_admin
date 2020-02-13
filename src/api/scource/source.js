 
import baseHttpProvider from '../base/baseHttpProvider';

const getAllList = (params) => {
  return baseHttpProvider.getApi('api/source/getAllList', params);
}

const getAll = (params) => {
  return baseHttpProvider.getApi('api/source/getAll', params);
}



export {
  getAllList,
  getAll
}