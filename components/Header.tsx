import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
    return (
        <div className="flex justify-between items-center p-5">
            <div>logo</div>
            <div><ConnectButton /></div>
        </div>
    )
}