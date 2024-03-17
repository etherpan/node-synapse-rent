import "src/style.scss";

import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider } from "@mui/material/styles";
import {
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import Messages from "src/components/Messages/Messages";
import NavDrawer from "src/components/Sidebar/NavDrawer";
import StagingNotification from "src/components/StagingNotification";
import TopBar from "src/components/TopBar/TopBar";
import Wallet from "src/components/TopBar/Wallet";
// import PhishingBar from "./components/PhishingBar";
import { getValidChainId } from "src/constants/data";
import { shouldTriggerSafetyCheck } from "src/helpers";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useGoogleAnalytics } from "src/hooks/useGoogleAnalytics";
import useTheme from "src/hooks/useTheme";
import { chains } from "src/hooks/wagmi";
import { NetworkId } from "src/networkDetails";
import { getBalances, loadAccountDetails } from "src/slices/AccountSlice";
import { galleryDetails } from "src/slices/GallerySlice";
import { AppDispatch } from "src/store";
import { dark as darkTheme } from "src/themes/dark.js";
import { girth as gTheme } from "src/themes/girth.js";
import { light as lightTheme } from "src/themes/light.js";
import Gallery from "src/views/Gallery";
import AdminGallery from "src/views/AdminGallery";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { useAccount, useConnect } from "wagmi";
import { galleryAdminDetails } from "./slices/GalleryAdminSlice";
import { galleryAccountDetails } from "./slices/GalleryAddressSlice";
import { ADMIN_ACCOUNT } from "./constants";

// Dynamic Imports for code splitting
const TreasuryDashboard = lazy(() => import("./views/TreasuryDashboard/TreasuryDashboard"));
const Lending = lazy(() => import("./views/Lending/Lending"));
const Lenting = lazy(() => import("./views/Lenting/Lenting"));
const NotFound = lazy(() => import("./views/404/NotFound"));
const Referral = lazy(() => import("./views/Referral"));
// const Landing = lazy(() => import("./views/Landing"));
const Calculator = lazy(() => import("./views/Calculator"));

const PREFIX = "App";

const classes = {
  drawer: `${PREFIX}-drawer`,
  content: `${PREFIX}-content`,
  contentShift: `${PREFIX}-contentShift`,
  toolbar: `${PREFIX}-toolbar`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  notification: `${PREFIX}-notification`,
  navItemTitle: "NavItem-title",
  navItem: "link-container",
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`& .${classes.drawer}`]: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
      paddiing: 0
    },
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: "0px",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    marginLeft: drawerWidth,
    // marginTop: "-48.5px",
  },

  [`& .${classes.contentShift}`]: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },

  // necessary for content to be below app bar
  [`& .${classes.toolbar}`]: theme.mixins.toolbar,

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  },

  [`& .${classes.navItemTitle}`]: {
    paddingLeft: "32px !important",
  },

  [`& .${classes.navItem}`]: {
    backgroundColor: "transparent!important",
  },

  [`& .${classes.notification}`]: {
    marginLeft: "264px",
  },
}));

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 0;
const transitionDuration = 969;
function App() {
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [theme, toggleTheme] = useTheme();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { address = "", isConnected } = useAccount();
  const { error: errorMessage } = useConnect();
  // @ts-ignore
  const { chain = { id: 1 } } = useAccount();
  const isAdmin = ADMIN_ACCOUNT.includes(address);

  // const provider = useProvider();
  const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);

  // const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  // const migModalClose = () => {
  //   setMigrationModalOpen(false);
  // };

  const isSmallerScreen = useMediaQuery("(max-width: 1047px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  async function loadDetails(whichDetails: string) {
    const loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && isConnected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    (loadProvider: any) => {
      dispatch(galleryDetails({ networkID: getValidChainId(chain.id) as NetworkId, provider: loadProvider }));
      dispatch(galleryAdminDetails({ networkID: getValidChainId(chain.id) as NetworkId, provider: loadProvider }));
      dispatch(galleryAccountDetails({ networkID: getValidChainId(chain.id) as NetworkId, provider: loadProvider }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [chain.id, address],
  );

  const loadAccount = useCallback(
    (loadProvider: any) => {
      dispatch(
        loadAccountDetails({ networkID: getValidChainId(chain.id) as NetworkId, provider: loadProvider, address }),
      );
      dispatch(getBalances({ networkID: getValidChainId(chain.id) as NetworkId, provider: loadProvider, address }));
    },
    [chain.id, address],
  );

  const [resetDate, setResetDate] = useState(0);
  const addressRef = useRef(address);

  useEffect(() => {
    if (!address && addressRef.current) {
      setResetDate(new Date().getTime());
    }
    addressRef.current = address;
  }, [address]);

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (shouldTriggerSafetyCheck()) {
      toast("Safety Check: Always verify you're on nodesynapse.org");
    }
    loadDetails("app");
  }, []);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (isConnected && provider) {
      loadDetails("account");
    }
  }, [isConnected, chain.id, provider, address]);

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage.message);
  }, [errorMessage]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  const themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <StyledDiv>
      <RainbowKitProvider
        chains={chains}
        key={`rainbowkit-${resetDate}`}
        theme={
          theme === "dark"
            ? rainbowDarkTheme({ accentColor: "#676B74" })
            : rainbowLightTheme({ accentColor: "#E0E2E3", accentColorForeground: "#181A1D" })
        }
      >
        <ThemeProvider theme={themeMode}>
          <CssBaseline />
          <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
            <Toaster>{t => <Messages toast={t} />}</Toaster>
            <StagingNotification />
            {/* <PhishingBar /> */}
            <TopBar colorTheme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
            <nav className={classes.drawer}>
              {isSmallerScreen ? (
                <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
              ) : (
                <>{/* <Sidebar /> */}</>
              )}
            </nav>

            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
              {/* <MigrationCallToAction ={setMigrationModalOpen} /> */}
              <Suspense fallback={<div></div>}>
                <QueryParamProvider adapter={ReactRouter6Adapter}>
                  <Routes>
                    {isAdmin &&
                      <Route path="/admin" element={<AdminGallery />} />
                    }
                    <Route path="/" element={<Gallery />} />
                    <Route path="/nodes" element={<Gallery />} />
                    {address != "" && <Route path="/lending" element={<Lending />} />}
                    {address != "" && <Route path="/lenting" element={<Lenting />} />}
                    {/* <Route path="/mint" element={<Mint />} /> */}
                    
                    {/* <Route path="/nftItem" element={<NftItem />} /> */}
                    {/* <Route path="/referral" element={<Referral />} />
                    <Route path="/calculator" element={<Calculator />} /> */}
                    {/* <Route path="/dashboard/*" element={<TreasuryDashboard />} /> */}
                    <Route
                      path={"/stakednft"}
                      element={<Wallet open={true} component="info" theme={theme} toggleTheme={toggleTheme} />}
                    />
                    <Route
                      path={"/ownednft"}
                      element={<Wallet open={true} component="utility" theme={theme} toggleTheme={toggleTheme} />}
                    />
                    <Route
                      path={"/wallet/history"}
                      element={
                        <Wallet open={true} component="wallet/history" theme={theme} toggleTheme={toggleTheme} />
                      }
                    />
                    <Route
                      path="/wallet"
                      element={<Wallet open={true} component="wallet" theme={theme} toggleTheme={toggleTheme} />}
                    ></Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </QueryParamProvider>
              </Suspense>
            </div>
            {/* <Footer /> */}
          </div>
        </ThemeProvider>
      </RainbowKitProvider>
    </StyledDiv>
  );
}

export default App;
