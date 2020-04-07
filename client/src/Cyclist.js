import React from 'react';
import SearchCyclist from './search'
import defaultPic from './cyclists/default.jpg'
import flag from './flag.js';

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
            let raceClicked = null;
            if (listValue.race === this.props.clickedOn) {
                raceClicked = listValue.race.toLowerCase().replace(/\s+/g, '-');
            }

            return (
                <tr key={index}>
                    <td>{listValue.year}</td>
                    <td><a href="#" onClick={() => 
                        this.handleRace(listValue.race)} className={raceClicked}>{listValue.race}
                    </a></td>
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
    constructor(props) {
        super(props);
        this.renderSummary = this.renderSummary.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.races = ['Milano-Sanremo', 'Ronde van Vlaanderen', 'Paris-Roubaix', 'Liège-Bastogne-Liège', 'Giro di Lombardia'];
    }

    handleKey(race) {
        this.props.handlerKeyClick(race);
    }

    renderSummary() {
        return (
            this.races.map((race, index) => {
                let count = this.props.cyclist.palmares.reduce((acc, cur) => cur.race === race ? ++acc : acc, 0);
                return (
                    <li className="flex-wins">
                        <a onClick={() => this.handleKey(race)} className={"race-" + index} href="#">
                            <p><span className={"icon fontawesome-trophy"}></span>{count}</p>
                        </a>
                    </li>
                )
            })
        )
    }

    render() {
        if (!this.props.cyclist) {
            return null;
        }

        return (
            <div className="cyclist-summary border border-dark">
                <ul className="key-wins">
                    <this.renderSummary/>
                </ul>
            </div>
        )
    }
}

class CyclistProfile extends React.Component {
    constructor(props) {
        super(props);
        this.renderProfilePic = this.renderProfilePic.bind(this); 
    }

    renderProfilePic() {
        try {
            return (require('./cyclists/' + this.props.cyclist.cyclist.toLowerCase().replace(/\s+/g, '-') + '.jpg'));
        }
        catch (e) {
            console.log(e);
            return defaultPic;
        }
    }

    render() {
        if (!this.props.cyclist) {
            return null;
        }
        
        return (
            <div className="cyclist-profile border border-dark">
                <div className="cyclist-picture">
                    <img alt="Default picture" src={this.renderProfilePic()} />
                </div>
                <div>
                    {flag(this.props.cyclist.flag)}
                </div>
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
        this.handlerKeyClick = this.handlerKeyClick.bind(this);
        this.state = {
            cyclist: null,
            clickedOn: null
        };
    }

    handlerKeyClick(raceName) {
        if (this.state.clickedOn === raceName) {
            this.setState({ clickedOn: null});
        }
        else {
            this.setState({ clickedOn: raceName});
        }
    }

    componentDidMount() {
        this.setState({cyclist: this.props.cyclists.find(x => x.cyclist === this.props.focusOn)});
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.focusOn !== prevProps.focusOn) {
            this.setState({cyclist: this.props.cyclists.find(x => x.cyclist === this.props.focusOn)});
        }
    }

    render() {
        return (
            <div className="main-grid cyclist-grid">
                <CyclistHead name={this.props.focusOn}/>
                <CyclistProfile  {...this.props} cyclist={this.state.cyclist}/>
                <CyclistSummary {...this.props} cyclist={this.state.cyclist} handlerKeyClick={this.handlerKeyClick}/>
                <CyclistHistory {...this.props} cyclist={this.state.cyclist} clickedOn={this.state.clickedOn}/>
            </div>
        )
    }
}

export default Cyclist;
