import { AppState } from '../stores/Store';

const hydrateUserFromLocalStorage = () => {
  let cache = localStorage.getItem(import.meta.env.VITE_BROWSER_STORAGE_PREFIX + 'user');
  if (cache) {
    const user: null | AppState['UserReducer']['user'] = JSON.parse(atob(cache));
    if (user && user.id && user.name && user.email) {
      return user;
    } else {
      console.log('api returned success, but user not found in storage,');
    }
  }
};

export { hydrateUserFromLocalStorage };
