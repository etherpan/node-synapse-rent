import "./TopBar.scss";

import { AppBar, Box, Button, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, NavItem } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Link, Link as ReactLink, useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "src/assets/icons/hamburger.svg";
import { ReactComponent as SynapseIcon } from "src/assets/icons/node.svg";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { ConnectButton } from "src/components/ConnectButton/ConnectButton";
import { CreateButton } from "src/components/CreateButton/ConnectButton";
import { NetworkId } from "src/networkDetails";
import { useAccount, useNetwork } from "wagmi";
import { ADMIN_ACCOUNT } from "src/constants"

const PREFIX = "TopBar";
const classes = {
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  pageTitle: `${PREFIX}-pageTitle`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${classes.appBar}`]: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
      paddingTop: "22.5px",
    },
    backdropFilter: "none",
  },

  [`& .${classes.menuButton}`]: {
    [theme.breakpoints.up(1048)]: {
      display: "none",
    },
  },

  [`& .${classes.pageTitle}`]: {
    [theme.breakpoints.up(1048)]: {
      marginLeft: "287px",
    },
    marginLeft: "0px",
  },
}));

interface TopBarProps {
  colorTheme: string;
  toggleTheme: (e: KeyboardEvent) => void;
  handleDrawerToggle: () => void;
}

function TopBar({ colorTheme, toggleTheme, handleDrawerToggle }: TopBarProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1048));
  const { chain = { id: 8453 } } = useNetwork();
  const { address = "", isConnected, isReconnecting } = useAccount();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const isAdmin = ADMIN_ACCOUNT.includes(address);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box paddingTop="8px" marginLeft={desktop ? "33px" : "0px"} display={"flex"} alignItems={"center"}>
          <ReactLink to="/">
            <SvgIcon
              color="primary"
              viewBox="0 0 490 490"
              component={SynapseIcon}
              style={{ minWidth: "61px", minHeight: "61px", width: "61px" }}
            />
          </ReactLink>
          {desktop && (
            <>
              {isAdmin &&
                <NavItem to="/admin" label={`Admin`} />
              }
              <NavItem to="/nodes" label={`Nodes`} />
              {address != "" &&  <NavItem to="/lending" label={`Lending`} />}
              {address != "" &&  <NavItem to="/renting" label={`Renting`} />}
              <NavItem href="https://staking.nodesynapse.app/" label={`Staking`} />
              <NavItem href="https://nodesynapse.cloud/" label={`Hosting`} style={{paddingLeft: "0px"}} className="customNavItem"/>
              {/* <NavItem to="/leaderboard" label={`Leaderboard`} /> */}
            </>
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          paddingTop="8px"
          marginRight={desktop ? "33px" : "0px"}
        >
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center">
              <CreateButton />
              {!isConnected || (chain.id !== NetworkId.TESTNET_GOERLI && chain.id !== NetworkId.BASE) ? (
                <ConnectButton />
              ) : (
                <>
                  <Link to="/wallet" state={{ prevPath: location.pathname }} className="wallet-connect-link">
                    <SvgIcon
                      component={WalletIcon}
                      style={{ marginRight: `${mobile ? "0px" : "9px"}`, fill: "none" }}
                      viewBox="0 0  37 34"
                    />
                    <Typography>{mobile ? "" : address.slice(0, 6) + "..." + address.slice(-4)}</Typography>
                  </Link>
                  <RainbowConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      authenticationStatus,
                      mounted,
                    }) => {
                      const ready = mounted && authenticationStatus !== "loading";
                      const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus || authenticationStatus === "authenticated");
                      return (
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{
                            height: "39px",
                            borderRadius: "6px",
                            padding: "9px",
                            cursor: "pointer",
                            border: `1px solid ${theme.colors.gray[10]}`,
                            "&:hover": {
                              border: `1px solid ${theme.colors.primary[300]}`,
                              color: theme.colors.primary[300],
                            },
                            "&:hover path": {
                              stroke: theme.colors.primary[300],
                            },
                          }}
                          onClick={() => {
                            openChainModal();
                          }}
                        >
                          {chain?.unsupported && (
                            <Icon name="alert-circle" style={{ fill: theme.colors.feedback.error }} />
                          )}
                          {chain?.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 24,
                                height: 24,
                                borderRadius: 999,
                                overflow: "hidden",
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 24, height: 24 }}
                                />
                              )}
                            </div>
                          )}
                        </Box>
                      );
                    }}
                  </RainbowConnectButton.Custom>
                </>
              )}
            </Box>
            {!desktop && (
              <Button
                id="hamburger"
                aria-label="open drawer"
                size="large"
                variant="text"
                color="secondary"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <SvgIcon component={MenuIcon} className="right-nav-icon" />
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TopBar;
