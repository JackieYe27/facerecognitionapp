import React from 'react';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import ImageLinkForm from './components/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition';
import Rank from './components/Rank';
import Particles from 'react-particles-js';
import './App.css'
import Signin from './components/Signin';
import Register from './components/Register';


const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 900
      }
    }
  }
}


const initialState = {
  input: '',
  imgUrl: '',
  box: {},
  route:'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entires: 0,
    joined: ''
  }
}


class App extends React.Component {
  constructor() {
    super();
    this.state = initialState
  }



  // recievs data from the onsumbit 
  calculateFaceLocation = (data) => {
    // basically the first box for face
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // gets the image from FaceRec tag
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // sets the state to have the blue box
  displayFaceBox = (box) => {
    console.log('box details ', box)
    this.setState({box: box});
  }

  onInputChange = (e) => {
    console.log(e.target.value);
    this.setState({input: e.target.value})
  }

  onBSubmit = () => {
    console.log('click')
    this.setState({imgUrl: this.state.input})
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
      .then(response => response.json())
    .then(response => {
      console.log('hi', response)
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(err => console.log(err));
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
};

  // change the route
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  // loadUser function
  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions} />
        <Navigation isSignedIn ={this.state.isSignedIn} onRouteChange ={this.onRouteChange}/>
        {this.state.route === 'home' 
        ? <div>
            <Logo />
            <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onBSubmit= {this.onBSubmit}/>
            <FaceRecognition box={this.state.box} imgUrl = {this.state.imgUrl}/>
          </div>
        : (
          this.state.route === 'signin'
          ? <Signin onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/> 
          : <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/> 
          )
        }
      </div>
    )
  }
}

export default App;
