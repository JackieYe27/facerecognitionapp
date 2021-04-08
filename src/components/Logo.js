import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css';
import cblogo from './cherry-blossom.png';


const Logo = () => {
    return (
        <div className='ma4 mt0 tc'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 200, width: 200 }} >
                <div className="Tilt-inner pa3"> <img style ={{paddingTop: '5px'}} src={cblogo} alt="logo"/> </div>
            </Tilt>
        </div>
    )
}

export default Logo;