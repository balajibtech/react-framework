import "./ComingSoon.scss";
import { Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const ComingSoon = () => {
  return (
    <div data-testid="comingsoon" className="cls-comingSoon">
      <Result
        icon={<SmileOutlined style={{color:"var(--t-common-primary)"}} />}
        title="Coming Soon....."
      />
    </div>
  );
};

export default ComingSoon;
