import ConfigEdit from "../components/ConfigEdit"

export async function generateMetadata({ params }) {


  return {
    openGraph: {
      title: "Edit Statt Config",
      description: "test",
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
    <ConfigEdit /></>
  )
}
