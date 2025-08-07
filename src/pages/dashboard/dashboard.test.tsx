import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../../i18n';
import store from '../../store';
import Dashboard from './dashboard';

describe('Dashboard', () => {
  test('renders dashboard content when authenticated', () => {
    store.dispatch({ type: 'auth/login', payload: { username: 'test', password: 'test' } });
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
    expect(screen.getByText('This is your dashboard.')).toBeInTheDocument();
  });
});
