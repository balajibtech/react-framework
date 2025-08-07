import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../../i18n';
import AdminSidebar from './admin-sidebar';

describe('AdminSidebar', () => {
  test('renders sidebar links', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AdminSidebar />
        </BrowserRouter>
      </I18nextProvider>
    );
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
