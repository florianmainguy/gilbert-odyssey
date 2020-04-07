import React from 'react';
import ReactDOM from 'react-dom';
import api from './api';
import Map from './map';
import Home from './home';
import Cyclist from './cyclist';
import Race from './race';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Divider } from 'semantic-ui-react';


class RightUI extends React.Component {
    constructor(props) {
        super(props);
        this.renderRightUI = this.renderRightUI.bind(this);
    }

    renderRightUI() {
        if (this.props.fullScreen) {
            return null;
        }

        return (
            <div>
                <Slide direction="right" in={this.props.rightUI === 'home'} mountOnEnter unmountOnExit>
                    <Home {...this.props}/>
                </Slide>

                <Slide direction="left" in={this.props.rightUI === 'race'} mountOnEnter unmountOnExit>
                    <Race {...this.props}/>
                </Slide>

                <Slide direction="left" in={this.props.rightUI === 'cyclist'} mountOnEnter unmountOnExit>
                    <Cyclist {...this.props}/>
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
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.renderFullScreen = this.renderFullScreen.bind(this);
        this.renderAbout = this.renderAbout.bind(this);
        this.renderPopup = this.renderPopup.bind(this);
        this.state = {
            loading: true,
            classiques: [],
            cyclists: [],
            rightUI: 'home',
            focusOn: 'Philippe Gilbert',
            fullScreen: false,
            about: false
        };
    }

    handlerRightUI(themeUI, name) {
        this.setState({
            rightUI: themeUI,
            focusOn: name
        })
    }

    toggleFullScreen() {
        if (this.state.fullScreen === false) {
            this.setState({fullScreen: true});
        }
        else {
            this.setState({fullScreen: false});
        }
    }

    componentDidMount() {
        api.getClassiquesAndCyclists()
            .then(response => {
                this.setState({
                    classiques: response.data.classiques,
                    cyclists: response.data.cyclists,
                    loading: false
                 });
            })
    }

    renderFullScreen() {
        return (
            <div>
                <Slide direction="left" in={this.state.rightUI === 'cyclist' || this.state.rightUI === 'race'} mountOnEnter unmountOnExit>
                    <div className='full-screen-container border border-dark rounded-circle'>
                        <a href="#" onClick={() => this.toggleFullScreen()}><span className="icon fontawesome-fullscreen"></span></a>
                    </div>
                </Slide>
            </div>
        )
    }

    renderPopup() {
        if (!this.state.about) {
            return null;
        }

        return (
            <div>
                <div className="about-background"></div>
                <div className="about-popup-container">
                    <Grow in={this.state.about} mountOnEnter unmountOnExit>
                        <div className="about-popup-content border border-dark rounded">
                            <button type="button" class="close" aria-label="Close" onClick={() => this.setState(prevState => ({about: !prevState.about}))}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <p>Gilbert Odyssey is an interactive visualisation of the 5 Monuments of cycling.<br/><br/>
                                Named after Philippe Gilbert, whose dedication for winning all Monuments is outstanding.<br/>
                                One last Monument win with Milan-Sanremo would make him join the elite club of Rik Van Looy, 
                                Eddy Merckx and Roger de Vlaeminck.<br/><br/>
                                Made by <a href="http://florianmainguy.github.io">Florian Mainguy</a>
                            </p>
                        </div>
                    </Grow>
                </div>
            </div>
        )
    }

    renderAbout() {
        return (
            <div>
                <div className="about-container">
                    <a href="#" onClick={() => this.setState(prevState => ({about: !prevState.about}))}><span className="icon fontawesome-question-sign"></span> About</a>
                </div>
                <this.renderPopup/>
            </div>
        )
    }

    render() {
        let props = {
            handlerRightUI: this.handlerRightUI,
            classiques: this.state.classiques,
            cyclists: this.state.cyclists,
            rightUI: this.state.rightUI,
            focusOn: this.state.focusOn,
            fullScreen: this.state.fullScreen
        }

        if (this.state.loading === true) {
            return (
                <div className="home-loading">
                    <BeatLoader
                        css={css`margin: auto;`}
                        size={10}
                        color={"#e3d21c"}
                        loading={this.state.loading}
                    />
                </div>
            )
        }
        else {
            return (
                <div>
                    <Map {...props}/>
                    <RightUI {...props}/>
                    <this.renderFullScreen/>
                    <this.renderAbout/>
                </div>
            )
        }
    }
}

ReactDOM.render(<Application />, document.getElementById('app'));