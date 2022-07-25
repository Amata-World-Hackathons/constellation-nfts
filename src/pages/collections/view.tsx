import { useContract, useContractCall } from "@src/context/Contract";
import { useRouter } from "next/router";
import CONSTELLATION_NFT_ABI from "@src/contracts/ConstellationNFT_ABI.json";

const CollectionsViewPage: React.FC<{}> = () => {
  const router = useRouter();
  const { addr } = router.query as Record<string, string>;

  const contract = useContract(addr, CONSTELLATION_NFT_ABI);
  const nameResult = useContractCall(contract, "name");
  const totalSupplyResult = useContractCall(contract, "totalSupply");

  console.log("CONTRACT", contract);

  console.log("nameResult", nameResult);

  return (
    <div>
      <h1>
        Collection {nameResult.data || ""} / {totalSupplyResult.data || 0}
      </h1>
      <p>Lovely description of the amazing collection</p>

      <h3>Owners</h3>
      <p>Some wallet</p>
      <h3>Collaborators (15% shared)</h3>
      <p>Collection 1?? (5% ownership)</p>
      <p>Collection 2?? (5% ownership)</p>
      <p>Collection 3?? (5% ownership)</p>
    </div>
  );
};

export default CollectionsViewPage;
