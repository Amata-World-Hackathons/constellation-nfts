import { PLACEHOLDER_IMAGE_URL } from "@src/constants";
import {
  useMarketplace,
  useMarketplaceCollections,
} from "@src/context/Marketplace";
import { useTronWeb } from "@src/context/TronWeb";
import { Preloader } from "@src/ui/progress/Preloader";
import { useActorQuery } from "@src/utils/ActorUtils";
import { formatFractionalICP } from "@src/utils/Formatting";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const collections = useMarketplaceCollections();

  console.log("COLLECTIONS", collections);

  return (
    <div className="w-full max-w-6xl m-auto">
      <Head>
        <title>Constellation NFTs</title>
        <meta name="description" content="Explore a constellation of NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="p-8 mt-16 mb-24 w-full bg-cover">
        <div className="prose dark:prose-invert">
          <h1>Constellation NFTs</h1>
        </div>
      </section>

      <div className="divider"></div>

      <section>
        <div className="prose dark:prose-invert mb-8 w-full max-w-none">
          <h2>Latest NFTs</h2>
          <p>Discover events that will supercharge your weekend</p>
        </div>

        <div className="flex flex-row-reverse mt-8">
          <Link href="/events">
            <a className="btn btn-sm btn-ghost">See all events</a>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
