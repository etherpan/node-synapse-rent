// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import "src/components/NodeCard/nodecard.scss";
import { Button, Grid, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { messages } from "src/constants/messages";
import RentModal from "src/views/Zap/RentModal";
import { useAccount, useNetwork } from "wagmi";
import { Box } from "@mui/system";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { AiOutlineCloudDownload, AiOutlineCloudUpload } from "react-icons/ai";

interface INodeCardProps {
  node_no: number;
  node_cpu: string;
  seller_address: string;
  node_ip: string;
  node_gpu: string;
  gpu_capacity: number;
  cpu_capacity: number;
  node_download?: number;
  node_upload?: number;
  node_usage?: number;
  node_price: number;
  approve: number;
}

function NodeCard({
  node_no,
  node_cpu,
  seller_address,
  node_ip,
  node_gpu,
  gpu_capacity,
  cpu_capacity,
  node_download,
  node_upload,
  node_usage,
  node_price,
  approve,
}: INodeCardProps) {
  const theme = useTheme();
  const { address = "", isConnected, isReconnecting } = useAccount();
  const { chain = { id: 8453 } } = useNetwork();

  const validConnectWallet = () => {
    toast.error(messages.please_connect_wallet);
  };

  const handleRentModalOpen = () => setRentModalOpen(true);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [customNode, setCustomNode] = useState<string>("1.0");

  return (
    <>
      <div className="ucow-card">
        <RentModal
          handleClose={() => setRentModalOpen(false)}
          modalOpen={rentModalOpen}
          setCustomNode={setCustomNode}
          currentNode={node_no}
          sellerAddress={seller_address}
          NodePrice={node_price}
        />
        <div className="card-image">
          <>
            <div className="div">
              <Typography className="cpu-color">{node_cpu}</Typography>
              <Typography className="gradientText">{node_gpu}</Typography>
              <Box className="cpu-capacity">
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Typography className="processor">GPU</Typography>
                  <Typography className="processor">0 GB / {cpu_capacity} GB</Typography>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Typography className="processor">CPU</Typography>
                  <Grid className="processor">0 GB / {gpu_capacity} GB</Grid>
                </Grid>
              </Box>
              <Box fontStyle={{ display: "flex" }}>
                <AiOutlineCloudUpload fontSize={'20px'} />
                <Typography className="node-speed" style={{ fontSize: "16px", padding: "0 5px 0 5px" }}> {node_download} Mbps / </Typography>
                <AiOutlineCloudDownload fontSize={'20px'} />
                <Typography className="Typography" style={{ fontSize: "16px", padding: "0 5px 0 5px" }}>{node_upload} Mbps</Typography>
              </Box>
            </div>
            <Typography className="price-hour">${node_price} per Hour</Typography>
            <div className="node-card">
              {/* <div className="node-circular">
                  <div className="centered-text">0%</div>
                  <div style={{ fontSize: "10px" }}>used</div>
                </div> */}
              {!isConnected ? (
                <Button
                  className="div"
                  onClick={() => validConnectWallet()}
                  variant="contained"
                  style={{ color: "#fff", borderRadius: "20px", fontSize: "15px" }}
                >
                  {`Rent Now`}
                </Button>
              ) : (
                <Button
                  className="div"
                  onClick={() => handleRentModalOpen()}
                  variant="contained"
                  style={{ color: "#fff", borderRadius: "20px", fontSize: "15px" }}
                >
                  {`Rent Now`}
                </Button>
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
}

export default NodeCard;
