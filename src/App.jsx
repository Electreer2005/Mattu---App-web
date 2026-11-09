import { ThemeProvider } from './context/ThemeContext';
import AppNavigator from './Navigation/AppNavigator';
import './App.css'
import PWAInstallPrompt from './components/PWAInstallPrompt/PWAInstallPrompt'

function App() {

  return (
    <ThemeProvider>
      <AppNavigator />
      <PWAInstallPrompt />
    </ThemeProvider>
  )
}

export default App