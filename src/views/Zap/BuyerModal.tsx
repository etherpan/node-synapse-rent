import { Box, CircularProgress, Dialog, DialogTitle, FormControl, Link, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Signer, ethers } from "ethers";
import { Icon, PrimaryButton } from "@olympusdao/component-library";
import axios from "axios";
import { ChangeEvent, FC, FormEvent, SetStateAction, useEffect, useState } from "react";
import React from "react";
import { toast } from "react-hot-toast";
import { messages } from "src/constants/messages";
import apiRequest from "src/helpers/connections";
import { getValidChainId } from "src/constants/data";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import LoadingIcon from "src/assets/icons/loading.gif";
import { useAppDispatch } from "src/hooks";
import { galleryAdminDetails } from "src/slices/GalleryAdminSlice";
import { galleryDetails } from "src/slices/GallerySlice";
import { useEthPrice } from "src/helpers/getEthPrice";
import PurchaseAdminSlice from "src/slices/PurchaseAdminSlice";
import { NodeRentContract__factory } from "src/typechain";
import { NODE_RENT_CONTRACT } from "src/constants";

const PREFIX = "RentModal";
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

export interface RentModal {
  handleClose: () => void;
  modalOpen: boolean;
  currentNode: number;
  sellerAddress: string;
  NodePrice: number;
}

interface FormData {
  buyer_telegram: string;
}

interface AuthState {
  loggedIn: boolean;
}

const RentModal: FC<RentModal> = ({ handleClose, modalOpen, currentNode, NodePrice, sellerAddress }) => {
  const dispatch = useAppDispatch();
  const { address = "", isConnected } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);
  const { data: signer } = useSigner();
  const [formData, setFormData] = useState<FormData>({
    buyer_telegram: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const ethPrice = useEthPrice();

  if (isLoading) {
    return <div style={{ alignSelf: "center" }}>
      <CircularProgress color="secondary" size={50} />
    </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const auth: { state: boolean } = {
    state: false,
  };
  auth.state = true;

  const nodeUsdPrice = NodePrice * 24 * 30;
  const nodeEthPrice = nodeUsdPrice / ethPrice;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Check if any required field is empty
    if (
      !formData.buyer_telegram) {
      toast.error("All fields are required. Please fill in all required fields.");
    } else {
      e.preventDefault();
      handleRentSubmit(e);
    }
  };

  const handleRentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);
      const contractABI = NodeRentContract__factory.abi;
      const contractAddress = NODE_RENT_CONTRACT;
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const nodeEthPricedd = nodeEthPrice.toFixed(5)
      const nodeEthPriceInWei = ethers.utils.parseUnits(nodeEthPricedd.toString(), "ether");
      const purchase_tx = await contract.rentNode({ value: nodeEthPriceInWei, gasLimit: 300000 });
      console.log('debug purchase_tx', `${purchase_tx.hash}`)
      await purchase_tx.wait();

      // const purchase_tx = 0x87d086cfc7af2733cad7fe7a7bd2ecd3a419f16e8758e3c7c256cb4c4fbbde83;
      
      const responseReg = await apiRequest(
        "regist/submit",
        {
          currentNode: currentNode,
          sellerAddress: sellerAddress,
          buyer_telegram: formData.buyer_telegram,
          buyer_address: address,
          nodeEthPurchase: nodeEthPrice,
          purchase_tx: `${purchase_tx.hash}`, 
        },
        "POST",
        undefined,
      );
      toast.success(messages.tx_successfully_send);
      setIsLoading(false);
      handleClose();
    } catch (error: any) {
      // toast.error(messages.error_401)
      setIsLoading(false);
      handleClose();
      toast.error(messages.error_else);
    } finally {
      dispatch(galleryAdminDetails());
      dispatch(galleryDetails());
    }
  };

  return (
    <>
      {isLoading ?
        <div className="gallery-infos-loading">
          {/* <CircularProgress color="secondary" size={40} /> */}
          <>
            <img src={LoadingIcon} width={100} height={100} style={{ margin: "auto", marginTop: "40px" }} />
          </>
        </div>
        :
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
                  Rent GPU
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
                value={"Node " + currentNode}
                style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
                onChange={handleChange}
                required
              />
              <div>Telegram Info:</div>
              <TextField
                id="buyer_telegram"
                type="text"
                placeholder="@TelegramUsername"
                value={formData.buyer_telegram}
                onChange={handleChange}
                style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
                required
              />
              <div>Price: ${nodeUsdPrice.toFixed(3)} per month</div>
              <TextField
                id="node_cpu"
                type="text"
                placeholder="Telegram Username"
                value={parseFloat(nodeEthPrice.toFixed(5)) + " ETH"}
                onChange={handleChange}
                style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
                required
              />
              <Box display="flex" justifyContent={"space-between"}>
                <PrimaryButton onClick={handleClose}>
                  <Typography fontWeight="500" style={{ color: "#fff" }}>{`Cancel`}</Typography>
                </PrimaryButton>
                <PrimaryButton onClick={handleSubmit}>
                  <Typography fontWeight="500" style={{ color: "#fff" }}>{`Submit`}</Typography>
                </PrimaryButton>
              </Box>
            </FormControl>
          </Box>
        </StyledDialog>
      }
    </>
  );
};

export default RentModal;
