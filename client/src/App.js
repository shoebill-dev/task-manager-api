import './App.css';
import React from 'react'

function App() {

  const [userName, setUserName] = React.useState(null)

  React.useEffect(() => {
    fetch("/users/me", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzFmNmE5Njc5ZGY4MTliNDE2ODdmMzAiLCJpYXQiOjE2NjMwMDMyODZ9.8vIahLS6Uq6HWAINz3xMI28YylnC-jHRVAuzGhMrxK4`
      }
    }).then(response => response.json()).then(data => setUserName(data.name))
  }, [])


  return (
    <div className="App">
      <p>{userName}</p>
    </div>
  );
}

export default App;
