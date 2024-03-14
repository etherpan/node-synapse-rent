import { Box, Dialog, DialogTitle, FormControl, Link, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, PrimaryButton } from "@olympusdao/component-library";
import { ChangeEvent, FC, FormEvent, SetStateAction, useState } from "react";
import React from "react";
import { toast } from "react-hot-toast";
import { messages } from "src/constants/messages";
import apiRequest from "src/helpers/connections";
import { sleep } from "src/helpers/sleep";
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
  node_ip: string;
  node_cpu: string;
  node_gpu: string;
  cpu_capacity: string;
  gpu_capacity: string;
  network_speed?: string;
  node_price: string;
  seller_info: string;
}

interface AuthState {
  loggedIn: boolean;
}

const NodeModal: FC<NodeModal> = ({ handleClose, modalOpen }) => {
  const { address = "", isConnected } = useAccount();
  const [formData, setFormData] = useState<FormData>({
    node_ip: "",
    node_cpu: "",
    node_gpu: "",
    cpu_capacity: "",
    gpu_capacity: "",
    node_price: "",
    seller_info: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const auth: { state: boolean } = {
    state: false,
  };
  auth.state = true;

  const handleRegist = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('debug handleRegist')
      const responseReg = await apiRequest(
        "regist/node",
        {
          seller_address: address,
          node_ip: formData.node_ip,
          node_cpu: formData.node_cpu,
          node_gpu: formData.node_gpu,
          cpu_capacity: formData.cpu_capacity,
          gpu_capacity: formData.gpu_capacity,
          node_price: formData.node_price,
          seller_info: formData.seller_info,
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
    }
    handleClose();
  };

  return (
    <StyledDialog
      onClose={handleClose}
      open={modalOpen}
      fullWidth
      maxWidth="xs"
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
          <TextField
            id="node_ip"
            type="text"
            placeholder="IP Address: 127.100.90.100"
            value={formData.node_ip}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            onChange={handleChange}
            required
          />
          <TextField
            id="node_cpu"
            type="text"
            placeholder="CPU: AMD's EPYC 7642 with 48 cores"
            value={formData.node_cpu}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <TextField
            id="node_gpu"
            type="text"
            placeholder="Graphics: NVIDIA A100-SXM4 GPU with 40GB memory"
            value={formData.node_gpu}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <TextField
            id="cpu_capacity"
            type="number"
            placeholder="Amount of CPU Usage: 24 GB"
            value={formData.cpu_capacity}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <TextField
            id="gpu_capacity"
            type="number"
            placeholder="Amount of GPU Usage: 366 GB"
            value={formData.gpu_capacity}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <TextField
            id="node_price"
            type="number"
            placeholder="Cost: $1.98 per hour"
            value={formData.node_price}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <TextField
            id="seller_info"
            type="text"
            placeholder="Telegram Username"
            value={formData.seller_info}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Box display="flex" justifyContent={"space-between"}>
            <PrimaryButton onClick={handleClose}>
              <Typography fontWeight="500" style={{ color: "#fff" }}>{`Cancel`}</Typography>
            </PrimaryButton>
            <PrimaryButton onClick={handleRegist}>
              <Typography fontWeight="500" style={{ color: "#fff" }}>{`Registration`}</Typography>
            </PrimaryButton>
          </Box>
        </FormControl>
      </Box>
    </StyledDialog>
  );
};

export default NodeModal;
