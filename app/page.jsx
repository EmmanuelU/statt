import Statt from "./components/Statt"

export async function generateMetadata({ params }) {


  return {
    openGraph: {
      title: "Statt Dashboard",
      description: "Monitoring, testing.",
      url: "Url",
      siteName: "vibrations",
      images: [
        {
          url: "Url",
          width: 1000,
          height: 1000,
          alt: "Desc",
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}


export default function Page() {

  return(
    <>
    <Statt /></>
  )
}
