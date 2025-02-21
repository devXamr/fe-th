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
            const response = await axios.post('http://localhost:3000/sendNonce', {publicKey: publicKey.toBase58()})
            const nonce = response.data





            const nonceVal = nonce.nonce

            const encodedMessage = new TextEncoder().encode(nonceVal)

                const signature = await signMessage(encodedMessage)



            const messageVerification  = await axios.post('http://localhost:3000/verifyNonce', {publicKey: publicKey.toBase58(), signature:  Array.from(signature), nonce: nonceVal})

            const result  = await messageVerification.data

            if (result.success === true){
                setSignedIn(true)
                handleNav()
            } else {
                setSignedIn(false)
            }

        } catch(e){
            console.error("Encountered the following error", e.response)
        }

    }




    useEffect(() => {
        if(publicKey){
            setNoWalletError(false)

        }
    }, [publicKey]);
    return  <WalletModalProvider>


        <div>

            <div className='flex flex-col justify-center gap-4  mt-[10%] backdrop-blur-md bg-white/20 shadow-md ring-1 ring-gray-600/30 px-20 py-20 w-fit mx-auto rounded-xl z-20 relative bg-opacity-10'>
            <WalletMultiButton className='mr-10'/>

            <button onMouseOver={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)} onClick={handleCodeRequest} className=' px-[3px] py-[3px] rounded-full hover:bg-gradient-to-r hover:from-purple-400 hover:via-indigo-600 hover:to-blue-500 bg-black duration-200 w-fit text-white font-semibold hover:cursor-pointer'>
                <div className={` bg-black duration-200 hover:bg-white hover:text-black py-2 px-2 w-[150px] rounded-full hover:shadow-lg flex justify-center`}>
                    <span className={`text-lg ${buttonHover ? 'ml-0': 'ml-6'} duration-200`}>Sign-in</span>
                    <FaLongArrowAltRight className={`${buttonHover ? 'opacity-100 translate-x-2': 'opacity-0'} duration-200 text-xl ml-1 mt-[5px]`}/>
                </div>
            </button>
            </div>
            {noWalletError && <div className='text-red-500'>You need to connect your wallet before signing in!</div>}

            {signedIn && <div className='text-green-500'>signed-in successfully</div>}




        </div>







    </WalletModalProvider>
}