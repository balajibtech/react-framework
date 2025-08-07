import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import MainLayout from './main-layout';

describe('MainLayout', () => {
  test('renders header, main, and footer', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      </I18nextProvider>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
