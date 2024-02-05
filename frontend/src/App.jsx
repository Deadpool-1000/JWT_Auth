import { useState } from 'react'
import axios from 'axios'


axios.defaults.withCredentials = true

function App() {
  const [privateInfo, setPrivateInfo] = useState()
  const [error, setError] = useState()


  const createCookie = ()=>{
    axios.post("http://localhost:3000/login_with_secret", {withCredentials:true}).then(res=>{
      console.log(res);
    }).catch(err=>{
      setError("Couldnt login, please try again later!")
    })
  }

  const getPrivate = ()=>{
    axios.get("http://localhost:3000/private_with_secret", {withCredentials:true}).then(res=>{
      if(res.oK){
        setPrivateInfo('Coulnt get the private information because there was no token provided')
      }
      setPrivateInfo(res.data.secret)
    }).catch(err=>{
      setError("Couldnt get private information!")
    })
  }



  return (
    <>
      <p>Hello Explore JWT</p>
      <button onClick={createCookie}>Click me to get a cookie</button>
      <button onClick={getPrivate}>Get Private Information</button>
      {error && !privateInfo && <p style={{color:'red'}}>{error}</p>}
      {privateInfo && <h2>My secret is {privateInfo}</h2>}
    </>
  )
}

export default App
