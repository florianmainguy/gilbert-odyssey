import React from 'react';
import ReactCountryFlag from "react-country-flag"
import profilePic from './cyclists/default.png';

class CyclistHistory extends React.Component {
    constructor(props) {
        super(props);
        this.handleRace = this.handleRace.bind(this);
        this.renderTable = this.renderTable.bind(this);
    }

    handleRace(raceName) {
        this.props.props.handlerRightUI('race', raceName);
    }

    renderTable() {
        if (!this.props.history) {
            return null;
        }

        return (this.props.history.map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td>{listValue.year}</td>
                    <td><a href="#" onClick={() => this.handleRace(listValue.race)} className="stretched-link">{listValue.race}</a></td>
                </tr>
            );
        }));
    }

    render() {
        return (
            <div className="cyclist-wins border border-dark table-responsive">
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
        this.renderFlag = this.renderFlag.bind(this);
        this.state = {
            flag: ''
        }
    }

    renderFlag() {
        // Keep in state cyclist data for unmounting/sliding transition
        let cyclist = this.props.cyclists.find(x => x.cyclist === this.props.focusOn);
        console.log(cyclist);
        if (cyclist) {
            this.state.flag = cyclist.flag;
        }

        return (
            <div className="cyclist-profile border border-dark">
                <div className="cyclist-picture">
                    <img alt="Default picture" src={profilePic} />
                </div>
                <ReactCountryFlag countryCode={this.state.flag}/>
                <form className="cyclist-search">
                    <input type="search" placeholder="Search Cyclist"/>
                </form>
            </div>
        )
    }

    render() {
        return <this.renderFlag/>
    }
}
    
class CyclistHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="cyclist-head border border-dark">
                <h3>{this.props.focusOn}</h3>
            </div>
        )
    }
}

class Cyclist extends React.Component {
    constructor(props) {
        super(props);
        this.renderHistory = this.renderHistory.bind(this);
    }

    renderHistory() {
        let params = {
            props: this.props,
            history: null 
        }

        let cyclist = this.props.cyclists.find(x => x.cyclist === this.props.focusOn);
        if (cyclist) {
            params.history = cyclist.palmares;
        }

        return <CyclistHistory {...params}/>
    }

    render() {
        let props = this.props;

        return (
            <div className="cyclist-grid">
                <CyclistHead {...props}/>
                <CyclistProfile  {...props}/>
                <CyclistSummary />
                <this.renderHistory/>
            </div>
        )
    }
}

export default Cyclist;
