import { Box, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import SlippageModal from "src/views/Zap/SlippageModal";

export const CreateButton = () => {
  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [customSlippage, setCustomSlippage] = useState<string>("1.0");
  const handleSlippageModalOpen = () => setSlippageModalOpen(true);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);

  function openCreateModal() {
    return (
      <>
        <div style={{ color: "#fef" }}>div</div>
      </>
    );
  }

  return (
    <>
      <SlippageModal
        handleClose={() => setSlippageModalOpen(false)}
        modalOpen={slippageModalOpen}
        setCustomSlippage={setCustomSlippage}
        currentSlippage={customSlippage}
      />
      <Link onClick={handleSlippageModalOpen}>
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
          onClick={() => {
            openCreateModal();
          }}
        >
          <Typography fontWeight="500">{`Add Nodes`}</Typography>
        </Box>
      </Link>
    </>
  );
};

export default CreateButton;
