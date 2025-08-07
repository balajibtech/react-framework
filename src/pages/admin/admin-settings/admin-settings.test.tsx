import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../../../i18n';
import store from '../../../store';
import AdminSettings from './admin-settings';

describe('AdminSettings', () => {
  test('renders settings content when authenticated', () => {
    store.dispatch({ type: 'auth/login', payload: { username: 'test', password: 'test' } });
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <AdminSettings />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
    expect(screen.getByText('Adjust settings here.')).toBeInTheDocument();
  });
});
