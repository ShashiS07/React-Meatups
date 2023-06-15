import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetails from "../../components/meetups/MeetupDetails";
import { Fragment } from "react";

function MeetupDetailsPage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meatups</title>
        <meta
          name="description"
          content="Browse a huge of highly active React meetups"
        />
      </Head>
      <MeetupDetails
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://Shashi_Shekhar_Singh:Shashi0708@myproject.mb3u3za.mongodb.net/Next-DB?authSource=admin&replicaSet=atlas-lhj98j-shard-0&readPreference=primary&ssl=true"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://Shashi_Shekhar_Singh:Shashi0708@myproject.mb3u3za.mongodb.net/Next-DB?authSource=admin&replicaSet=atlas-lhj98j-shard-0&readPreference=primary&ssl=true"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}
export default MeetupDetailsPage;
