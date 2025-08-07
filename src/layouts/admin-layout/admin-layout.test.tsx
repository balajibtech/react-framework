import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import AdminLayout from './admin-layout';

describe('AdminLayout', () => {
  test('renders sidebar and main content', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AdminLayout>
          <div>Test Content</div>
        </AdminLayout>
      </I18nextProvider>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
