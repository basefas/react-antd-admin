import React, {Component} from 'react';
import {Result} from "antd";

class PageNotFound extends Component {
  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Page Not Found~!"
      />
    );
  }
}

export default PageNotFound;
