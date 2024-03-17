import "src/views/TreasuryDashboard/dashboard.scss";

import { Box, Button, Container, Grid, Link, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Paper } from "@olympusdao/component-library";
import { memo } from "react";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { SafariFooter } from "src/components/SafariFooter";
import { BUY_LINK, MILK_ADDRESSES, NODE_MANAGER } from "src/constants/addresses";
import { shorten } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { NetworkId } from "src/networkDetails";
import { useNetwork } from "wagmi";
import { getValidChainId } from "src/constants/data";

export const getScanUrls = (networkId: Number) => {
  switch (networkId) {
    case NetworkId.MAINNET:
      return "https://etherscan.io";
    case NetworkId.TESTNET_GOERLI:
      return "https://goerli.etherscan.io";
    case NetworkId.BASE:
      return "https://basescan.org/";
    default:
      return "https://basescan.org/";
  }
};
const MetricsDashboard = () => {
  const theme = useTheme();
  const hideToggleSidePadding = useMediaQuery(theme.breakpoints.up("md"));
  const hidePaperSidePadding = useMediaQuery(theme.breakpoints.down("md"));
  const { chain = { id: 8453 } } = useNetwork();
  const buyLink = BUY_LINK[getValidChainId(chain.id) as keyof typeof BUY_LINK] + MILK_ADDRESSES[getValidChainId(chain.id) as keyof typeof MILK_ADDRESSES];
  const nodeContractLink = getScanUrls(getValidChainId(chain.id)) + "/address/" + NODE_MANAGER[getValidChainId(chain.id) as keyof typeof NODE_MANAGER];
  const milkContractLink =
    getScanUrls(getValidChainId(chain.id)) + "/address/" + MILK_ADDRESSES[getValidChainId(chain.id) as keyof typeof MILK_ADDRESSES];

  const primaryButtonStyle = {
    height: "50px",
    width: "210px",
    borderRadius: "25px",
    background: `${theme.colors.primary[300]}`,
    color: "white",
    fontWeight: "400",
    fontSize: "20px",
    paddingRight: "20px",
  };

  const paperProps = {
    fullWidth: true,
    enableBackground: true,
  };

  /**
   * We minimise padding on the left and right at smaller screen sizes, in order
   * to maximise space for the graph.
   */
  const paperStyles = {
    ...(hidePaperSidePadding && { paddingLeft: "10px", paddingRight: "10px" }),
  };

  const isAppLoading = useAppSelector(state => Boolean(state.app.loading));
  const milkTotalSupply = useAppSelector(state => String(state.app.milkTotalSupply));
  const totalValueLocked = useAppSelector(state => String(state.app.totalValueLocked));
  const milkPrice = useAppSelector(state => Number(state.app.milkPrice));
  const mintPrice = useAppSelector(state => Number(state.app.mintPrice));
  const totalLiquidity = useAppSelector(state => Number(state.app.totalLiquidity));
  const milkSellFee = useAppSelector(state => Number(state.app.milkSellFee));
  const nftMintedSupply = useAppSelector(state => Number(state.app.nftMintedSupply));
  const processingFee = useAppSelector(state => String(state.app.processingFee));
  const nftTotalSupply = useAppSelector(state => Number(state.app.nftTotalSupply));

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <PageTitle name="Dashboard" />
        </Grid>
        <Grid item xs={12}>
          <Grid container columnSpacing={3}>
            <Grid item md={6} sm={12} style={{ flexBasis: "100%" }}>
              <Paper {...paperProps} style={paperStyles}>
                <Box className="status-card">
                  <Typography className="title">NodeSynapse Status</Typography>
                  <Box className="row">
                    <Typography className="key">Price:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseFloat(mintPrice.toString()))} ETH
                      </Typography>
                    )}
                  </Box>
                  <Box className="row">
                    <Typography className="key">Total Supply / Minted:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseInt(nftTotalSupply.toString()))} /{" "}
                        {new Intl.NumberFormat("en-US").format(parseInt(nftMintedSupply.toString()))}
                      </Typography>
                    )}
                  </Box>
                  {/* <Box className="row">
                    <Typography className="key">Total Minted:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseInt(nftMintedSupply.toString()))}
                      </Typography>
                    )}
                  </Box> */}
                  <Box className="row">
                    <Typography className="key">Total Value Locked:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseFloat(totalValueLocked))} $MILK
                      </Typography>
                    )}
                  </Box>

                  <Box className="row">
                    <Typography className="key">Referral Reward:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseInt(processingFee.toString()))} %
                      </Typography>
                    )}
                  </Box>
                  <Box className="row">
                    <Typography className="key">Contract Address:</Typography>
                    <Link href={nodeContractLink} target="_blank" fontSize={18}>
                      {shorten(NODE_MANAGER[chain.id as keyof typeof MILK_ADDRESSES] ?? NODE_MANAGER[8453])}
                    </Link>
                  </Box>
                  <Box width={"100%"} mt={3} textAlign={"center"} display={"flex"} justifyContent={"center"}>
                    <Button sx={primaryButtonStyle}>
                      <NavLink to="/mint" style={{ color: "#FFFFFF", textDecoration: "none" }}>
                        Mint
                      </NavLink>
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item md={6} sm={12} style={{ flexBasis: "100%" }}>
              <Paper {...paperProps} style={paperStyles}>
                <Box className="status-card">
                  <Typography className="title">MILK Status</Typography>
                  <Box className="row">
                    <Typography className="key">Price:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        ${new Intl.NumberFormat("en-US").format(parseFloat(milkPrice.toFixed(3)))}
                      </Typography>
                    )}
                  </Box>
                  <Box className="row">
                    <Typography className="key">Total Liquidity:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseFloat(totalLiquidity.toFixed(4)))} ETH
                      </Typography>
                    )}
                  </Box>
                  <Box className="row">
                    <Typography className="key">Circ Supply:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseInt(milkTotalSupply.toString()))} $MILK
                      </Typography>
                    )}
                  </Box>
                  <Box className="row">
                    <Typography className="key">Sell Fee:</Typography>
                    {isAppLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      <Typography className="value">
                        {new Intl.NumberFormat("en-US").format(parseInt(milkSellFee.toString()))} %
                      </Typography>
                    )}
                  </Box>
                  <Box className="row">
                    <Typography className="key">Contract Address:</Typography>
                    <Link href={milkContractLink} target="_blank" fontSize={18}>
                      {shorten(MILK_ADDRESSES[getValidChainId(chain.id) as keyof typeof MILK_ADDRESSES])}
                    </Link>
                  </Box>
                  <Box width={"100%"} mt={3} textAlign={"center"} display={"flex"} justifyContent={"center"}>
                    <Button sx={primaryButtonStyle} href={buyLink} target="_blank">
                      Buy
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <div id="dexscreener-embed">
        <iframe src="https://dexscreener.com/goerli/0x1B1E6255AB37200367C24a1094883EC82594443C?embed=1&theme=dark&trades=0&info=0"></iframe>
      </div> */}
      <SafariFooter />
    </>
  );
};

const PageWrapper = () => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <>
      {/* <PageTitle name="Dashboard" /> */}

      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};
const TreasuryDashboard = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PageWrapper />}>
          <Route
            index
            element={
              <Box sx={{ mt: "15px" }}>
                <MetricsDashboard />
              </Box>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default memo(TreasuryDashboard);
