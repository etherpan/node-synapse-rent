import { Box, Button, Link, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { messages } from "src/constants/messages";
import NodeModal from "src/views/Zap/NodeModal";
import { useAccount } from "wagmi";

export const CreateButton = () => {
  const location = useLocation();
  const { address = "", isConnected } = useAccount();
  console.log("debug address modeal");
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [customSlippage, setCustomSlippage] = useState<string>("1.0");

  const handleNodeModalOpen = () => setSlippageModalOpen(true);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const validNodeModal = () => {
    toast.error(messages.please_connect_wallet);
  };

  return (
    <>
      <NodeModal
        handleClose={() => setSlippageModalOpen(false)}
        modalOpen={slippageModalOpen}
        setCustomSlippage={setCustomSlippage}
        currentSlippage={customSlippage}
      />
      {address == "" ? (
        <>
          <Link onClick={validNodeModal}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              marginRight="10px"
              color="#fff"
              sx={{
                height: "39px",
                borderRadius: "6px",
                padding: "20px",
                cursor: "pointer",
                // border: `1px solid ${theme.colors.text}`,
                "& path": { stroke: `${theme.colors.text}` },
                "&:hover": {
                  border: `1px solid ${theme.colors.gray[500]}`,
                  color: theme.colors.text,
                },
                "&:hover path": {
                  color: theme.colors.gray[500],
                },
                background: theme.colors.primary[300],
                // color: "fff",
              }}
            >
              <Button style={{ color: "#fff", fontSize: "15px" }}>{`Add Nodes`}</Button>
            </Box>
          </Link>
        </>
      ) : (
        <Link onClick={handleNodeModalOpen}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginRight="10px"
            color="#fff"
            sx={{
              height: "39px",
              borderRadius: "6px",
              padding: "20px",
              cursor: "pointer",
              // border: `1px solid ${theme.colors.text}`,
              "& path": { stroke: `${theme.colors.text}` },
              "&:hover": {
                border: `1px solid ${theme.colors.gray[500]}`,
                color: theme.colors.text,
              },
              "&:hover path": {
                color: theme.colors.gray[500],
              },
              background: theme.colors.primary[300],
              // color: "fff",
            }}
          >
            <Button style={{ color: "#fff", fontSize: "15px" }}>{`Add Nodes`}</Button>
          </Box>
        </Link>
      )}
    </>
  );
};

export default CreateButton;
