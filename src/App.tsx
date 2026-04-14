import { Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load main component for better performance
const SilifkeTeknoloji = lazy(() => import('./components/SilifkeTeknoloji'))

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-background">
          <Suspense fallback={<LoadingSpinner />}>
            <SilifkeTeknoloji />
          </Suspense>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
