import React from 'react';
import ReactDOM from 'react-dom';
import api from './api';
import Map from './Map';
import Home from './Home';
import Cyclist from './Cyclist';
import Race from './Race';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Slide from '@material-ui/core/Slide';

class RightUI extends React.Component {
    constructor(props) {
        super(props);
        this.renderRightUI = this.renderRightUI.bind(this);
    }

    renderRightUI() {
        let props = this.props;

        return (
            <div>
                <Slide direction="right" in={props.rightUI === 'home'} mountOnEnter unmountOnExit>
                    <Home {...props}/>
                </Slide>

                <Slide direction="left" in={props.rightUI === 'race'} mountOnEnter unmountOnExit>
                    <Race {...props}/>
                </Slide>

                <Slide direction="left" in={props.rightUI === 'cyclist'} mountOnEnter unmountOnExit>
                    <Cyclist {...props}/>
                </Slide>
            </div>
        )
    }
    
    render() {
        return (
            <this.renderRightUI/>
        )
    }
}

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.handlerRightUI = this.handlerRightUI.bind(this);
        this.state = {
            classiques: [],
            cyclists: [],
            rightUI: 'home',
            focusOn: 'Philippe Gilbert'
        };
    }

    handlerRightUI(themeUI, name) {
        this.setState({
            rightUI: themeUI,
            focusOn: name
        })
    }

    componentDidMount() {
        api.getAllClassiques()
            .then(response => {
                this.setState({classiques: response.data.data});
            })
    
        api.getAllCyclists()
            .then(response => {
                this.setState({cyclists: response.data.data});
            })
    }

    render() {
        let props = {
            handlerRightUI: this.handlerRightUI,
            classiques: this.state.classiques,
            cyclists: this.state.cyclists,
            rightUI: this.state.rightUI,
            focusOn: this.state.focusOn
        }

        if (!this.state.classiques && !this.state.cyclists) {
            return <div>...Loading...</div>;
        }
        else {
            return (
                <div>
                    <Map {...props}/>
                    <RightUI {...props}/>
                </div>
            )
        }
    }
}

ReactDOM.render(<Application />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();