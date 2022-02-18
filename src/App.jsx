import React from 'react';

import AuthContextContainer from 'context/AuthContext';
import ProjectContextContainer from 'context/ProjectContext';
import OpportunityContextContainer from 'context/OpportunityContext';
import ForecastContextContainer from 'context/ForecastContext';
import RealmApp from 'RealmApp';

import 'App.css';

export default function App() {
    return (
        <div className="App">
            <AuthContextContainer>
                <ProjectContextContainer>
                    <OpportunityContextContainer>
                        <ForecastContextContainer>
                            <RealmApp />
                        </ForecastContextContainer>
                    </OpportunityContextContainer>
                </ProjectContextContainer>
            </AuthContextContainer>
        </div>
    );
}
