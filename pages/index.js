import dynamic from 'next/dynamic'
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import ReactDOM from "react-dom";
const SelectComponent = dynamic(() => import('../components/select'));
const PopoutComponent = dynamic(() => import('../components/popout'));

// wake up heroku server
fetch("https://deezcors.herokuapp.com/");

var handleCollection = async function(trackValue, arlValue) {
  return new Promise(resolve => {
    var url = new URL(trackValue);
    var tracks = [];
    var dict = {"arl": "", title: ""};
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
            tracks.push("track");
            tracks.push(obj['title']);
            tracks.push(obj['md5_image']);
            tracks.push(obj['artist']['name']);
            tracks.push(obj['preview']);
            tracks.push([]);
            tracks[tracks.length-1].push([obj['id'], obj['title']]);
            
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
            tracks.push("album");
            tracks.push(obj['title']);
            tracks.push(obj['md5_image']);
            tracks.push(obj['artist']['name']);
            tracks.push("preview");
            tracks.push([]);
            obj['tracks']['data'].map((t,c) => {
              tracks[tracks.length-1].push([t['id'], t['title']]);
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



export default function Home() {
  const [queue, setQ] = React.useState(false);
  const [qList, addL] = React.useState([]);
  const [trackValue, setTV] = React.useState('')
  const [arlValue, setAV] = React.useState('')
  // useEffect(() => {
  //   console.log(123);
  // }, [qList]);
  
  const handleSubmit = (e) => {
    e.preventDefault()
    var async_function = async function() {
      if(trackValue && arlValue != ''){
        const first_promise= await handleCollection(trackValue, arlValue);
        // console.log(first_promise);
        ReactDOM.render(<motion.div style={{width: "100%", alignItems: "center", marginTop: '10px'}}><SelectComponent addL={addL} qList={qList} setQ={setQ} data={first_promise} /></motion.div>, document.getElementsByClassName("res")[0]);
        // ReactDOM.render(<SelectComponent data={first_promise} />, document.getElementsByClassName("res")[0]);
  
      }
      }
      async_function();
    // data['cookie'] = arlValue;
    // ReactDOM.render(<motion.div animate={{height: '60px'}}><SelectComponent data={handleCollection(trackValue, arlValue)} /></motion.div>, document.getElementsByClassName("res")[0]);
    setTimeout(function(){
      // ReactDOM.render(<motion.div animate={{height: '60px'}}><SelectComponent data={data} /></motion.div>, document.getElementsByClassName("res")[0]);
    }, 500);
  }


const setInitialTheme = `
const btn = document.querySelector(".btn-toggle");

const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
    document.body.classList.toggle("dark-theme");
} else if (currentTheme == "light") {
    document.body.classList.toggle("light-theme");
}

btn.addEventListener("click", function () {
    var theme = document.body.classList.contains("light-theme")
        ? "dark"
        : "light";
    if (theme == "light") {
        document.body.classList.toggle("light-theme");
        document.body.classList.toggle("dark-theme");
        var theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
    } else {
        document.body.classList.toggle("dark-theme");
        document.body.classList.toggle("light-theme");
        var theme = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";
    }
    localStorage.setItem("theme", theme);
});
`;
  return (
    
    <div className='app'>
      <div id="container">
        <div className="btn-toggle">
          <div className="module-border-wrap">
            <div className="module">
              <div id="inputcontainer">

                <div className="box" id="cookie">
                  <input style={{width: '100%', color: '#7d7d7d'}} placeholder='arl cookie'
                    value={arlValue}
                    onChange={(e) => setAV(e.target.value)}
                    required></input>
                </div>

                <div className="box" id="url">
                  <form onSubmit={handleSubmit}>
                    <input style={{width: '100%', marginBottom: "0"}} placeholder='deezer track url. . .'
                      value={trackValue}
                      onChange={(e) => setTV(e.target.value)}
                      required></input>
                  </form>
                </div>
                
              </div>
                <div className='res'> 

                </div>
            </div>
            {queue == true ? (
              <motion.div  animate={{
                marginTop: '10px', minHeight: '130px'
              }}>
              <PopoutComponent data={qList} /></motion.div>): null}
          </div>
        </div>
      </div>
      {/* <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} /> */}
    </div>
  )
}
