/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import GlitchTerminal from './components/GlitchTerminal';
import GlitchLogin from './components/GlitchLogin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [operatorId, setOperatorId] = useState('');

  const handleLoginSuccess = (operatorName: string) => {
    setIsAuthenticated(true);
    setOperatorId(operatorName);
  };

  return (
    <div className="w-full min-h-screen bg-[#09090e]">
      {!isAuthenticated ? (
        <GlitchLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <GlitchTerminal />
      )}
    </div>
  );
}
