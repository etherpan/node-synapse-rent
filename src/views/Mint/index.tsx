import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StringParam, useQueryParam } from "use-query-params";
import { ethers } from "ethers";
import Cookies from "universal-cookie";
import CopyLinkIcon from "src/assets/icons/copylink.png";
import "./mint.scss";
import NODEGIF from "src/assets/mint-header.png";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  styled,
  useTheme,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import whitelists from "../../../public/whitelists.json";
import { createNode } from "src/slices/NftThunk";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { useAppSelector } from "src/hooks";
import PageTitle from "src/components/PageTitle";
import RoundedConnectButton from "src/components/ConnectButton/RoundedConnectButton";
import { Providers } from "src/helpers/providers/Providers/Providers";
import PendingTxName from "src/components/PendingTxName";
import rot13 from "src/lib/encode";
import { MAIN_URL, START_TIME, getValidChainId } from "src/constants/data";
import { LaunchCountdown } from "../Landing";
import { NetworkId } from "src/networkDetails";

function Mint() {
  const { chain = { id: 8453 } } = useNetwork();
  const theme = useTheme();
  const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);
  const { data: signer } = useSigner();
  const { address = "", isConnected, isReconnecting } = useAccount();
  const [isWhitelist, setIsWhitelist] = useState(false);

  
  const nftMintedSupply = useAppSelector(state => Number(state.app.nftMintedSupply));
  const nftTotalSupply = useAppSelector(state => Number(state.app.nftTotalSupply));
  const availableETH = useAppSelector(state => Number(state.account.balances.eth));

  const [ref, setNum] = useQueryParam("ref", StringParam);
  const cookies = new Cookies();

  const isUsed = cookies.get("whitelist") === "1"

  if (ref) {
    if (ethers.utils.isAddress(rot13(ref))) {
      cookies.set("ref", ref);
    }
  }

  useEffect(() => {
    const _result = whitelists.filter(list => list.address.toLowerCase() === address.toLowerCase() && !list.isUsed);
    
    if (_result.length > 0 && !isUsed) {
      setIsWhitelist(true);
    } else {
      setIsWhitelist(false)
    }
  }, [address, isUsed]);

  const [leftTime, setLeftTime] = useState(0);

  const getOverTime = (time: number) => {
    return time <= 0 ? 0 : time;
  };

  function format2Digit(x: number) {
    return x > 9 ? x.toString() : "0" + x;
  }

  useEffect(() => {
    let timer = setInterval(() => {
      setLeftTime(getOverTime(START_TIME - Math.floor(Date.now() / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [leftTime]);

  let days = "00",
    hours = "00",
    minutes = "00",
    seconds = "00";

  if (leftTime > 0) {
    days = format2Digit(Math.floor(leftTime / 86400));
    hours = format2Digit(Math.floor((leftTime % 86400) / 3600));
    minutes = format2Digit(Math.floor((leftTime % 3600) / 60));
    seconds = format2Digit(Math.floor((leftTime % 3600) % 60));
  }

  const dispatch = useDispatch();

  const [value, setValue] = useState<number>(1);
  const price = useAppSelector(state => Number(state.app.mintPrice));

  const onMint = async (wl: boolean) => {
    // if (await checkWrongNetwork()) return;
    // dispatch(createNode({ number: value, provider, signer, address, wl, networkID: getValidChainId(chain.id), handleClose: () => {} }));
  };

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const handleChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  const plusChange = () => {
    setValue(value + 1);
  };
  const minusChange = () => {
    if (value > 1) setValue(value - 1);
  };

  const Clipboard = () => {
    navigator.clipboard.writeText(`${MAIN_URL}mint?ref=${rot13(address)}`);
  };

  return (
    <>
      {Date.now() / 1000 < START_TIME && LaunchCountdown()}
      <div className="mint-view">
        <div className="mint-infos-wrap">
          <PageTitle name="Mint" />
          <div className="mint-img">
            <img src={NODEGIF} width="90%" style={{ maxHeight: "600px" }} />
          </div>
          <Box maxWidth={"815px"} width={"100%"}>
            <Box className="timer-wrap" display={"flex"} justifyContent={"center"} flexDirection={"row"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                className="timer-item-wrap"
                style={{ background: `${theme.colors.paper.cardHover}` }}
              >
                <Typography fontWeight={800} className="timer-value">
                  {days}
                </Typography>
                <Typography mt={1}>Days</Typography>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                className="timer-item-wrap"
                style={{ background: `${theme.colors.paper.cardHover}` }}
              >
                <Typography fontWeight={800} className="timer-value">
                  {hours}
                </Typography>
                <Typography mt={1}>Hours</Typography>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                className="timer-item-wrap"
                style={{ background: `${theme.colors.paper.cardHover}` }}
              >
                <Typography fontWeight={800} className="timer-value">
                  {minutes}
                </Typography>
                <Typography mt={1}>Minutes</Typography>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                className="timer-item-wrap"
                style={{ background: `${theme.colors.paper.cardHover}` }}
              >
                <Typography fontWeight={800} className="timer-value">
                  {seconds}
                </Typography>
                <Typography mt={1}>Seconds</Typography>
              </Box>
            </Box>
            <Grid container justifyContent={"center"} spacing={2} mt={1}>
              <Grid item lg={4} sm={12}>
                <Box className="nft-mint-stats-item" style={{ background: `${theme.colors.gray[700]}` }}>
                  <Typography>Total NODES: </Typography>
                  {nftTotalSupply ? (
                    <Typography>{new Intl.NumberFormat("en-US").format(nftTotalSupply)}</Typography>
                  ) : (
                    <Skeleton width={50} style={{ marginLeft: "8px" }} />
                  )}
                </Box>
              </Grid>
              <Grid item lg={4} sm={12}>
                <Box className="nft-mint-stats-item" style={{ background: `${theme.colors.gray[700]}` }}>
                  <Typography>Available: </Typography>
                  {nftTotalSupply ? (
                    <Typography>{new Intl.NumberFormat("en-US").format(nftTotalSupply - nftMintedSupply)}</Typography>
                  ) : (
                    <Skeleton width={50} style={{ marginLeft: "8px" }} />
                  )}
                </Box>
              </Grid>
              <Grid item lg={4} sm={12}>
                <Box className="nft-mint-stats-item" style={{ background: `${theme.colors.gray[700]}` }}>
                  <Typography>Sold: </Typography>
                  {nftMintedSupply || nftMintedSupply == 0 ? (
                    <Typography>{new Intl.NumberFormat("en-US").format(nftMintedSupply)}</Typography>
                  ) : (
                    <Skeleton width={50} style={{ marginLeft: "8px" }} />
                  )}
                </Box>
              </Grid>
            </Grid>
            <Grid container justifyContent={"center"} spacing={2} mt={1}>
              <Grid item lg={4} sm={12} xs={12}>
                <Box className="nft-mint-row-item">
                  <Typography fontSize={18} style={{ marginBottom: "12px" }}>
                    Price
                  </Typography>
                  <Box className="inner-row" style={{ background: `${theme.colors.gray[700]}` }}>
                    <Typography>Today</Typography>
                    {price ? (
                      <Typography style={{ color: `${theme.colors.primary[300]}` }}>{price} ETH</Typography>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Box>
                  <Box className="inner-row" style={{ background: `${theme.colors.gray[600]}` }} mt={1}>
                    <Typography>Tomorrow</Typography>
                    {price ? (
                      <Typography style={{ color: `${theme.colors.primary[300]}` }}>
                        {new Intl.NumberFormat("en-US").format(price + 0.01)} ETH
                      </Typography>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Box>
                  <Box className="inner-row" style={{ background: `${theme.colors.gray[600]}` }} mt={1}>
                    <Typography>Next Day</Typography>
                    {price ? (
                      <Typography style={{ color: `${theme.colors.primary[300]}` }}>
                        {new Intl.NumberFormat("en-US").format(price + 0.02)} ETH
                      </Typography>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={4} sm={12} xs={12}>
                <Box className="nft-mint-row-item">
                  <Typography fontSize={18}>Quantity</Typography>
                  <Box className="quantity-row" style={{ background: `${theme.colors.gray[700]}` }}>
                    <IconButton
                      aria-label="minus"
                      style={{
                        background: `${theme.colors.primary[300]}`,
                        width: "50px",
                        height: "50px",
                        fontSize: "50px",
                      }}
                      onClick={minusChange}
                    >
                      <span style={{ marginTop: "-3px" }}>-</span>
                    </IconButton>
                    <Box className="quantity-value">{value}</Box>
                    <IconButton
                      aria-label="plus"
                      style={{
                        background: `${theme.colors.primary[300]}`,
                        width: "50px",
                        height: "50px",
                        fontSize: "50px",
                      }}
                      onClick={plusChange}
                    >
                      <span>+</span>
                    </IconButton>
                  </Box>
                  {isConnected ? (
                    <>
                      <Button
                        onClick={() => onMint(false)}
                        disabled={pendingTransactions.length > 0}
                        style={{
                          height: "50px",
                          width: "95%",
                          borderRadius: "25px",
                          background: `${theme.colors.primary[300]}`,
                          color: "white",
                          fontWeight: "400",
                          fontSize: "20px",
                          marginTop: "8px",
                        }}
                      >
                        <PendingTxName name="Buy" />
                      </Button>
                      {isWhitelist && (
                        <Button
                          onClick={() => onMint(true)}
                          disabled={pendingTransactions.length > 0}
                          style={{
                            height: "50px",
                            width: "95%",
                            borderRadius: "25px",
                            background: `${theme.colors.primary[300]}`,
                            color: "white",
                            fontWeight: "400",
                            fontSize: "20px",
                            marginTop: "8px",
                          }}
                        >
                          <PendingTxName name="Buy as WL" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <Box mt={1} display={"flex"} justifyContent={"center"}>
                      <RoundedConnectButton />
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item lg={4} sm={12} xs={12}>
                <Box className="nft-mint-row-item">
                  <Typography fontSize={18}>Reciept</Typography>
                  <Box className="quantity-stats" style={{ background: `${theme.colors.gray[700]}` }}>
                    <Box className="row">
                      <Typography>Quantity</Typography>
                      <Typography>{value}</Typography>
                    </Box>
                    <Box className="row">
                      <Typography>Current Price</Typography>
                      {price ? <Typography>{price} ETH</Typography> : <Skeleton width={50} />}
                    </Box>
                    <Box className="row">
                      <Typography>Total</Typography>
                      {price ? <Typography>{(price * value).toFixed(2)} ETH</Typography> : <Skeleton width={50} />}
                    </Box>
                    <Box className="row">
                      <Typography>Available</Typography>
                      {availableETH || availableETH == 0 ? (
                        <Typography>{new Intl.NumberFormat("en-US").format(availableETH)} ETH</Typography>
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box className="referral-link-wrap" mt={8}>
              <Typography fontSize={28} fontWeight={600}>
                NODE Referral Link
              </Typography>
              <Box className="referral-link-box">
                <OutlinedInput
                  className="referral-link"
                  value={`${MAIN_URL}mint?ref=${rot13(address)}`}
                  style={{ border: `2px solid ${theme.colors.primary[300]}`, outline: "none" }}
                  endAdornment={
                    <InputAdornment position="end">
                      <div
                        className="referral-link-btn"
                        onClick={Clipboard}
                        style={{ background: `${theme.colors.primary[300]}` }}
                      >
                        <img src={CopyLinkIcon} width="20px" />
                      </div>
                    </InputAdornment>
                  }
                />
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

export default Mint;
