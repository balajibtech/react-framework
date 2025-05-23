import { Col, Row, Typography } from "antd";
import "./Footer.scss";
import dayjs from "dayjs";

const { Text } = Typography;

/**
 * Footer component renders the footer section of the application.
 * It displays copyright information.
 *
 * @returns {JSX.Element} The footer JSX element.
 */
const Footer: React.FC = () => {
  return (
    <Row className="cls-footer cls-container" justify="end">
      <Col>
        <Text>All copyrights reserved @ {dayjs().year()}</Text>
      </Col>
    </Row>
  );
};

export default Footer;
