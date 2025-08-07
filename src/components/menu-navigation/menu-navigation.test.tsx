import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../../i18n';
import MenuNavigation from './menu-navigation';

describe('MenuNavigation', () => {
  test('renders navigation links', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <MenuNavigation theme="light" toggleTheme={jest.fn()} />
        </BrowserRouter>
      </I18nextProvider>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
