import {WalletModalProvider, WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {useEffect, useState} from "react";
import axios from "axios";
import {useWallet} from "@solana/wallet-adapter-react";
import {useNavigate} from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function WalletKiddy(){
    const nav = useNavigate()
    const [buttonHover, setButtonHover] = useState(false)
    const {publicKey, signMessage} = useWallet()
    const [noWalletError, setNoWalletError] = useState(false)
    const [signedIn, setSignedIn] = useState(false)

  function handleNav(){
        nav('/userDash')
  }

    async function handleCodeRequest(){
        if( !publicKey){
            setNoWalletError(true)
            return
        }
        setNoWalletError(false)
        try {
            const response = await axios.post('https://be-th.vercel.app/sendNonce', {publicKey: publicKey.toBase58()})
            const nonce = response.data
            const nonceVal = nonce.nonce
            const encodedMessage = new TextEncoder().encode(nonceVal)
             //@ts-ignore
                const signature = await signMessage(encodedMessage)
            const messageVerification  = await axios.post('https://be-th.vercel.app/verifyNonce', {publicKey: publicKey.toBase58(), signature:  Array.from(signature), nonce: nonceVal})
            console.log("2nd api call response: ", messageVerification.data)

            const result  = await messageVerification.data

            if (result.success === true){
                console.log('signed you in')
                setSignedIn(true)
                handleNav()
            } else {
                console.log('cannot sign you in')
                setSignedIn(false)
            }

        } catch(error){
            //@ts-ignore
            console.error("Encountered the following error", error.response)
        }

    }

    useEffect(() => {
        if(publicKey){
            setNoWalletError(false)

        }
    }, [publicKey]);

    return  <WalletModalProvider>
        <div>
            <div className='flex max-w-[600px] w-[600px] min-w-[600px] flex-col justify-center gap-4  mt-[10%] backdrop-blur-md bg-white/20 shadow-md ring-1 ring-gray-600/30 px-20 py-20 w-fit mx-auto rounded-xl z-20 relative bg-opacity-10'>
            <div>
            <div className='mx-auto w-fit'>
            <WalletMultiButton className='mr-10 mx-auto'/>
            </div>
                {noWalletError && <div className='text-red-500 text-center mt-2'>You need to connect your wallet before signing in!</div>}
            </div>
                <button onMouseOver={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)} onClick={handleCodeRequest} className=' px-[3px] py-[3px] rounded-full hover:bg-gradient-to-r hover:from-purple-400 hover:via-indigo-600 hover:to-blue-500 bg-black duration-200 w-fit text-white font-semibold hover:cursor-pointer mx-auto'>
                <div className={` bg-black duration-200 hover:bg-white hover:text-black py-2 px-2 w-[150px] rounded-full hover:shadow-lg flex justify-center`}>
                    <span className={`${buttonHover ? 'ml-0': 'ml-6'} duration-200`}>Sign-in</span>
                    <FaLongArrowAltRight className={`${buttonHover ? 'opacity-100 translate-x-2': 'opacity-0'} duration-200 text-xl ml-1 mt-[3px]`}/>
                </div>
            </button>
            </div>


            {signedIn && <div className='text-green-500'>signed-in successfully</div>}
        </div>
    </WalletModalProvider>
}