import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

export default function App() {
    // Configure wallets
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <div>
                    <h1>Welcome to My dApp</h1>
                    <ConnectWalletButton />
                </div>
            </WalletModalProvider>
        </WalletProvider>
    );
}