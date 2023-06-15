import { Fragment } from "react";
import { MongoClient } from "mongodb";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meatups</title>
        <meta
          name="description"
          content="Browse a huge of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps(context){
//   const req=context.req
//   const res=context.res

//   return {
//     props:{
//       meetups:DUMMY_MEETUPS
//     }
//   }
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://Shashi_Shekhar_Singh:Shashi0708@myproject.mb3u3za.mongodb.net/Next-DB?authSource=admin&replicaSet=atlas-lhj98j-shard-0&readPreference=primary&ssl=true"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
