import { ConnectButton, lightTheme } from 'thirdweb/react'
import { client } from '../utilities/contract';


export default function CustomWalletConnectButton() {

    return (
        <ConnectButton client={client} connectButton={{
            label: "Connect to the wallet",
            style: {
                fontSize: "14px"
            }
        }} />
    );
}