export default function Detail(props) {
	if (props.data && props.data) {
		const title = props.data;
		console.log(title);
		
		return (
			<div>{title}</div>
		);
	}else{
		return(<div>loading</div>);
	}

    
  };
 