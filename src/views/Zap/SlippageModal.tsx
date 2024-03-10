import { Box, Dialog, DialogTitle, FormControl, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, Input, PrimaryButton } from "@olympusdao/component-library";
import { FC, SetStateAction, useEffect, useState } from "react";
import { trim } from "src/helpers";

const PREFIX = "SlippageModal";

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

export interface SlippageModal {
  handleClose: () => void;
  modalOpen: boolean;
  currentSlippage: string;
  setCustomSlippage: { (value: SetStateAction<string>): void; (arg0: string): void };
}

const SlippageModal: FC<SlippageModal> = ({ handleClose, modalOpen, currentSlippage, setCustomSlippage }) => {
  const [proposedSlippage, setProposedSlippage] = useState(currentSlippage);
  const [errorState, setErrorState] = useState<string | null>(null);
  const handleChangeProposedSlippage = (slippage: string) => {
    try {
      const slippageNumber = Number(slippage);
      setProposedSlippage(slippage);
      if (100 > slippageNumber && slippageNumber > 0) {
        if (slippageNumber < 1) {
          setErrorState("Lower slippage than recommended may cause transaction to fail");
        } else {
          setErrorState(null);
        }
      } else {
        setErrorState("Slippage must be between 0 and 100");
      }
    } catch (e) {
      console.error(e);
      setErrorState("Enter a valid slippage percentage");
    }
  };
  useEffect(() => handleChangeProposedSlippage(currentSlippage), [modalOpen]);
  const presetSlippageOptions = ["2.0", "3.0", "4.0"];
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
          <Input
            id="slippage"
            type="text"
            placeholder="IP Address: 127.100.90.100"
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
            required
          />
          <Input
            id="slippage"
            type="text"
            placeholder="Processor: AMD's EPYC 7642 with 48 cores"
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
          />
          <Input
            id="slippage"
            type="text"
            placeholder="Graphics: NVIDIA A100-SXM4 GPU with 40GB memory"
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
          />
          <Input
            id="slippage"
            type="text"
            placeholder="Usage: Both CPU and GPU are hardly used"
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
          />
          <Input
            id="slippage"
            type="text"
            placeholder="Network Speed: 112 Mbps download, 110 Mbps upload"
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
          />
          <Input
            id="slippage"
            type="text"
            placeholder="Cost: $1.98 per hour"
            style={{ marginBottom: "20px", background: "#030712", borderRadius: "12px" }}
          />
          <Box display="flex" justifyContent={"space-between"}>
            <PrimaryButton
              disabled={errorState != null}
              onClick={() => {
                if (errorState != null) {
                  return;
                }
                setCustomSlippage(trim(+proposedSlippage, 1));
                handleClose();
              }}
            >
              <Typography fontWeight="500" style={{ color: "#fff" }}>{`Cancel`}</Typography>
            </PrimaryButton>
            <PrimaryButton
              disabled={errorState != null}
              onClick={() => {
                if (errorState != null) {
                  return;
                }
                setCustomSlippage(trim(+proposedSlippage, 1));
                handleClose();
              }}
            >
              <Typography fontWeight="500" style={{ color: "#fff" }}>{`Registration`}</Typography>
            </PrimaryButton>
          </Box>
        </FormControl>
        <Box paddingY="16px">{errorState ? <Typography color="error">{errorState}</Typography> : null}</Box>
      </Box>
    </StyledDialog>
  );
};

export default SlippageModal;
