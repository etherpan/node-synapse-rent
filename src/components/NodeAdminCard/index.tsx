// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import "src/components/NodeAdminCard/nodecard.scss";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { messages } from "src/constants/messages";
import AdminModal from "src/views/Zap/AdminModal";
import UnApproveModal from "src/views/Zap/UnApproveModal";
import { useAccount, useNetwork } from "wagmi";

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

  const handleRentModalOpen = () => setRentModalOpen(true);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  // Unapprove Modal statues
  const handleUnRentModalOpen = () => setUnRentModalOpen(true);
  const [unrentModalOpen, setUnRentModalOpen] = useState(false);

  function setCustomNode(value: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="ucow-card">
        <AdminModal
          handleClose={() => setRentModalOpen(false)}
          modalOpen={rentModalOpen}
          setCustomNode={setCustomNode}
          currentNode={node_no}
          NodePrice={node_price}
        />
        <UnApproveModal
          handleClose={() => setUnRentModalOpen(false)}
          modalOpen={unrentModalOpen}
          setCustomNode={setCustomNode}
          currentNode={node_no}
          NodePrice={node_price}
        />
        <div className="card-image">
          {/* {nftImg ? ( */}
          <>
            <div className="div" style={{ display: "" }}>
              <Typography className="cpu-color">CPU: {node_cpu}</Typography>
              <Typography className="gradientText">GPU: {node_gpu}</Typography>
              <Box className="cpu-capacity">
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Typography className="processor">GPU capacity</Typography>
                  <Typography className="processor">0 GB / {gpu_capacity} GB</Typography>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Typography className="processor">CPU</Typography>
                  <Typography className="processor">0 GB / {cpu_capacity} GB</Typography>
                </Grid>
              </Box>
              <Typography className="price-hour">Price: ${node_price} per Hour</Typography>
            </div>
            <div className="node-button">
              {approve == 1 ? (
                <>
                  <Button
                    className="approve-state"
                    // onClick={() => validConnectWallet()}
                    variant="text"
                    style={{ color: "#fff", background: "#00b12b" }}
                  >
                    {`Approved`}
                  </Button>
                  <Button
                    className="approve-state"
                    onClick={() => handleUnRentModalOpen()}
                    variant="contained"
                    style={{ color: "#fff", borderRadius: "16px"}}
                  >
                    {`Unapprove Node`}
                  </Button>
                </>

              ) : (
                <>
                  <Button
                    className="approve-state"
                    size="small"
                    // onClick={() => validConnectWallet()}
                    variant="text"
                    style={{ color: "#fff", background: "#c43b3b" }}
                  >
                    {`Un approved`}
                  </Button>
                  <Button
                    className="approve-button"
                    onClick={() => handleRentModalOpen()}
                    variant="contained"
                    style={{ color: "#fff", borderRadius: "16px" }}
                  >
                    {`Approve Node`}
                  </Button>
                </>
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
}

export default NodeCard;
