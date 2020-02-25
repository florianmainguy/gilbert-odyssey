import React from 'react';
import profilePic from './cyclists/default.png';

class CyclistHistory extends React.Component {
    constructor(props) {
        super(props);
        this.renderTable = this.renderTable.bind(this);
    }

    renderTable() {
        if (!this.props.palmares) {
            return null;
        }

        return (this.props.palmares.map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td>{listValue.year}</td>
                    <td><a href="#" className="stretched-link">{listValue.race}</a></td>
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
                    <li className="flex-wins"><a className="stage-wins" href="#40"><p><span className="icon fontawesome-comment-alt scnd-font-color"></span>5</p></a></li>
                    <li className="flex-wins"><a className="classique-wins" href="#41"><p><span className="icon fontawesome-eye-open scnd-font-color"></span>1</p></a></li>
                    <li className="flex-wins"><a className="total-wins" href="#42"><p><span className="icon fontawesome-heart-empty scnd-font-color"></span>23</p></a></li>
                </ul>
            </div>
        )
    }
}

class CyclistProfile extends React.Component {
    render() {
        return (
            <div className="cyclist-profile border border-dark">
                <div className="cyclist-picture">
                    <img alt="Default picture" src={profilePic} />
                </div>
                <h4 className="cyclist-name">John Wick</h4>
                <form className="cyclist-search">
                    <input type="search" placeholder="Search Cyclist"/>
                </form>
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
        let cyclist = this.props.cyclists.find(x => x.cyclist === this.props.focusOn);

        if (!cyclist) {
            return <CyclistHistory history = {null}/>
        }
        console.log(cyclist.palmares);
        return <CyclistHistory palmares = {cyclist.palmares}/>
    }

    render() {
        return (
            <div className="cyclist-container">
                <CyclistProfile />
                <CyclistSummary />
                <this.renderHistory/>
            </div>
        )
    }
}

export default Cyclist;
