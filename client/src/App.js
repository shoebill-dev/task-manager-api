import './App.css';
import React from 'react'

function App() {

  const [userName, setUserName] = React.useState(null)

  React.useEffect(() => {
    fetch("/users/me", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer `
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
