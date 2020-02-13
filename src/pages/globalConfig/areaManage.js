import React, { Component } from "react";
import { Tree, InputNumber, Spin, Popconfirm, Button, Input, Modal } from "antd";
import Toast from '../../utils/toast';
import { getCityList, saveSort } from '../../api/setting/areaManage';
import { parseTree } from '../../utils/tree';

import CommonPage from '../../components/common-page';
import { SubmitForm } from '../../components/common-form';

const { TreeNode } = Tree;
const _title = "地区管理";
const _description = "";

class AreaManage extends Component {

  state = {
    classifyList: [],
    rawClassifyList: null,
    addAnyClassifyModalVisible: false,
    addSubClassifyModalVisible: false,
    editSubClassifyFormValue: null,
    selectParentId: null,
    selectId: null,
    showClassifyLoading: false,
    changedClassifySort: {}

  }

  componentDidMount() {
    this.getClassify();
  }

  // 获取所有分类
  getClassify = () => {
    this.setState({
      showClassifyLoading: true
    })
    getCityList()
      .then(rawClassifyList => {

        this.refreshClassifyList(rawClassifyList);
        this.setState({
          showClassifyLoading: false
        })
      })
      .catch(() => {
        this.setState({
          showClassifyLoading: false
        })
      })
  }

  // 刷新分类树
  refreshClassifyList = (rawClassifyList) => {
    let classifyList = parseTree(rawClassifyList, true);
    let optionList = this.getParentClassifyOption(classifyList);
    this.addAnyClassifyformList[1].optionList = optionList;
    this.setState({
      rawClassifyList,
      classifyList
    })
  }

  // 添加任意分类
  addClassify = () => {
    this.showAddClassifyModal();
  }

  //保存分类排序
  saveClassifyOrder = () => {

    let order = this.formatSortSaveData(this.state.changedClassifySort);
    if (!order) {
      Toast('排序暂未修改！');
      return;
    }

    saveSort({ vos: order })
      .then(() => {
        Toast('保存成功');
        this.getClassify();
      })
    console.log(order);
  }

  //格式化保存分类的数据
  formatSortSaveData = (changedClassifySort) => {

    if (!changedClassifySort || !Object.keys(changedClassifySort).length) {
      return;
    }

    let result = Object.keys(changedClassifySort).map(k => {
      return {
        id: k,
        sort: changedClassifySort[k]
      }
    });
    return result;
  }

  // 分类的排序input更改
  onClassifySortChange = (value, id) => {
    let rawClassifyList = this.state.rawClassifyList;
    if (!rawClassifyList) {
      return;
    }
    let index = this.findClassifyIndexById(id, rawClassifyList);
    if (index || index == 0) {
      rawClassifyList[index]['sort'] = value;
      this.refreshClassifyList(rawClassifyList);
      let changedClassifySort = this.state.changedClassifySort;
      changedClassifySort[id] = value;
      this.setState({
        changedClassifySort
      })

    }
  }

  // 查找分类在数组的索引
  findClassifyIndexById = (id, arr) => {
    if (!id || !arr || !arr.length) {
      return;
    }
    let index = arr.findIndex((item) => {
      return item.id && item.id == id;
    });
    return index >= 0 ? index : null;
  }

  getClassifyNameById = (id) => {
    let rawClassifyList = this.state.rawClassifyList;
    let arr = rawClassifyList.filter(item => item.id == id);
    if (arr && arr[0]) {
      return arr[0].name
    }
  }

  /*新加任意分类************************************************************************************************/

