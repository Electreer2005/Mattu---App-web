import { ThemeProvider } from './context/ThemeContext';
import AppNavigator from './Navigation/AppNavigator';
import './App.css'

function App() {

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  )
}

export default App