// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { messages } from "src/constants/messages";
import ListModal from "src/views/Zap/ListModal";
import UnListModal from "src/views/Zap/UnListModal";
import RentModal from "src/views/Zap/RentModal";
import UnRentModal from "src/views/Zap/UnRentModal";
import { useAccount, useNetwork } from "wagmi";
import { AiOutlineCloudDownload, AiOutlineCloudUpload } from "react-icons/ai";
import "./admincard.scss";

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
  status: number;
  ssh_hostname: string;
  ssh_key: string;
}

function NodeCard({
  node_no,
  node_cpu,
  seller_address,
  node_gpu,
  gpu_capacity,
  cpu_capacity,
  node_download,
  node_upload,
  node_usage,
  node_price,
  approve,
  status,
  ssh_hostname,
  node_ip,
  ssh_key
}: INodeCardProps) {
  const theme = useTheme();
  const { address = "", isConnected, isReconnecting } = useAccount();
  const { chain = { id: 8453 } } = useNetwork();
  // approve List modal
  const ListModalOpen = () => setListModalOpen(true);
  const [listModalOpen, setListModalOpen] = useState(false);
  // unapprove List modal
  const UnListModalOpen = () => setUnListModalOpen(true);
  const [unlistModalOpen, setUnListModalOpen] = useState(false);
  // approve rent modal
  const RentModalOpen = () => setRentModalOpen(true);
  const [rentModalOpen, setRentModalOpen] = useState(false);

  // unapprove rent modal
  const UnrentModalOpen = () => setUnrentModalOpen(true);
  const [unrentModalOpen, setUnrentModalOpen] = useState(false);

  // function setCustomNode(value: SetStateAction<string>): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <>
      <div className="admin-gallery-card">
        <ListModal
          handleClose={() => setListModalOpen(false)}
          modalOpen={listModalOpen}
          currentNode={node_no}
          NodePrice={node_price}
        />
        <UnListModal
          handleClose={() => setUnListModalOpen(false)}
          modalOpen={unlistModalOpen}
          currentNode={node_no}
          NodePrice={node_price}
        />
        <RentModal
          handleClose={() => setRentModalOpen(false)}
          modalOpen={rentModalOpen}
          currentNode={node_no}
          NodePrice={node_price}
        />
        <UnRentModal
          handleClose={() => setUnrentModalOpen(false)}
          modalOpen={unrentModalOpen}
          currentNode={node_no}
          NodePrice={node_price}
        />
        <div className="card-image">
          <>
            <div className="div" style={{ display: "flex", flexDirection: "column" }}>
              <Typography className="cpu-color field" style={{ marginBottom: "10px" }}>Node No: {node_no}</Typography>
              <Typography className="cpu-color field" style={{ marginBottom: "10px" }}>CPU: {node_cpu}</Typography>
              <Typography className="gradientText field" style={{ marginBottom: "10px" }}>GPU: {node_gpu}</Typography>
              <Box className="cpu-capacity" style={{ display: "flex", marginBottom: "10px" }}>
                <Grid item lg={6} md={6} sm={6} xs={12} style={{ marginRight: "10px" }}>
                  <Typography className="field" style={{ marginBottom: "5px" }}>GPU</Typography>
                  <Typography className="field" style={{ marginBottom: "5px" }}>0 GB / {gpu_capacity} GB</Typography>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Typography className="field" style={{ marginBottom: "5px" }}>CPU</Typography>
                  <Typography className="field" style={{ marginBottom: "5px" }}>0 GB / {cpu_capacity} GB</Typography>
                </Grid>
              </Box>
              <Box fontStyle={{ display: "flex" }}>
                <AiOutlineCloudUpload fontSize={'20px'} />
                <Typography className="node-speed" style={{ fontSize: "16px", padding: "0 5px 0 5px" }}> {node_download} Mbps / </Typography>
                <AiOutlineCloudDownload fontSize={'20px'} />
                <Typography className="field-justify" style={{ fontSize: "16px", padding: "0 5px 0 5px" }}>{node_upload} Mbps</Typography>
              </Box>
              <Typography className="field-justify" style={{ marginBottom: "10px" }}>Price: ${node_price} per Hour</Typography>
              <Typography className="field-justify">
                <div className="div">Host Name: </div>
                <div className="div">{ssh_hostname}</div>
              </Typography>
              <Typography className="field-justify">
                <div className="div">Node IP: </div>
                <div className="div">{node_ip}</div>
              </Typography>
              <Typography className="field-justify">
                <div className="div">SSH Key: </div>
                <div className="div">{ssh_key}</div>
              </Typography>
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
                    {`Listed`}
                  </Button>
                  <Button
                    className="approve-state"
                    onClick={() => UnListModalOpen()}
                    variant="contained"
                    style={{ color: "#fff", borderRadius: "16px" }}
                  >
                    {`Unapprove list`}
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
                    {`Un listed`}
                  </Button>
                  <Button
                    className="approve-button"
                    onClick={() => ListModalOpen()}
                    variant="contained"
                    style={{ color: "#fff", borderRadius: "16px" }}
                  >
                    {`Approve List`}
                  </Button>
                </>
              )}
            </div>
            {approve == 1 &&
              <>
                {status == 2 &&
                  <Button className="approve-state" style={{ color: "#fff", background: "#00b12b" }} >
                    {`Buy requesting`}
                  </Button>
                }
                {status == 3 &&
                  <Button className="approve-state" style={{ color: "#fff", background: "#00b12b" }} >
                    {`Renting`}
                  </Button>
                }
                <>
                  {status == 2 ?
                    <Button
                      className="approve-button"
                      onClick={() => RentModalOpen()}
                      variant="contained"
                      style={{ color: "#fff", borderRadius: "16px", float: "right" }}
                    >
                      {`Approve Rent`}
                    </Button>
                    : (status == 3 &&
                      <Button
                        className="approve-button"
                        onClick={() => UnrentModalOpen()}
                        variant="contained"
                        style={{ color: "#fff", borderRadius: "16px", float: "right" }}
                      >
                        {`Unapprove Rent`}
                      </Button>
                    )
                  }
                </>
              </>
            }
          </>
        </div>
      </div>
    </>
  );
}

export default NodeCard;
