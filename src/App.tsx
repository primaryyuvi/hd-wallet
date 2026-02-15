import "./App.css";

import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { OnboardingChoice } from "./components/CreatingChoice";
import { SignUp } from "./components/SignUp";
import { Unlock } from "./components/Unlock";
import { Home } from "./components/HomePage";
import { Recovery } from "./components/RecoveryPage";
import { SendTransaction } from "./components/SendTransaction";
import { SwapReview } from "./components/SwapReview";
import { Settings } from "./components/Settings";
import { ImportPrivateKey } from "./components/ImportPrivateKey";
import { ImportSeedPhrase } from "./components/ImportSeedPhrase";
import { ViewPrivateKey } from "./components/ViewPrivateKey";
import { ReceiveToken } from "./components/ReceiveToken";

const AppContent: React.FC = () => {
  const { currentScreen } = useAuth();

  const renderScreen = () => {
    switch (currentScreen) {
      case "onboarding-choice":
        return <OnboardingChoice />;
      case "import-seed":
        return <ImportSeedPhrase />;
      case "signup":
        return <SignUp mode="create" />;
      case "signup-import":
        return <SignUp mode="import" />;
      case "unlock":
        return <Unlock />;
      case "home":
        return <Home />;
      case "recovery":
        return <Recovery />;
      case "send":
        return <SendTransaction />;
      case "swap-review":
        return <SwapReview />;
      case "settings":
        return <Settings />;
      case "import-private-key":
        return <ImportPrivateKey />;
      case "view-private-key":
        return <ViewPrivateKey />;
      case "receive-token":
        return <ReceiveToken />;
      default:
        return <OnboardingChoice />;
    }
  };

  return <div className="app-container">{renderScreen()}</div>;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
