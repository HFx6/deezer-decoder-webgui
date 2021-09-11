export default function Popout(props) {
    if (props.data && props.data) {
        function truncate(str, n){
            return (str.length > n) ? str.substr(0, n-1) + '...' : str;
          };
        const listItems = props.data.map((e) =>
            <div className="dlq" style={{borderRadius: '4px', marginTop: '10px', height: '56px',background: 'rgb(103, 144, 96)', background: "linear-gradient(90deg, rgba(103, 144, 96,1) "+e.p+"%, rgb(77 77 80) "+e.p+"%)"}}>
                    <img src={"http://cdn-images.dzcdn.net/images/cover/"+e.img+"/56x56-000000-80-0-0.jpg"} style={{borderRadius: '4px', float: 'left', marginRight: '10px'}}></img>
                
                    <p style={{float: 'left'}}>{truncate(e.t, 30)}</p>
                
                    <p style={{float: 'right', marginRight: '10px'}}>{e.p}%</p>
               
            </div>
        );
    return (
        <div className="pullout" >
                {listItems}
        </div>
    );
    }else{
		return(
        <div>. . .</div>
        );
	}

};