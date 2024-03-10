import "src/views/NftItem/nftitem.scss";
import { isAddress } from "@ethersproject/address";
import {
  Button,
  Grid,
  InputAdornment,
  Link,
  Modal,
  OutlinedInput,
  Paper,
  Skeleton,
  SvgIcon,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { AnyAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CopyLinkIcon from "src/assets/icons/copylink.png";
import LoadingIcon from "src/assets/icons/loading.gif";
import OpenseaIcon from "src/assets/icons/opensea.png";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import { ReactComponent as VectorIcon } from "src/assets/icons/Vector.svg";
import RoundedConnectButton from "src/components/ConnectButton/RoundedConnectButton";
import PendingTxName from "src/components/PendingTxName";
import { NODE_MANAGER } from "src/constants/addresses";
import { INVITE_LINK, OPENSEA_ITEM_URL, getValidChainId } from "src/constants/data";
import { generateImage } from "src/helpers/NodeInfo/generateImage";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useAppSelector } from "src/hooks";
import rot13 from "src/lib/encode";
import { INftItem } from "src/slices/GallerySlice";
import { cashoutReward, transferNft, upgradeNft } from "src/slices/NftThunk";
import { getPendingReward, loadUserInfoDetails } from "src/slices/search-slice";
import Cookies from "universal-cookie";
import { StringParam, useQueryParam } from "use-query-params";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { LaunchCountdown } from "../Landing";

interface INftItemProps {
  nftId: string;
}
export function getDailyAPRByUser(stakedAmount: number) {
  if (stakedAmount >= 20000) {
    return 2.5;
  } else if (stakedAmount >= 5000) {
    return 2.2;
  } else if (stakedAmount >= 1000) {
    return 2.1;
  } else {
    return 2;
  }
}

export function getExtraDailyAPRByLevel(level: number, isOwner: boolean) {
  switch (level) {
    case 0:
      return isOwner ? 0.25 : 0;
    case 1:
      return isOwner ? 0.28 : 0.1;
    case 2:
      return isOwner ? 0.31 : 0.2;
    case 3:
      return isOwner ? 0.35 : 0.5;
    default:
      return 0;
  }
}

function NftItem() {
  const { chain = { id: 8453 } } = useNetwork();
  const chainID = getValidChainId(chain.id);

  // const provider = useProvider();
  const provider = Providers.getStaticProvider(chainID);
  const theme = useTheme();
  const { data: signer } = useSigner();

  const { address = "", isConnected, isReconnecting } = useAccount();
  const dispatch = useDispatch();

  const [nftInfo, setNftInfo] = useState<INftItem>();
  const [stakedAmount, setStakedAmount] = useState(0);
  const [pendingReward, setPendingReward] = useState(0);
  const [lastProcessingTimestamp, setLastProcessingTimestamp] = useState(0);
  const [ownerReward, setOwnerReward] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  // const { id } = useParams<{ id: string }>();
  const [id, setId] = useQueryParam("id", StringParam);

  const nftId = id ?? "1";
  const processingDelay = useAppSelector(state => {
    return Number(state.app.processingDelay);
  });
  const gallery = useAppSelector(state => {
    return state.gallery.nfts;
  });

  const milkBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.milk;
  });

  const [nftImg, setNftImg] = useState("");

  useEffect(() => {
    const LoadIdDetails = async () => {
      setNftInfo(gallery[parseInt(nftId) - 1]);
      if (gallery[parseInt(nftId) - 1]) {
        if (gallery[parseInt(nftId) - 1].owner == address) {
          setIsOwner(true);
          const ownerPendingReward = getPendingReward(
            gallery[parseInt(nftId) - 1].totalStakedAmount,
            getExtraDailyAPRByLevel(gallery[parseInt(nftId) - 1]?.level ?? 0, true),
            gallery[parseInt(nftId) - 1].nftLastProcessingTimestamp,
            true,
          );
          setOwnerReward(ownerPendingReward + gallery[parseInt(nftId) - 1].nftLastReward);
        } else {
          setIsOwner(false);
          setOwnerReward(0);
        }
        const nftImage = generateImage({
          tokenId: gallery[parseInt(nftId) - 1].id,
          level: gallery[parseInt(nftId) - 1].level,
          lockers: gallery[parseInt(nftId) - 1].totalStakers,
          tvl: Math.floor(gallery[parseInt(nftId) - 1].totalStakedAmount),
          ownerAddress: gallery[parseInt(nftId) - 1].owner,
        });
        setNftImg(nftImage);
      }
    };

    if (nftId != "") {
      LoadIdDetails();
    }
    const UserInfoDetails = async () => {
      const data = await loadUserInfoDetails({
        networkID: getValidChainId(chain.id),
        id: nftId ?? "1",
        address,
        provider,
      });
      setStakedAmount(data.stakedAmount);
      setLastProcessingTimestamp(data.lastProcessingTimestamp);
      setPendingReward(data.pendingReward);
    };

    if (isConnected && address) {
      UserInfoDetails();
    }
  }, [nftId, address, isConnected, gallery]);

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const milkPrice = useAppSelector(state => {
    return Number(state.app.milkPrice);
  });

  //Owner Transfer Modal Part
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [toAddress, setToAddress] = useState("");

  function handleToChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    if (isAddress(event.target.value)) {
      setToAddress(event.target.value);
    }
  }

  const [quantity, setQuantity] = useState<string>("");

  const Divider = () => {
    return <div style={{ borderBottom: `1px solid ${theme.colors.gray[20]}`, height: "1px" }} />;
  };

  const onTransfer = async () => {
    // if (await checkWrongNetwork()) return;
    if (toAddress) {
      setOpen(false);
      dispatch(
        transferNft({
          tokenId: nftId,
          to: toAddress,
          provider,
          signer,
          address,
          networkID: chainID,
        }) as unknown as AnyAction,
      );
    }
  };

  const onStake = async () => {
    // if (await checkWrongNetwork()) return;
    dispatch(upgradeNft({ id: nftId, quantity, provider, signer, address, networkID: chainID }));
  };

  const onClaim = async (swapping: boolean) => {
    // if (await checkWrongNetwork()) return;
    dispatch(cashoutReward({ nftId, swapping, provider, signer, address, networkID: chainID }));
  };

  const onCompound = async () => {
    // if (await checkWrongNetwork()) return;
    dispatch(upgradeNft({ id: nftId, quantity: "0", provider, signer, address, networkID: chainID }));
  };

  const setMaxQuantity = () => {
    setQuantity(new Intl.NumberFormat("en-US").format(parseFloat(milkBalance)));
  };

  const Clipboard = () => {
    navigator.clipboard.writeText(
      `${isConnected ? INVITE_LINK + nftId + "&milk_ref=" + rot13(address) : INVITE_LINK + nftId}`,
    );
  };

  const [milkRef, setMilkRef] = useQueryParam("milk_ref", StringParam);
  const cookies = new Cookies();

  if (milkRef) {
    if (ethers.utils.isAddress(rot13(milkRef))) {
      cookies.set("milk_ref", milkRef);
    }
  }

  const [isSwap, setIsSwap] = useState(false);
  const handleIsSwapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSwap(event.target.checked);
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  const buttonStyle = {
    height: "50px",
    width: "210px",
    borderRadius: "25px",
    background: `${theme.colors.text}`,
    color: `${theme.colors.paper.background}`,
    fontWeight: "400",
    fontSize: "20px",
  };

  const primaryButtonStyle = {
    height: "50px",
    width: "210px",
    borderRadius: "25px",
    background: `${theme.colors.primary[300]}`,
    color: "white",
    fontWeight: "400",
    fontSize: "20px",
  };

  const inputStyle = {
    height: "50px",
    borderRadius: "25px",
    width: "100%",
  };

  return (
    <Box>
      <Paper className="uc-popover uc-poper">
        <Grid className="uc-wrapper" container spacing={4}>
          <Grid className="uc-summary" item lg={5} md={5} sm={12} xs={12}>
            <div className="uc-image-section">
              {nftImg ? (
                <img src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(nftImg)))}`} width="90%" />
              ) : (
                <img src={LoadingIcon} width={200} height={200} style={{ marginTop: "200px" }} />
              )}
              {isOwner && (
                <div className="owner-badge uc-image-section">
                  <img width="70" src={OwnerBadge} />
                </div>
              )}
            </div>
          </Grid>
          <Grid className="uc-main" item lg={7} md={7} sm={12} xs={12}>
            <div className="uc-details">
              <div className="uc-details-section-1">
                <div className="uc-details-item uc-space">
                  <p className="uc-details-title">NodeSynapse #{nftId}</p>
                  <Link
                    href={`${OPENSEA_ITEM_URL}${
                      NODE_MANAGER[getValidChainId(chain.id) as keyof typeof NODE_MANAGER]
                    }/${nftId}`}
                    target="_blank"
                  >
                    <img src={OpenseaIcon} width="40px" />
                  </Link>
                </div>
                {isOwner && (
                  <div className="uc-interact" style={{ textAlign: "right", marginTop: "-30px", marginBottom: "20px" }}>
                    <Button sx={buttonStyle} onClick={handleOpen} disabled={pendingTransactions.length > 0}>
                      <PendingTxName name="Transfer NODE" />
                    </Button>
                  </div>
                )}
                {isConnected && (
                  <div className="uc-interact">
                    <div className="uc-interact-row" style={{ borderBottom: `1px solid ${theme.colors.gray[20]}` }}>
                      <Typography fontWeight={600} fontSize={20}>
                        Total Stakers
                      </Typography>
                      {nftInfo ? (
                        <Typography fontWeight={600} fontSize={20}>
                          {nftInfo?.totalStakers} Stakers
                        </Typography>
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </div>
                    <div className="uc-interact-row" style={{ borderBottom: `1px solid ${theme.colors.gray[20]}` }}>
                      <Typography fontWeight={600} fontSize={20}>
                        APY
                      </Typography>
                      {stakedAmount || stakedAmount == 0 ? (
                        <Typography fontWeight={600} fontSize={20}>
                          {new Intl.NumberFormat().format(
                            (getDailyAPRByUser(stakedAmount) + getExtraDailyAPRByLevel(nftInfo?.level ?? 0, false)) *
                              365,
                          )}{" "}
                          %
                        </Typography>
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </div>
                    {isOwner && (
                      <div className="uc-interact-row" style={{ borderBottom: `1px solid ${theme.colors.gray[20]}` }}>
                        <Typography fontWeight={600} fontSize={20}>
                          Owner Daily Reward
                        </Typography>
                        {nftInfo && nftInfo.totalStakedAmount ? (
                          <Typography fontWeight={600} fontSize={20}>
                            {new Intl.NumberFormat("en-US").format(
                              (nftInfo.totalStakedAmount * getExtraDailyAPRByLevel(nftInfo?.level ?? 0, true)) / 100,
                            )}{" "}
                            $MILK
                          </Typography>
                        ) : (
                          <Skeleton width={50} />
                        )}
                      </div>
                    )}
                    <div className="uc-interact-row" style={{}}>
                      <Typography fontWeight={600} fontSize={20}>
                        Your Wallet Balance
                      </Typography>
                      {milkBalance || parseFloat(milkBalance) == 0 ? (
                        <Typography fontWeight={600} fontSize={20}>
                          {new Intl.NumberFormat("en-US").format(parseFloat(milkBalance))} $MILK
                        </Typography>
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </div>
                  </div>
                )}
                <div className="uc-interact">
                  <div className="uc-interact-item">
                    <OutlinedInput
                      type="text"
                      placeholder="Input Amount"
                      className="uc-interact-input-section"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      // labelWidth={0}
                      style={{ border: `2px solid ${theme.colors.text}`, marginRight: "16px" }}
                      endAdornment={
                        <InputAdornment position="end">
                          <div className="uc-interact-input-btn" onClick={setMaxQuantity}>
                            <p>MAX</p>
                          </div>
                        </InputAdornment>
                      }
                    />
                    <div className="uc-interact-connect-button">
                      {!isConnected && <RoundedConnectButton />}
                      {isConnected && (
                        <Button
                          sx={primaryButtonStyle}
                          onClick={onStake}
                          disabled={
                            pendingTransactions.length > 0 || isNaN(parseFloat(quantity)) || parseFloat(quantity) == 0
                          }
                        >
                          <PendingTxName name="Stake" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="uc-interact-item" style={{ justifyContent: "space-between" }}>
                    <Typography fontWeight={600} fontSize={20}>
                      Your Staked Value
                    </Typography>
                    {stakedAmount || stakedAmount == 0 ? (
                      <Typography fontWeight={600} fontSize={20}>
                        {new Intl.NumberFormat("en-US").format(stakedAmount)} $MILK
                      </Typography>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </div>
                </div>
                {isConnected && <Divider />}
                {isConnected && (
                  <div className="uc-interact">
                    <div className="uc-interact-row">
                      <Typography fontWeight={600} fontSize={20}>
                        Your Staking Reward
                      </Typography>
                      {(pendingReward || pendingReward == 0) && nftInfo ? (
                        <Typography fontWeight={600} fontSize={20}>
                          {new Intl.NumberFormat("en-US").format(pendingReward)} $MILK
                        </Typography>
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </div>
                    <div className="uc-interact-row">
                      <Typography fontWeight={600} fontSize={20}>
                        Your Owner Reward
                      </Typography>
                      {(pendingReward || pendingReward == 0) && nftInfo ? (
                        <Typography fontWeight={600} fontSize={20}>
                          {new Intl.NumberFormat("en-US").format(ownerReward)} $MILK
                        </Typography>
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </div>
                    <Divider />
                    <div className="uc-interact-row">
                      <Typography fontWeight={600} fontSize={20}>
                        Your Total Reward
                      </Typography>
                      {(pendingReward || pendingReward == 0) && nftInfo ? (
                        <Typography fontWeight={600} fontSize={20}>
                          {new Intl.NumberFormat("en-US").format(pendingReward + ownerReward)} $MILK
                        </Typography>
                      ) : (
                        <Skeleton width={50} />
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <Typography fontWeight={400} fontSize={18}>
                        Receive By ETH
                      </Typography>
                      <Switch onChange={handleIsSwapChange} checked={isSwap} />
                    </div>
                    <div className="uc-interact-row">
                      <Button
                        sx={primaryButtonStyle}
                        style={{ width: "45%" }}
                        disabled={pendingTransactions.length > 0 || stakedAmount == 0}
                        onClick={onCompound}
                      >
                        <PendingTxName name="Compound" />
                      </Button>
                      <Button
                        sx={primaryButtonStyle}
                        style={{ width: "45%" }}
                        disabled={pendingTransactions.length > 0 || pendingReward + ownerReward == 0}
                        onClick={() => onClaim(isSwap)}
                      >
                        <PendingTxName name="Claim" />
                      </Button>
                    </div>
                    <div className="uc-space" />
                    <Divider />
                    <div className="uc-space" />
                    <Box textAlign={"center"} mt={3}>
                      <Link
                        href={`${OPENSEA_ITEM_URL}${
                          NODE_MANAGER[getValidChainId(chain.id) as keyof typeof NODE_MANAGER]
                        }/${nftId}`}
                        target="_blank"
                        style={{ fontSize: "20px", textDecoration: "underline" }}
                      >
                        View on OpenSea
                      </Link>
                    </Box>
                  </div>
                )}
                <div className="uc-space" />
                <div className="uc-interact" style={{ marginTop: "80px" }}>
                  <div className="uc-space" />
                  <Box display={"flex"} className="ref-banner-wrap">
                    <div className="ref-banner">
                      <SvgIcon
                        component={VectorIcon}
                        viewBox="0 0 187 186"
                        style={{ width: "160px", height: "160px" }}
                      />
                      <div className="ref-banner-content">
                        <Typography fontSize={16} fontWeight={600} padding={"12px"}>
                          GET
                        </Typography>
                        <Typography fontSize={60} fontWeight={600}>
                          10%
                        </Typography>
                      </div>
                    </div>
                    <div style={{ width: "100%" }}>
                      <Typography fontWeight={600} fontSize={14} height={49} pt={3} className="ref-desc">
                        Promote and referr with this link and get 10% directly in your wallet.
                      </Typography>
                      <div className="uc-referral" style={{ width: "100%" }}>
                        <OutlinedInput
                          className="referral-link"
                          value={`${
                            isConnected ? INVITE_LINK + nftId + "&milk_ref=" + rot13(address) : INVITE_LINK + nftId
                          }`}
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
                      </div>
                    </div>
                  </Box>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper>
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Transfer NODE
            </Typography>
            <Box mt={2}>
              <OutlinedInput
                sx={inputStyle}
                placeholder="Enter the Target Address"
                onChange={handleToChange}
                value={toAddress}
              />
              <Box mt={2} width={"100%"} textAlign={"center"}>
                <Button sx={buttonStyle} onClick={onTransfer} disabled={pendingTransactions.length > 0}>
                  <PendingTxName name="Transfer" />
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default NftItem;
