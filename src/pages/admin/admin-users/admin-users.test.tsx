import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../../../i18n';
import store from '../../../store';
import AdminUsers from './admin-users';

describe('AdminUsers', () => {
  test('renders users content when authenticated', () => {
    store.dispatch({ type: 'auth/login', payload: { username: 'test', password: 'test' } });
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <AdminUsers />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
    expect(screen.getByText('Manage users here.')).toBeInTheDocument();
  });
});
