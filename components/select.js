import ReactDOM from "react-dom";
import Image from 'next/image'
import React, { useState, useEffectm } from 'react'
import aesjs from '../utils/aes-js.js'
import * as deezerDecoder from '../utils/dz.js'
import { saveAs } from '../utils/fs.js'
import { hex_md5 } from '../utils/md5.js'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const axios = require('axios');
const ID3Writer = require('browser-id3-writer')
var qlist = [];
var currentlyDownloading = false;
const urlCryptor = new aesjs.ModeOfOperation.ecb(aesjs.utils.utf8.toBytes('jo6aey6haid2Teih')),

	bin2hex = function(b) {
		return aesjs.utils.hex.fromBytes(b);
	}, //aesjs.util.convertStringToBytes(b);
	str2bin = function(s) {

		return s.split('').map(c => c.charCodeAt(0));
	}, //aesjs.util.convertStringToBytes(s));
	aesBS = 16,
	zeroPad = function(b) {
		let l = b.length;
		if (l % aesBS !== 0) {
			if (typeof(b) === 'string') b += '\0'.repeat(aesBS - (l % aesBS));
			else b = b.concat(Array.apply(null, Array(aesBS - (l % aesBS))).map(() => 0));
		}
		return b;
	},

	urlsep = '\xa4';
export default function Select(props) {
function blobencry(resolve, url, songId, artn, title, arl, QL) {
  var type;
  if(QL=="9"){
    type=".flac";
  }else{
    type=".mp3";
  }
	axios.request({
    responseType: 'arraybuffer',
    followAllRedirects: true,
    url: "https://deezcors.herokuapp.com/"+url+type,
    method: 'get', 
      headers: {
        'origin': 'x-requested-with'
      },
        onDownloadProgress: progressEvent => {
      
          let percentCompleted = Math.floor(progressEvent.loaded / progressEvent.total * 100)
          var arr;
          props.addL(oldArray => arr=oldArray)
          let updatedList = arr.map(item => 
            {
              if (item.id == songId){
                return {...item, p: percentCompleted}; //gets everything that was already in item, and updates "done"
              }
              return item; // else return unmodified item 
            });
           
            props.addL(updatedList);
        }
  }).then((userData) => {
			var decoded = deezerDecoder(userData['data'], songId);
			
			const writer = new ID3Writer(decoded);
			writer.setFrame('TIT2', 'Home')
				.setFrame('TPE1', ['Eminem', '50 Cent'])
				.setFrame('TALB', 'Friday Night Lights')
				.setFrame('TYER', 2004);
			writer.addTag();
			// const blob = new Blob([writer], {
			// 	type: 'audio/mpeg'
			// });
			const blob = writer.getBlob();
			saveAs(blob, artn + " - " + title+type);
      setTimeout(function(){
        resolve();
      }, 100);
		})
}
var decrypTrack = async function(trackValue, arlValue, QL) {
  return new Promise(resolve => {
    fetch('api/data', {
      method: 'POST',
      headers: {
      'content-type': 'application/json',
      },
      body: JSON.stringify({
        arl: arlValue,
        track: trackValue
      }),
    })
    .then((res) => res.json())
    .then((userData) => {
      var regex = new RegExp(/<script>window\.__DZR_APP_STATE__ = (.*)<\/script>/g);
      var rexec = regex.exec(userData['htmlString']);
      var _data = rexec[1];
      var obj = JSON.parse(_data);
      let str = [obj['DATA']['MD5_ORIGIN'], Number(QL), obj['DATA']['SNG_ID'], obj['DATA']['MEDIA_VERSION']].join(urlsep);
      str = zeroPad([hex_md5(str), str, ''].join(urlsep));
      var encURL = "https://e-cdns-proxy-" + obj['DATA']['MD5_ORIGIN'].substring(0, 1) + ".dzcdn.net/mobile/1/" + bin2hex(urlCryptor.encrypt(str2bin(str)));
      blobencry(resolve, encURL, obj['DATA']['SNG_ID'], obj['DATA']['ART_NAME'], obj['DATA']['SNG_TITLE'], arlValue, QL);
    })

  });
};
var getTracks = async function(arl){
  for(var track of qlist){
    await decrypTrack("https://www.deezer.com/en/track/"+track, arl, 1);
  }
  currentlyDownloading = !currentlyDownloading;
}


  
  var eventify = async function(arr, callback) {
    arr.push = function(e) {
        Array.prototype.push.call(arr, e);
        callback(arr);
    };
    
  };
  eventify(qlist, function(newArray) {
    if(!currentlyDownloading){
      getTracks(props.data[0]);
      currentlyDownloading = !currentlyDownloading;
    }
  });
  async function updateQueue(tracks, title, md5){
    
    for(var id of tracks){
      qlist.push(id[0]);
      await props.addL(oldArray => [...oldArray, {id: id[0], p: 0, t: id[1], img: md5}]);
    }
    
  }
  
  function soundControl(){
    const audio = document.getElementById("player");
    setIsPlaying(current => !current);
    if (audio.paused) {
      audio.play();
    } else { 
      audio.pause();
    }
  }
    const [QL, setQL] = React.useState('1')
    const [playing, setIsPlaying] = React.useState(false)
    const [hoverc, setIsHoverC] = React.useState(false)
    if (props.data && props.data) {
      const data = props.data;
      function truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
      };
      var song = truncate(data[2], 30);
      var artist = truncate(data[4], 20);
        return (
            <React.Fragment>
                <div style={{width: '100%',height: '56px', marginBottom: '10px'}}>
                <img src={"http://cdn-images.dzcdn.net/images/cover/"+data[3]+"/56x56-000000-80-0-0.jpg"} style={{borderRadius: '3px', float: "left"}}></img>
                
                <p style={{marginLeft: '10px', fontWeight: 'bold', float: 'left'}}>{song} - {artist} </p>
                
                {data[1] == 'track' ? (
                  <p onMouseEnter={() => setIsHoverC(true)} onMouseLeave={() => setIsHoverC(false)} style={{float: "right"}}>
                    {playing == false ?(
                      <FontAwesomeIcon onClick={soundControl} icon={faPlay} style={{fontSize: '1.3rem', width: '1rem'}}/>
                    ):
                    <React.Fragment>
                      {hoverc == false ? (
                          <img src={"https://i.imgur.com/c4tJH4g.gif"} onClick={soundControl} style={{width: '16px'}}></img>
                        ) : 
                          <FontAwesomeIcon onClick={soundControl} icon={faPause} style={{fontSize: '1.3rem', width: '1rem'}}/>
                        }
                      </React.Fragment>
                      
                    }
                    <audio id="player" crossOrigin="anonymous" onEnded={() => setIsPlaying(current => !current)} src={data[5]}></audio>
                  </p>
                  ):
                    null
                  }
                  </div>
              <div id="selectcontainer" style={{width: "100%"}}>

                {/* <div id="redbox" style={{width: '100%'}}> */}
                  {/* <button style={{width: '100%', float: 'right'}} onClick={() => {getTracks(data.slice(6), data[0], QL), props.setQ(true) }}>Download</button> */}
                  <button style={{width: '100%', float: 'right'}} onClick={() => {updateQueue(data[6], data[2], data[3]), props.setQ(true) }}>Download</button>
                  {/* , props.addL(oldArray => [...oldArray, [1]]) */}
                {/* </div> */}

              </div>
            </React.Fragment>
        )
    }else{
		return(
        <div>. . .</div>
        );
	}
    
};
