import { Box, Dialog, DialogTitle, FormControl, Link, TextField, Typography } from "@mui/material";
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
import { createNode } from "src/slices/NftThunk";
import { NetworkId } from "src/networkDetails";
import { clearPendingTxn, fetchPendingTxns } from "../../slices/PendingTxnsSlice";
import { AsyncThunkAction, Dispatch, AnyAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { NODE_MANAGER } from "src/constants/addresses";
import { NftManagerContract__factory, NodeRentContract__factory } from "src/typechain";

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
  NodePrice: number;
  setCustomNode: { (value: SetStateAction<string>): void; (arg0: string): void };
}

interface FormData {
  buyer_telegram: string;
}

interface AuthState {
  loggedIn: boolean;
}

const RentModal: FC<RentModal> = ({ handleClose, modalOpen, currentNode, NodePrice }) => {
  const { address = "", isConnected } = useAccount();
  const { chain = { id: 8453 } } = useNetwork();
  const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);
  const { data: signer } = useSigner();
  const [formData, setFormData] = useState<FormData>({
    buyer_telegram: "",
  });

  const [ethPrice, setEthPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', {
          headers: {
            Authorization: 'Apikey bff1258846ff3b41d2d8932a685ee9613020f83688d873ff50dc148f005f264a'
          }
        });
        const ethPriceData = response.data.USD;
        
        setEthPrice(ethPriceData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchEthPrice();

    // Cleanup function
    return () => {
      // Cancel ongoing requests or any cleanup needed
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
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
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const responseReg = await apiRequest(
        "regist/submit",
        {
          seller_address: address,
          currentNode: currentNode,
          buyer_telegram: formData.buyer_telegram,
        },
        "POST",
        undefined,
      );
      try {
        const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);
        const contractABI = NodeRentContract__factory.abi;
        const contractAddress = "0x46CA1d921f9c92501D582E39f63b0E35027e62ed";
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log('debug wewewewe')
        const nodeEthPricedd = nodeEthPrice.toFixed(5)
        const nodeEthPriceInWei = ethers.utils.parseUnits(nodeEthPricedd.toString(), "ether");
        console.log('debug asdfdf========', nodeEthPriceInWei.toString())
        const tx = await contract.rentNode({ value: nodeEthPriceInWei, gasLimit: 300000 });
        console.log('debug asdfdf', "contractABI")

        await tx.wait();
        
      } catch (error) {
        // toast.error(messages.error_401)
        console.log(error)
      }
      
      toast.success(messages.tx_successfully_send);
    } catch (error: any) {
      if (error?.info?.error?.status === 422) {
        toast.error(messages.error_422);
      } else {
        toast.error(messages.error_else);
      }
    }
    console.log("debug response api");
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
          <TextField
            id="buyer_telegram"
            type="text"
            placeholder="Telegram Username"
            value={formData.buyer_telegram}
            onChange={handleChange}
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <div>Price: ${nodeUsdPrice}</div>
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
  );
};

export default RentModal;
