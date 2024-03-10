// import "src/components/TopBar/TopBar.scss";

import { CloseOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";

function PhishingBar() {
  const theme = useTheme();
  const [isShow, setIsShow] = useState(sessionStorage.getItem("isShowPhishingBar") ?? "1");

  const handleClose = () => {
    setIsShow("0");
    sessionStorage.setItem("isShowPhishingBar", "0");
  };
  return (
    <Box
      style={{
        background: `${theme.colors.background}`,
        height: "70px",
        display: `${isShow === "1" ? "flex" : "none"}`,
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
      }}
    >
      <Typography style={{ width: "100%", textAlign: "center" }}>
        <span style={{ color: "rgb(255, 178, 55)", fontWeight: "700", textTransform: "uppercase" }}>
          Phishing Warning:
        </span>{" "}
        please make sure you're visiting https://nodesynapse.app/ - check the URL carefully.
      </Typography>
      <IconButton style={{ width: "70px", height: "70px" }} onClick={handleClose}>
        <CloseOutlined />
      </IconButton>
    </Box>
  );
}

export default PhishingBar;
