import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Home from './home';

describe('Home', () => {
  test('renders welcome message', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>
    );
    expect(screen.getByText('Welcome to the Home Page!')).toBeInTheDocument();
  });
});