  // 新加分类表单
  addAnyClassifyformList = [
    {
      type: "INPUT",
      field: "name",
      label: "分类名称：",
      maxLength: 50,
      placeholder: "请输入分类名称：",
      rules: [
        { required: true, message: '请输入分类名称!' },
        { pattern: /^([\w\u4E00-\u9FA5_\-\,\s.]+)+$/, message: '只能中文、英文、数字但不包括下划线等符号!' }
      ]
    },
    {
      type: "SELECT",
      field: "parentId",
      label: "父级分类:",
      placeholder: "请选择父级分类",
      optionList: [],
      rules: [
        { required: true, message: '请选择父级分类!' }
      ]
    },
    {
      type: "INPUT",
      inputType: "number",
      field: "sort",
      min: "0",
      label: "排序：",
      placeholder: "请设置排序",
      rules: [
        { required: true, message: '请设置排序!' }
      ]
    },
    {
      type: "INPUT",
      field: "remark",
      label: "备注",
      placeholder: "请输入备注",
      maxLength: 200,
      rules: [
        { required: true, message: '请输入备注!' }
      ]
    }
  ]

  showAddClassifyModal = () => {
    this.setState({
      addAnyClassifyModalVisible: true
    })
  }

  // 保存新加任意分类
  addAnyClassifySaveClicked = (data) => {
    let { name, sort, remark } = data;
    let parentId = data.parentId.key;
    let params = { name, sort, remark, parentId }
    // saveOrUpdateProductCategory(params)
    //   .then(() => {
    //     Toast('保存成功！');
    //     this.getClassify();
    //     this._hideAddAnyClassifyModal();
    //   })
  }

  _hideAddAnyClassifyModal = () => {
    this.setState({
      addAnyClassifyModalVisible: false
    })
  }

  // 获取所有的父分类
  getParentClassifyOption = (classifyList) => {
    if (!classifyList) {
      return [{ name: '所有分类', id: 0 }]
    }
    let arr = [{ name: '所有分类', id: 0 }];
    classifyList.forEach(item => {
      if (item.children) {
        arr.push({
          id: item.id, name: item.name
        })
      }
      let subItems = item.children;
      subItems.forEach(subItem => {
        if (subItem.children) {
          arr.push({
            id: subItem.id, name: subItem.name
          })
        }
      })
    })
    return arr;
  }

  /*新加指定分类************************************************************************************************/

  // 新加指定分类表单
  addSubClassifyformList = [
    {
      type: "INPUT",
      field: "parentName",
      label: "父类名称：",
      disabled: true,
      initialValue: ""
    },
    {
      type: "INPUT",
      field: "name",
      label: "分类名称：",
      maxLength: 50,
      placeholder: "请输入分类名称",
      rules: [
        { required: true, message: '请输入分类名称!' },
        { pattern: /^([\w\u4E00-\u9FA5_\-\,\s.]+)+$/, message: '只能中文、英文、数字但不包括下划线等符号!' }
      ]
    },
    {
      type: "INPUT",
      inputType: "number",
      field: "sort",
      min: "0",
      label: "排序：",
      placeholder: "请设置排序",
      rules: [
        { required: true, message: '请设置排序!' }
      ]
    },
    {
      type: "INPUT",
      field: "remark",
      label: "备注",
      placeholder: "请输入备注",
      maxLength: 200,
      rules: [
        { required: true, message: '请输入备注!' }
      ]
    }
  ]

  showAddSubClassifyModal = () => {
    this.setState({
      addSubClassifyModalVisible: true
    })
  }

  // 保存新加任意分类
  addSubClassifySaveClicked = (data) => {
    let { name, sort, remark } = data;
    let parentId = this.state.selectParentId;
    let id = this.state.selectId;
    let params = { name, sort, remark, parentId, id }
    // saveOrUpdateProductCategory(params)
    //   .then(() => {
    //     Toast('保存成功！');
    //     this.getClassify();
    //     this._hideAddSubClassifyModal();
    //   })
  }

  _hideAddSubClassifyModal = () => {
    this.setState({
      addSubClassifyModalVisible: false
    })
  }

  /**子分类操作****************************************************************************************************************************/

