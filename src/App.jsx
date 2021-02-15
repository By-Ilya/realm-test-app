import React from 'react';

import AuthContextContainer from 'context/AuthContext';
import ProjectContextContainer from 'context/ProjectContext';
import RealmApp from 'RealmApp';

import 'App.css';

export default function App() {
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
