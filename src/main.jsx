import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Store/store';

import './index.css';
import './App.css';
import router from './router';

// Import i18n setup and LanguageProvider
import './i18n';
import { LanguageProvider } from './context/LanguageContext';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </Provider>
);
