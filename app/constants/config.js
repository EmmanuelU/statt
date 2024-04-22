import { Inter } from 'next/font/google'
 
// Font files can be colocated inside of `app`


const background = {
    video: false,
    sound: false,
    desc: ""
};

const metadata = {
    title: "statt",
    description: "",
    url: "https://google.com",
    images: [
        {
            url: "",
            width: 1000,
            height: 1000,
            alt: "",
        },
    ],
    locale: "en_US",
    lang: "en"
}

const font = Inter({ subsets: ['latin'] })


const config = { background, metadata, font }
export default config