import React, { Component } from "react";
import CommonPage from '../../components/common-page';
const _title = "首页";
const _description = ""

class Home extends Component{
  componentDidMount() {
    
  }  

  /**渲染**********************************************************************************************************************************/

  render() {
    
    return (
      <CommonPage title={_title} description={_description} >
        
      </CommonPage >
    )
  }
}
export default Home


