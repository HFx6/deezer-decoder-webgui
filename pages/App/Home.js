import dynamic from 'next/dynamic'
import React, { Component } from 'react';
import { motion } from 'framer-motion';
import ReactDOM from "react-dom";
const SelectComponent = dynamic(() => import('../../components/select'));
const PopoutComponent = dynamic(() => import('../../components/popout'));

var handleCollection = async function(trackValue, arlValue) {
  return new Promise(resolve => {
    var url = new URL(trackValue);
    var tracks = [];
    var dict = {};
    // console.log(trackValue);
    if(url.host=="www.deezer.com" || url.host=="deezer.com"){
    if(trackValue.includes("track")){
        var id = trackValue.split("/");
        fetch('api/data', {
        method: 'POST',
        headers: {
        'content-type': 'application/json',
        },
        body: JSON.stringify({
            arl: arlValue,
            track: "http://api.deezer.com/2.0/track/"+id[id.length-1]
        }),
        })
        .then((res) => res.json())
        .then((userData) => {
        var obj = JSON.parse(userData['htmlString']);
            tracks.push(arlValue);
            tracks.push(obj['title']);
            tracks.push(obj['md5_image']);
            tracks.push(obj['artist']['name']);
            tracks.push(obj['id']);
        })
    }else if(trackValue.includes("album")){
        
        var id = trackValue.split("/");
        fetch('api/data', {
        method: 'POST',
        headers: {
        'content-type': 'application/json',
        },
        body: JSON.stringify({
            arl: arlValue,
            track: "http://api.deezer.com/album/"+id[id.length-1]
        }),
        })
        .then((res) => res.json())
        .then((userData) => {
            var obj = JSON.parse(userData['htmlString']);
            tracks.push(arlValue);
            tracks.push(obj['title']);
            tracks.push(obj['md5_image']);
            tracks.push(obj['artist']['name']);
            obj['tracks']['data'].map((t,c) => {
              tracks.push(t['id']);
              });
        })

    }else if(trackValue.includes("playlist")){
        var id = trackValue.split("/");
        fetch('api/data', {
        method: 'POST',
        headers: {
        'content-type': 'application/json',
        },
        body: JSON.stringify({
            arl: arlValue,
            track: "http://api.deezer.com/playlist/"+id[id.length-1]
        }),
        })
        .then((res) => res.json())
        .then((userData) => {
          tracks.push(arlValue);
          tracks.push(obj['title']);
        JSON.parse(userData['htmlString'])['tracks']['data'].forEach(t => {
            tracks.push(t.id);
        });
        })
        
    }
    }else{
    alert("not supported");
    }
    // resolve(tracks);
    setTimeout(function(){
      resolve(tracks);
    }, 500);
  });
};



class Home extends Component {
    
  render(){
  
  return (
    
    <div className='app'>
      <div id="container">
        <div className="btn-toggle">
          <div className="module-border-wrap">
            <div className="module">
              <div id="inputcontainer">

                <div className="box" id="cookie">
                  <input style={{width: '100%'}} placeholder='cookie'
                    value={arlValue}
                    onChange={(e) => setAV(e.target.value)}
                    ></input>
                </div>

                <div className="box" id="url">
                  <form onSubmit={handleSubmit}>
                    <input style={{width: '100%'}} placeholder='search'
                      value={trackValue}
                      onChange={(e) => setTV(e.target.value)}
                      ></input>
                  </form>
                </div>
                
              </div>
                <div className='res'> 

                </div>
            </div>
            {queue == true ? (
              <motion.div  animate={{
                marginTop: '10px'
              }}>
            <div className="pullout">
              {/* <PopoutComponent /> */}
              
            </div></motion.div>): null}
          </div>
        </div>
      </div>
      {/* <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} /> */}
    </div>
  )
            }
}
export default Home;