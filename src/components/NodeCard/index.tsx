// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import "src/components/NodeCard/nodecard.scss";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { Box, Button, Typography, useTheme } from "@mui/material";
import LoadingIcon from "src/assets/icons/loading.gif";
import OpenseaIcon from "src/assets/icons/opensea.png";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import { NODE_MANAGER } from "src/constants/addresses";
import { getValidChainId, OPENSEA_ITEM_URL } from "src/constants/data";
import { generateImage } from "src/helpers/NodeInfo/generateImage";
import { useAccount, useNetwork } from "wagmi";

interface IUCowCardProps {
  nftId: string;
  totalStaked: string;
  totalStakers: string;
  owner: string;
  level: string;
  handleOpen: (a: string) => void;
}

function NodeCard({ nftId, totalStaked, totalStakers, owner, level, handleOpen }: IUCowCardProps) {
  const theme = useTheme();
  console.log('debug theme')
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
      <div className="ucow-card">
        {address == owner && (
          <div className="owner-badge">
            <a
              href={`${OPENSEA_ITEM_URL}${NODE_MANAGER[getValidChainId(chain.id) as keyof typeof NODE_MANAGER]}/${nftId}`}
              target="_blank"
            >
              <img width="55" src={OwnerBadge} />
            </a>
          </div>
        )}
        {/* <div className="opensea-badge">
          <a
            href={`${OPENSEA_ITEM_URL}${NODE_MANAGER[getValidChainId(chain.id) as keyof typeof NODE_MANAGER]}/${nftId}`}
            target="_blank"
          >
            <img width="55" src={OpenseaIcon} />
          </a>
        </div> */}
        <div className="card-image" onClick={() => handleOpen(nftId)}>
          {nftImg ? (
            <>
              {/* <img
                src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(nftImg)))}`}
                className="nft-image"
              /> */}
              <div className="div">
                <Typography className="processor">Core™ i5-10600K Intel</Typography>
                <Typography className="processor">EPYC 7642 48-Core Processor AMD</Typography>
                <div>
                  <Typography className="processor">GPU</Typography>
                  <Typography className="processor">0 GB / 40 GB</Typography>
                </div>
                <div className="">
                  <Typography className="processor">CPU</Typography>
                  <Typography className="processor">0 GB / 40 GB</Typography>
                  
                </div>
                {/* <Typography className="processor">
                    <CloudDownloadOutlinedIcon fontSize="small" /> 118 GB
                  </Typography> */}
                <Box>
                  <CloudDownloadOutlinedIcon fontSize="small" /> 110 Mbps<span> / </span>
                  <CloudUploadOutlinedIcon fontSize="small" /> 110 Mbps
                </Box>
              </div>
              <div className="node-card">
                <div className="node-circular">
                  <div className="centered-text">0%</div><br></br>
                  <div style={{ fontSize: "10px" }}>used</div>
                </div>
                <div className="div">
                  $1.50 per Hour
                </div>
                <Button className="div" variant="contained" style={{ color: "#fff", borderRadius: "20px", fontSize: "15px" }}>
                  Rent Now
                </Button>
              </div>
            </>
          ) : (
            <img src={LoadingIcon} width={200} height={200} style={{ marginTop: "100px", marginBottom: "80px" }} />
          )}
        </div>
      </div>
    </>
  );
}

export default NodeCard;
