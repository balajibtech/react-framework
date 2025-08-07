import { Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import './home.scss';

const { Title } = Typography;

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Row justify="center" className="home">
      <Col xs={24} sm={20} md={18}>
        <Title level={2} aria-label={t('home.title')}>
          {t('home.welcome')}
        </Title>
      </Col>
    </Row>
  );
};

export default Home;
