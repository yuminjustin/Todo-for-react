var AddForm = React.createClass({
	addItem:function(){
		var v = this.refs.addItem.value;
		if(v){
			this.props.onSubmitItem({value: v});
			this.refs.addItem.value = "";
		}
	},
	render:function(){
		return (
			<div className="c addbox">
			   <input type="text" ref="addItem" placeholder="输入需要添加的文字"/>
			   <button onClick={this.addItem}>添加</button>
		    </div>
		);
	}
});

var ListItem = React.createClass({
	getInitialState: function() {
        return {id: null};
    },
	editHandle:function(data){
		this.refs.check.checked = false;
		this.props.onEditItem(data.id);
		this.setState({id:data.id});
	},
	changeHandle:function(data){
		this.setState({id:data.id});
	},
	updateHandle:function(){
		var v = this.refs.value.value;
		if(v) this.props.onUpdateItem(this.state.id,v);
		else  this.props.onCancelItem(this.state.id);
		this.setState({id:null});
		this.refs.value.value = "";
	},
	cancelHandle:function(){
		this.props.onCancelItem(this.state.id);
		this.setState({id:null});
	},
	showDelHandle:function(data){
		var b = this.refs.check.checked;
		this.props.onShowDelItem(data.id,b);
		(b)?this.setState({id:data.id}):this.setState({id:null});
	},
	deleteHandle:function(){
		this.refs.check.checked = false;
		this.props.onDeleteItem(this.state.id);
		this.setState({id:null});
	},
	render:function(){
		var select = this.props.data.selected?"operate r":"operate r none",
			update = this.props.data.update?" db":" none",
			update2 = this.props.data.update?" none":" db",
			u1 = "operate r"+update,
			u2 = "l"+update,
			u3 = "l ellipsis"+update2;
		return (
			<li>
			  <input type="checkbox" ref="check" className="l db" onClick={this.showDelHandle.bind(this,this.props.data)}/>
			  <input type="text" ref="value" placeholder={this.props.data.value} onChange={this.changeHandle.bind(this,this.props.data)} className={u2} />
			  <span className={u3} onDoubleClick={this.editHandle.bind(this,this.props.data)}>
	            {this.props.data.value}
	          </span>
			  <div className={select}>
				<button onClick={this.deleteHandle}>删除</button>
			  </div>
			  <div className={u1}>
				<button onClick={this.updateHandle}>修改</button>
				<button onClick={this.cancelHandle}>取消</button>
			  </div>
			</li>
		);
	}
});

var Todo = React.createClass({
	getInitialState: function() {
        return {
			data: [],
			choose:false,
			chooseArr:[]
		};
    },
	getNum:function(id){
		var data = this.state.data,
			re = null;
		for(var i = 0,l= data.length;i<l;i++){
			var temp = data[i];
			if(temp.id == id){
				re = i;
				break;
			}
		}
		return re;
	},
	checkChoose:function(){
		var data = this.state.data,re = false,data2 = [];
		for(var i = 0,l= data.length;i<l;i++){
			var temp = data[i];
			if(temp.selected){
				re = true;
				data2.push(temp);
			}
		}
		this.setState({choose:re});
		this.setState({chooseArr:data2});
	},
	submitItem:function(v){
		{/*form 提交*/}
		var data = this.state.data,
			item = {
			    value:v.value,
			    id:data.length,
				update:false,
				selected:false
		    };
		data.push(item);
		this.setState({data:data});
	},
	updateItem:function(id,v){
		{/*修改 单个*/}
		var data = this.state.data,
			i = this.getNum(id);
		data[i].update = false;
		data[i].value = v;
		this.setState({data:data});
	},
	EditItem:function(id){
		var data = this.state.data,
			i = this.getNum(id);
		data[i].update = true;
		data[i].selected = false;
		this.setState({data:data});
		this.checkChoose();
	},
	cancelItem:function(id){
		var data = this.state.data,
			i = this.getNum(id);
		data[i].update = false;
		this.setState({data:data});
	},
	showDelItem:function(id,b){
		var data = this.state.data,
			i = this.getNum(id);
		data[i].selected = b;
		data[i].update = false;
		this.setState({data:data});
		this.checkChoose();
	},
	deleteItem:function(id){
		var data = this.state.data,
			i = this.getNum(id);
		data.splice(i,1);
		this.setState({data:data});
		this.checkChoose();
	},
	delChoose:function(){
		var data = this.state.chooseArr;
		for(var i = 0,l= data.length;i<l;i++){
			this.deleteItem(data[i].id);
		}
		this.setState({choose:false});
		this.setState({chooseArr:[]});
		if(this.state.data.length){
			var inputs = this.refs.ul.getElementsByTagName("input");
			for(var i = 0,l= inputs.length;i<l;i++){
			    if(inputs[i].type=="checkbox") inputs[i].checked = false;
		    }
		}
	},
	render:function(){
		var t = this,
			delBtn = (t.state.choose)?"del r":"del r none";
		return (
			<div className="mainbox m oh">
                <h1>React todo</h1>
			    <AddForm onSubmitItem={t.submitItem}/>
			    <div className="c oh listbox">
			      <ul ref="ul">
			         {t.state.data.map(function(item,i) {
                       return <ListItem key={i} data={item} onEditItem={t.EditItem} onUpdateItem={t.updateItem} onCancelItem={t.cancelItem} onShowDelItem={t.showDelItem} onDeleteItem={t.deleteItem}/>;
                     })}
			      </ul>
		        </div>
	            <button className={delBtn} onClick={t.delChoose}>删除选中项</button>
            </div>
		);
	}						 
})

ReactDOM.render(<Todo/>, document.getElementById('container') );