// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import "src/components/UCowCard/ucowcard.scss";

import { useTheme } from "@mui/material";
import LoadingIcon from "src/assets/icons/loading.gif";
import OpenseaIcon from "src/assets/icons/opensea.png";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import { NODE_MANAGER } from "src/constants/addresses";
import { getValidChainId, OPENSEA_ITEM_URL } from "src/constants/data";
import { generateImage } from "src/helpers/NFTInfo/generateImage";
import { useAccount, useNetwork } from "wagmi";

interface INodeCardProps {
  nftId: string;
  totalStaked: string;
  totalStakers: string;
  owner: string;
  level: string;
  handleOpen: (a: string) => void;
}

function UCowCard({ nftId, totalStaked, totalStakers, owner, level, handleOpen }: INodeCardProps) {
  const theme = useTheme();
  // const [nftImg, setNftImg] = useState("");
  const { address = "", isConnected, isReconnecting } = useAccount();
  const { chain = { id: 8453 } } = useNetwork();

  const nftImg = generateImage({
    tokenId: parseInt(nftId),
    level: parseInt(level),
    lockers: parseInt(totalStakers),
    tvl: parseInt(totalStaked),
    ownerAddress: owner,
  });

  return (
    <>
      <div className="ucow-card" style={{ border: `3px solid ${theme.colors.primary[300]}` }}>
        {address == owner && (
          <div className="owner-badge">
            <a
              href={`${OPENSEA_ITEM_URL}${
                NODE_MANAGER[getValidChainId(chain.id) as keyof typeof NODE_MANAGER]
              }/${nftId}`}
              target="_blank"
            >
              <img width="55" src={OwnerBadge} />
            </a>
          </div>
        )}
        <div className="opensea-badge">
          <a
            href={`${OPENSEA_ITEM_URL}${NODE_MANAGER[getValidChainId(chain.id) as keyof typeof NODE_MANAGER]}/${nftId}`}
            target="_blank"
          >
            <img width="55" src={OpenseaIcon} />
          </a>
        </div>
        <div className="card-image" onClick={() => handleOpen(nftId)}>
          {nftImg ? (
            <>
              <img
                src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(nftImg)))}`}
                className="nft-image"
              />
              <div className="div">card</div>
            </>
          ) : (
            <img src={LoadingIcon} width={200} height={200} style={{ marginTop: "100px", marginBottom: "80px" }} />
          )}
        </div>
      </div>
    </>
  );
}

export default UCowCard;
