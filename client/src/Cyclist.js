import React from 'react';
import ReactCountryFlag from "react-country-flag"
import profilePic from './cyclists/default.png';
import SearchCyclist from './search'

class CyclistHistory extends React.Component {
    constructor(props) {
        super(props);
        this.handleRace = this.handleRace.bind(this);
        this.renderTable = this.renderTable.bind(this);
    }

    handleRace(raceName) {
        this.props.handlerRightUI('race', raceName);
    }

    renderTable() {
        return (this.props.cyclist.palmares.map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td>{listValue.year}</td>
                    <td><a href="#" onClick={() => this.handleRace(listValue.race)} className="stretched-link">{listValue.race}</a></td>
                </tr>
            );
        }));
    }

    render() {
        if (!this.props.cyclist) {
            return null;
        }

        return (
            <div className="cyclist-wins">
                <h6>Monuments Palmares</h6>
                <div className="border border-dark table-responsive">
                    <table className="table table-dark table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="column">Year</th>
                                <th scope="column">Race</th>
                            </tr>
                        </thead>
                        <tbody>
                            <this.renderTable/>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

class CyclistSummary extends React.Component {
    render() {
        return (
            <div className="cyclist-summary border border-dark">
                <ul className="key-wins">
                    <li className="flex-wins"><a className="race-1" href="#"><p><span className="icon fontawesome-comment-alt scnd-font-color"></span>5</p></a></li>
                    <li className="flex-wins"><a className="race-2" href="#"><p><span className="icon fontawesome-comment-alt scnd-font-color"></span>5</p></a></li>
                    <li className="flex-wins"><a className="race-3" href="#"><p><span className="icon fontawesome-comment-alt scnd-font-color"></span>5</p></a></li>
                    <li className="flex-wins"><a className="race-4" href="#"><p><span className="icon fontawesome-eye-open scnd-font-color"></span>1</p></a></li>
                    <li className="flex-wins"><a className="race-5" href="#"><p><span className="icon fontawesome-heart-empty scnd-font-color"></span>23</p></a></li>
                </ul>
            </div>
        )
    }
}

class CyclistProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    //TODO add profilepic in DB and implement logic
    render() {
        if (!this.props.cyclist) {
            return null;
        }

        return (
            <div className="cyclist-profile border border-dark">
                <div className="cyclist-picture">
                    <img alt="Default picture" src={profilePic} />
                </div>
                <ReactCountryFlag countryCode={this.props.cyclist.flag}/>
                <div className="cyclist-search">
                    <SearchCyclist {...this.props}/>
                </div>
            </div>
        )
    }
}
    
class CyclistHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="cyclist-head border border-dark">
                <h3>{this.props.name}</h3>
            </div>
        )
    }
}

class Cyclist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cyclist: null
        };
    }

    componentDidMount() {
        this.setState({cyclist: this.props.cyclists.find(x => x.cyclist === this.props.focusOn)});
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.focusOn !== prevProps.focusOn) {
            this.setState({cyclist: this.props.cyclists.find(x => x.cyclist === this.props.focusOn)});
        }
    }

    //TODO implement cyclistSummary
    render() {
        return (
            <div className="main-grid cyclist-grid">
                <CyclistHead name={this.props.focusOn}/>
                <CyclistProfile  {...this.props} cyclist={this.state.cyclist}/>
                <CyclistSummary/>
                <CyclistHistory {...this.props} cyclist={this.state.cyclist}/>
            </div>
        )
    }
}

export default Cyclist;
