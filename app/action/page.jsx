import Action from "../components/Action"

export async function generateMetadata({ params }) {


  return {
    openGraph: {
      title: "Actions",
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
    <Action /></>
  )
}
