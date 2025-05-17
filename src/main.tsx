import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import App from 'src/App'
import 'src/i18n/i18n'
import i18n from 'src/i18n/i18n'
import { AppProvider } from './contexts/app.context'
import './index.css'
import { worker } from './msw/browser'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

async function enableMocking(isEnable: boolean = false) {
  if (isEnable) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      return worker.start({
        onUnhandledRequest: 'bypass' // Don't warn about unhandled requests
      })
    }
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AppProvider>
            <App />
          </AppProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
})
