import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import './index.css';
import { App } from './App';
import { AuthRemoteDatasourceImpl } from './features/auth/data/datasources/authRemoteDatasource';
import { AuthStore } from './features/auth/presentation/stores/authStore';
import '@shopify/polaris/styles.css';

let authRemoteDatasource = new AuthRemoteDatasourceImpl();

let authStore = new AuthStore({
  authRemoteDatasource: authRemoteDatasource,
});

authStore.getMyAccount();

ReactDOM.render(
  <React.StrictMode>
    <AppProvider i18n={en}>
      <Provider authStore={authStore}>
        <App />
      </Provider>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
