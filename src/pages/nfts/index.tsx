import Link from "next/link";

import { PLACEHOLDER_IMAGE_URL } from "@src/constants";

const NftsIndexPage: React.FC<{}> = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
        <Link
          key={index}
          href={{
            pathname: "/nfts/view",
            query: { tokenId: index },
          }}
        >
          <a>
            <div className="card w-52 shadow-lg">
              <figure>
                <img src={PLACEHOLDER_IMAGE_URL} alt="" />
              </figure>

              <div className="card-body">
                <h2 className="card-title">Cookie #1923</h2>
                <p>Some stats</p>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default NftsIndexPage;