  // 编辑分类
  editClassify = (classify) => {
    let { name, sort, remark, id,parentId } = classify;
    let selectParentName = parentId == 0 ? '所有分类': this.getClassifyNameById(parentId);
    this.addSubClassifyformList[0].initialValue = selectParentName;
    let editSubClassifyFormValue = { name, sort, remark };
    this.setState({
      selectId: id,
      selectParentId: null,
      editSubClassifyFormValue
    })
    this.showAddSubClassifyModal()
  }

  // 添加子分类
  addSubClassify = (selectParentId) => {

    let editSubClassifyFormValue = {
      name: null, sort: null, remark: null
    }
    let selectParentName = selectParentId == 0 ? '所有分类': this.getClassifyNameById(selectParentId);
    this.addSubClassifyformList[0].initialValue = selectParentName;
    this.setState({
      selectId: null,
      editSubClassifyFormValue,
      selectParentId
    })

    this.showAddSubClassifyModal()
  }

  // 删除分类
  // deleteClassify = (id) => {
  //   deleteProductCategory({ id })
  //     .then(() => {
  //       Toast('删除成功!');
  //       this.getClassify();
  //     })
  // }

  /**渲染**********************************************************************************************************************************/

  render() {

    return (
      <CommonPage title={_title} description={_description} >
        <div className='padding-left20 border-e8'>
          <div className='padding20-0'>
            <Popconfirm
              placement="topLeft" title={'确认要保存产品的排序设置吗？'}
              onConfirm={() => { this.saveClassifyOrder() }} >
              <Button type='primary' className='normal margin-right20'>保存排序</Button>
            </Popconfirm>
          </div>
          <Spin spinning={this.state.showClassifyLoading}>
            <Tree
              showLine
              defaultExpandAll={true}
              onSelect={this.onSelect}
            >
              <TreeNode
                key='0'
                title={
                  <div>
                    <span className='margin-right'>所有分类</span>
                  </div>
                }
              >
                {this.renderTree()}
              </TreeNode>
            </Tree>
          </Spin>
        </div>

        <Modal
          title="新加任意分类"
          visible={this.state.addAnyClassifyModalVisible}
          footer={null}
          onCancel={this._hideAddAnyClassifyModal}
          className='noPadding'
        >
          <div className='flex-center'>
            <SubmitForm
              clearWhenHide={true}
              showForm={this.state.addAnyClassifyModalVisible}
              formItemList={this.addAnyClassifyformList}
              saveClicked={this.addAnyClassifySaveClicked}
              cancelClicked={this._hideAddAnyClassifyModal}
            />
          </div>
        </Modal>


        <Modal
          title="新加/修改分类"
          visible={this.state.addSubClassifyModalVisible}
          footer={null}
          onCancel={this._hideAddSubClassifyModal}
          className='noPadding'
        >
          <div className='flex-center'>
            <SubmitForm

              setFormValue={this.state.editSubClassifyFormValue}
              showForm={this.state.addSubClassifyModalVisible}
              formItemList={this.addSubClassifyformList}
              saveClicked={this.addSubClassifySaveClicked}
              cancelClicked={this._hideAddSubClassifyModal}
            />
          </div>
        </Modal>
      </CommonPage >

    )
  }


  renderTree = () => {
    let classifyList = this.state.classifyList;
    return this.renderTreeNode(classifyList);
  }

  getTreeNodeTitle = (item) => {
    let hasChildren = !!item.children;
    let canDelete = !item.children || !item.children.length;
    return (
      <div className='flex-center'>

        <InputNumber size="small" onChange={(value) => { this.onClassifySortChange(value, item.id) }} style={{ width: 80, marginRight: 10 }} min={0} max={9999999} value={item.sort} />
        <span className='margin-right'>{item.name}</span>
      </div>
    )
  }

  renderTreeNode = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode selectable={false} title={this.getTreeNodeTitle(item)} key={item.id}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode selectable={false} title={this.getTreeNodeTitle(item)} key={item.id} />
      )
    })
  }
}
export default AreaManage;