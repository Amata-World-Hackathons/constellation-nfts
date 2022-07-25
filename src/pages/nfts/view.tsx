import Link from "next/link";
import { useRouter } from "next/router";

const NftsViewPage: React.FC<{}> = () => {
  const router = useRouter();

  const { tokenId } = router.query as Record<string, string>;

  return (
    <div>
      <h1>Viewing Token {tokenId}</h1>
      <p>
        Belongs to collection{" "}
        <Link
          href={{
            pathname: "/collections/view",
            query: { collectionId: tokenId },
          }}
        >
          <a className="link link-primary">Collection ???</a>
        </Link>
      </p>

      <p>
        Owned by{" "}
        <a href="" className="link link-primary">
          Path to scan
        </a>
      </p>
    </div>
  );
};

export default NftsViewPage;
