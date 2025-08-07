import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n from '../../../i18n';
import store from '../../../store';
import Login from './login';

describe('Login', () => {
  test('renders login form', () => {
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Login />
        </I18nextProvider>
      </Provider>
    );
    expect(screen.getByLabelText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
