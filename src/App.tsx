import { useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import WalletKiddy from "./components/WalletKiddy.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserDash from "./components/UserDash.tsx";

function App() {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <WalletProvider wallets={wallets} autoConnect={true}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element=<WalletKiddy /> />
          <Route path="/userDash" element=<UserDash /> />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
