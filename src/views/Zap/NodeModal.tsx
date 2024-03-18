import { Box, Dialog, DialogTitle, FormControl, Grid, Link, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, PrimaryButton } from "@olympusdao/component-library";
import { ChangeEvent, FC, FormEvent, SetStateAction, useState } from "react";
import React from "react";
import { toast } from "react-hot-toast";
import { messages } from "src/constants/messages";
import apiRequest from "src/helpers/connections";
import { sleep } from "src/helpers/sleep";
import { useAppDispatch } from "src/hooks";
import { galleryAccountDetails } from "src/slices/GalleryAddressSlice";
import { galleryAdminDetails } from "src/slices/GalleryAdminSlice";
import { galleryDetails } from "src/slices/GallerySlice";
import { useAccount } from "wagmi";

const PREFIX = "NodeModal";
const classes = {
  root: `${PREFIX}-root`,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.root}`]: {
    [theme.breakpoints.down("md")]: {
      paddingInline: "16px",
    },
    [theme.breakpoints.up("sm")]: {
      paddingInline: "64px",
    },
  },
}));

export interface NodeModal {
  handleClose: () => void;
  modalOpen: boolean;
  currentNode: string;
  setCustomNode: { (value: SetStateAction<string>): void; (arg0: string): void };
}

interface FormData {
  node_name: string;
  node_cpu: string;
  node_gpu: string;
  cpu_capacity: number;
  gpu_capacity: number;
  node_price: number;
  node_download: string;
  node_upload: string;
  seller_info: string;
  ssh_hostname: string;
  node_ip: string;
  ssh_username: string;
  ssh_key: string;
}

interface AuthState {
  loggedIn: boolean;
}

const NodeModal: FC<NodeModal> = ({ handleClose, modalOpen }) => {
  const dispatch = useAppDispatch();
  const { address = "", isConnected } = useAccount();
  const [formData, setFormData] = useState<FormData>({
    node_name: "",
    node_cpu: "",
    node_gpu: "",
    cpu_capacity: 0,
    gpu_capacity: 0,
    node_price: 0,
    node_download: "",
    node_upload: "",
    seller_info: "",
    ssh_hostname: "",
    node_ip: "",
    ssh_username: "",
    ssh_key: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const auth: { state: boolean } = {
    state: false,
  };
  auth.state = true;

  const handleValidation = () => {
    toast.error(messages.please_connect_wallet);
  }
  
  const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
    // Check if any required field is empty
    if (
      !formData.node_name ||
      !formData.node_cpu ||
      !formData.node_gpu ||
      formData.cpu_capacity <= 0.1 ||
      formData.gpu_capacity <= 0.1 ||
      formData.node_price < 0.0001 ||
      !formData.node_download ||
      !formData.node_upload ||
      !formData.seller_info ||
      !formData.ssh_hostname ||
      !formData.node_ip ||
      !formData.ssh_username ||
      !formData.ssh_key) {
      toast.error("All fields are required. Please fill in all required fields.");
    } else {
      e.preventDefault();
      handleRegist(e);
    }
  };

  const handleRegist = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const responseReg = await apiRequest(
        "regist/node",
        {
          node_name: formData.node_ip,
          node_cpu: formData.node_cpu,
          node_gpu: formData.node_gpu,
          cpu_capacity: formData.cpu_capacity,
          gpu_capacity: formData.gpu_capacity,
          node_price: formData.node_price,
          node_download: formData.node_download,
          node_upload: formData.node_upload,
          seller_address: address,
          seller_info: formData.seller_info,
          ssh_hostname: formData.ssh_hostname,
          node_ip: formData.node_ip,
          ssh_username: formData.ssh_username,
          ssh_key: formData.ssh_key,
        },
        "POST",
        undefined,
      );
      // dispatch(notificationActions.setMessage("KYB request has been successfully submitted."))
      toast.success(messages.tx_successfully_send);
      await sleep(1);
    } catch (error: any) {
      if (error?.info?.error?.status === 422) {
        toast.error(messages.error_422);
      } else {
        toast.error(messages.error_else);
      }
    } finally {
      dispatch(galleryAdminDetails());
      dispatch(galleryDetails());
      dispatch(galleryAccountDetails());
    }
    handleClose();
  };

  return (
    <StyledDialog
      onClose={handleClose}
      open={modalOpen}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: "9px" } }}
    >
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box />
          <Box>
            <Typography id="migration-modal-title" variant="h6" component="h2">
              Node Information
            </Typography>
          </Box>
          <Link onClick={handleClose} alignItems="center">
            <Icon name="x" />
          </Link>
        </Box>
      </DialogTitle>
      <Box paddingBottom="15px" className={classes.root}>
        <Typography color="textSecondary">
          Submit a request and our team will get back to you shortly. For more information please join{" "}
          <span style={{ color: "#1aded1" }}>@nodesnapes</span> on telegram
        </Typography>
      </Box>
      <Box paddingBottom="15px" margin={"25px"}>
        <FormControl fullWidth sx={{ paddingBottom: "10px" }}>
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            Node Name:
          </Typography>
          <TextField
            id="node_name"
            type="text"
            placeholder="Type in a Name of your node"
            value={formData.node_name}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            CPU
          </Typography>
          <TextField
            id="node_cpu"
            type="text"
            placeholder="AMD's EPYC 7642 with 48 cores"
            value={formData.node_cpu}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            GPU
          </Typography>
          <TextField
            id="node_gpu"
            type="text"
            placeholder="NVIDIA A100-SXM4 GPU with 40GB memory"
            value={formData.node_gpu}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            CPU Capacity:
          </Typography>
          <TextField
            id="cpu_capacity"
            type="number"
            placeholder="1 GB / 24 GB"
            value={formData.cpu_capacity}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            GPU Capacity:
          </Typography>
          <TextField
            id="gpu_capacity"
            type="number"
            placeholder="246 GB / 366 GB"
            value={formData.gpu_capacity}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            Price per hour ($):
          </Typography>
          <TextField
            id="node_price"
            type="number"
            placeholder="Type in a Price Peer Hour: Min == 0.0001"
            value={formData.node_price}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            Node download speed (Mbps):
          </Typography>
          <TextField
            id="node_download"
            type="number"
            placeholder="Type in a Node download Speed: 236"
            value={formData.node_download}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            Node upload speed (Mbps):
          </Typography>
          <TextField
            id="node_upload"
            type="number"
            placeholder="Type in a Node upload Speed: 356"
            value={formData.node_upload}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            Telegram user name:
          </Typography>
          <TextField
            id="seller_info"
            type="text"
            placeholder="Type in a Telegaram User Name: @username"
            value={formData.seller_info}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Typography id="migration-modal-title" variant="h6" component="h2">
            SSH Details
          </Typography>
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            In order to authenticate the configuration and maintain operational integrity of your node, we require the submission of SSH details. This information is essential for verification purposes and to facilitate the allocation of tasks to your node. Please be advised that without these credentials, your node cannot be integrated into our listing and task distribution network.
          </Typography>
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            SSH Hostname :
          </Typography>
          <TextField
            id="ssh_hostname"
            type="text"
            placeholder="Type in a SSH Hostname"
            value={formData.ssh_hostname}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            IP Address:
          </Typography>
          <TextField
            id="node_ip"
            type="text"
            placeholder="Type in a IP Address: 127.100.90.255"
            value={formData.node_ip}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            onChange={handleChange}
            required
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            SSH Username:
          </Typography>
          <TextField
            id="ssh_username"
            type="text"
            placeholder="Type in a SSH Username"
            value={formData.ssh_username}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
          />
          <Typography variant="body2" style={{ color: '#fff', marginBottom: '8px' }}>
            SSH Private Key:
          </Typography>
          <TextField
            id="ssh_key"
            type="text"
            placeholder="Type in a SSH Private Key ED25519"
            value={formData.ssh_key}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Box display="flex" justifyContent={"space-between"}>
            <PrimaryButton onClick={handleClose}>
              <Typography fontWeight="500" style={{ color: "#fff" }}>{`Cancel`}</Typography>
            </PrimaryButton>
            {address == "" ?
              <>
                <PrimaryButton onClick={handleValidation}>
                  <Typography fontWeight="500" style={{ color: "#fff" }}>{`Registration`}</Typography>
                </PrimaryButton>
              </>
              :
              <>
                <PrimaryButton onClick={handleRegistration}>
                  <Typography fontWeight="500" style={{ color: "#fff" }}>{`Registration`}</Typography>
                </PrimaryButton>
              </>
            }
          </Box>
        </FormControl>
      </Box>
    </StyledDialog>
  );
};

export default NodeModal;
