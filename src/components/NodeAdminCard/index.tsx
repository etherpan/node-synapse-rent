// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import "src/components/NodeCard/nodecard.scss";

import { Button, Typography, useTheme } from "@mui/material";
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
              <Typography className="processor">CPU: {node_cpu}</Typography>
              <Typography className="processor">GPU: {node_gpu}</Typography>
              <Typography className="processor">GPU capacity: 0 GB / {cpu_capacity} GB</Typography>
              <Typography className="processor">CPU capacity: 0 GB / {gpu_capacity} GB</Typography>
              <Typography className="processor">Price: ${node_price} per Hour</Typography>
            </div>
            <div className="node-card">
              {approve == 1 ? (
                <>
                  <Button
                    className="div"
                    // onClick={() => validConnectWallet()}
                    variant="text"
                    style={{ color: "#fff", fontSize: "15px",  background: "#00b12b"}}
                  >
                    {`Approved`}
                  </Button>
                  <Button
                    className="div"
                    onClick={() => handleUnRentModalOpen()}
                    variant="contained"
                    style={{ color: "#fff", borderRadius: "20px", fontSize: "15px" }}
                  >
                    {`Unapprove Node`}
                  </Button>
                </>

              ) : (
                <Button
                  className="div"
                  onClick={() => handleRentModalOpen()}
                  variant="contained"
                  style={{ color: "#fff", borderRadius: "20px", fontSize: "15px" }}
                >
                  {`Approve Node`}
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
