import { useSelector } from "react-redux";
import { Box, CardContent, Grid, styled } from "@material-ui/core";
import { trim } from "../../helpers";
import "./lenting.scss";
// import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useAppSelector } from "src/hooks";
import { useAccount } from "wagmi";
import { FilterDrama } from "@mui/icons-material";
import PageTitle from "src/components/PageTitle";
import { Button, Typography } from "@mui/material";
import ActiveRentals from "../Zap/ActiveRentals";
import toast from "react-hot-toast";
import { messages } from "src/constants/messages";
import { PrimaryButton } from "@olympusdao/component-library";
import axios from "axios";
import RentalHistory from "../Zap/RentalHistory";
// import { IReduxState } from "../../store/slices/state.interface";
// import { IAppSlice } from "../../store/slices/app-slice";
// // import { useHistory } from "react-router-dom";
// import { usePathForNetwork, useWeb3Context } from "../../hooks";

const PanelTabs = styled(Tab)({
  textDecoration: 'none',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
  '&.Mui-selected': {
    color: '#45f4e8',
  },
  border: 'none',
  '&:hover': {
    textDecoration: 'none', // Remove underline on hover
    border: 'none',
    backgroundColor: 'transparent', // Set background color to none on hover
  },
  '&:active': {
    color: '#3fdbd1',
  }
});

const handleValidation = () => {
  console.log('deefef')
  toast.error(messages.please_connect_wallet);
}

function Dashboard() {
  // const history = useHistory();
  // const { chainID } = useWeb3Context();
  // usePathForNetwork({ pathName: "dashboard", networkID: chainID, history });

  // const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  // const app = useSelector<IReduxState, IAppSlice>(state => state.app);
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

  const { address = "", isConnected } = useAccount();
  const purchaseNodeData = useAppSelector(state => state.accountGallery.items);
  const purchaseNode = purchaseNodeData.filter(node => node.seller_address === address)

  // const pastPayout = purchaseNode.length * purchaseNode.node_price;
  let pastPayout = 0
  purchaseNode.forEach(purchaseNode => {
    if (purchaseNode.seller_address === address) {
      pastPayout += purchaseNode.purchase;
    }
  })
  const approveNodeData = useAppSelector(state => state.gallery.items);
  const approveNode = approveNodeData.filter(node => node.seller_address === address && node.approve === 1);

  const totalNodeData = useAppSelector(state => state.adminGallery.items);
  const totalNode = totalNodeData.filter(node => node.seller_address === address);
  let EstimatedPayout = 0;
  totalNodeData.forEach(node => {
    if (node.seller_address === address && node.approve === 1) {
      EstimatedPayout += node.node_price;
    }
  });

  const activeEstimatedPayout = (EstimatedPayout * 30 * 24) / ethPrice;

  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [customNode, setCustomNode] = useState<string>("1.0");

  const handleNodeModalOpen = () => setNodeModalOpen(true);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const validConnectWallet = () => {
    if (value === '3' && address == "") {
      toast.error(messages.please_connect_wallet);
    }
    // setValue('1');
  };

  // useEffect(() => {
  //   validConnectWallet();
  // }, [address]);

  return (
    <div className="lenting-view">
      <PageTitle name="Lenting" />
      <div className="dashboard-view">
        <div className="dashboard-infos-wrap">
          <Grid item lg={12} md={12} sm={12} xs={12} className="dashboard-card">
            <CardContent>
              <Grid container>
                <CardContent>
                  <Typography>
                    Welcome to the Renting Dashboard, where your active and past node rentals are at your fingertips. This is your hub for overseeing the nodes you've rented, designed to give you full visibility and control over your decentralized endeavors. From here, you can track the performance and status of your active rentals and review the history of your past rentals. Our platform ensures a smooth and intuitive experience, whether you're expanding your digital footprint or reviewing your rental journey. Stay connected and manage your rentals with ease - your pathway to decentralization continues here!
                  </Typography>
                </CardContent>
                <Grid item xs={12} sm={6}>
                  <CardContent>
                    <div >
                      <p className="card-value">{approveNode.length}</p>
                      <p className="card-title">Rented Nodes</p>
                    </div>
                  </CardContent>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CardContent>
                    <div >
                      <p className="card-value">{totalNode.length}</p>
                      <p className="card-title">Active Rentals</p>
                    </div>
                  </CardContent>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </div>
        <div className="dashboard-infos-wrap" style={{ paddingTop: "30px" }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div className="dashboard-card">
              <Box sx={{ width: '100%' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="" style={{ paddingLeft: '20px' }}>
                      <PanelTabs style={{ textDecoration: "none" }} label="Active Rentals" value="1" />
                      <PanelTabs style={{ textDecoration: "none" }} label="Rental History" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <ActiveRentals />
                  </TabPanel>
                  <TabPanel value="2">
                    <RentalHistory />
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </Grid>
        </div>
      </div>
    </div>

  );
}

export default Dashboard;
