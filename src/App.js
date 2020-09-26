import React, {Component} from 'react';

import RealmContextContainer from "./context/RealmContext";
import RealmApp from "./RealmApp";

import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <RealmContextContainer>
                    <RealmApp />
                </RealmContextContainer>
            </div>
        );
    }
}

export default App;
