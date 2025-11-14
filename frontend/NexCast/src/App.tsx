import { useAuth } from 'react-oidc-context'
import './App.css'

function App() {
  const auth = useAuth()

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
    const logoutUri = `${window.location.origin}/`
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
  }

  if (auth.isLoading) {
    return <div>Loading...</div>
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>
  }

  if (auth.isAuthenticated) {
    return (
      <div className="container">
        <h1>NexCast - Live Gaming Commentary</h1>
        <div className="user-info">
          <p><strong>Email:</strong> {auth.user?.profile.email}</p>
          <p><strong>Status:</strong> Authenticated</p>
        </div>
        <div className="token-info">
          <details>
            <summary>ID Token</summary>
            <pre>{auth.user?.id_token}</pre>
          </details>
          <details>
            <summary>Access Token</summary>
            <pre>{auth.user?.access_token}</pre>
          </details>
        </div>
        <button onClick={() => signOutRedirect()}>Sign Out</button>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>NexCast - Live Gaming Commentary</h1>
      <p>Sign in to start your live commentary session</p>
      <button onClick={() => auth.signinRedirect()}>Sign In</button>
    </div>
  )
}

export default App
