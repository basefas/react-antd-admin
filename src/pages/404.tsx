import { Result } from 'antd';
import { FC } from 'react';

const NoFoundPage: FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
  />
);
export default NoFoundPage;
