import React, {Component} from 'react';

import AuthContextContainer from "context/AuthContext";
import ProjectContextContainer from "context/ProjectContext";
import RealmApp from "RealmApp";

import 'App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <AuthContextContainer>
                    <ProjectContextContainer>
                        <RealmApp />
                    </ProjectContextContainer>
                </AuthContextContainer>
            </div>
        );
    }
}

export default App;
