import "src/views/Landing/landing.scss";
import "src/views/Landing/roadmap.scss";

import { ExpandMore, LockOutlined, Person2Outlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Modal,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderLeftImage from "src/assets/left-down.png";
import MilkImage from "src/assets/milk.png";
import HeaderRightImage from "src/assets/right-down.png";
import { BUY_LINK, MILK_ADDRESSES } from "src/constants/addresses";
import { getValidChainId, START_TIME } from "src/constants/data";
import { sleep } from "src/helpers/sleep";
import { useAppSelector } from "src/hooks";
import { useNetwork } from "wagmi";

function createData(name: string, staked: string, rewardDaily: string, apyNormal: string, apyCompound: string) {
  return { name, staked, rewardDaily, apyNormal, apyCompound };
}

const rows = [
  createData("$Milk Staked", "0~999", "2%", "730%", "137,740.8%"),
  createData("Daily Reward", "1,000~4,999", "2.1%", "766.5%", "196,968.1%"),
  createData("APY (Normal)", "5,000~19,999", "2.2%", "803%", "281,563.9%"),
  createData("APY (Compound)", "20,000~", "2.5%", "912.5%", "820,749.9%"),
];

const steps = [
  { content: "Establish initial idea and concept", step: "14/08/23", id: 0 },
  { content: "Estimate possibility about this initial idea and concept", step: "14/08/23", id: 1 },
  { content: "Create a documentation", step: "14/08/23", id: 2 },
  { content: "Make a white paper", step: "14/08/23", id: 3 },
  { content: "NODE design, Front end design", step: "14/08/23", id: 4 },
  { content: "Contract write", step: "14/08/23", id: 5 },
  { content: "Frontend build and integration", step: "14/08/23", id: 6 },
  { content: "Create twitter, telegram channels for marketing", step: "14/08/23", id: 7 },
  { content: "KYC", step: "14/08/23", id: 8 },
  { content: "Contract Audit", step: "14/08/23", id: 9 },
  { content: "Marketing campaign", step: "14/08/23", id: 10 },
  { content: "Token Launch", step: "14/08/23", id: 11 },
  { content: "Transferable pool launch", step: "14/08/23", id: 12 },
  { content: "Marketing Campaign", step: "14/08/23", id: 13 },
  { content: "TVL contest for big reward to each pool contributors and owner", step: "14/08/23", id: 14 },
  {
    content: "Play to earn game development. All contributors in one pool will be same team.",
    step: "14/08/23",
    id: 15,
  },
  { content: "Marketing Campaign.", step: "14/08/23", id: 16 },
];

const faqs = [
  {
    que: "Is the Liquidity Pool locked?",
    ans: "Yes, the liquidity pool for MILK will be initially funded with 10ETH and the resulting LP tokens will be burnt(sent to dead address).",
  },
  {
    que: "How can I buy $MILK?",
    ans: "You need to download the Metamask extension in your Chrome, Firefox or supported browser. You can use other Ethereum wallets you prefer to use. When your wallet is properly set up, you need to own some ETH or other tokens on Base main network and head over Baseswap.fi to buy some $MILK.",
  },
  {
    que: "Why high sell tax (25%)? How can I sell $MILK?",
    ans: "In a word, that’s for the anti-whale, anti-trading bot. Over time, Whales will sell some of their holdings and flood the market pushing prices below their true value. They purchase back in large volumes creating artificial scarcity. The main purpose of MILK is to provide passive income to stakers. The only stakers can exchange rewards of $MILK for ETH without sales tax through the NODE contract. Otherwise, you will lose about half the money.",
  },
  {
    que: "Is $MILK mintable by someone?",
    ans: "No, $MILK is minted once only for the initial supply by the contract. Even the owner can't mint new tokens. Learn more on token contracts.",
  },
  {
    que: "Is this project trustable?",
    ans: "We planned to do kyc and audit contracts for safety of community and trust. But we highly recommend to do your own research enough before you invest.",
  },
];

interface RoadItem {
  content: string;
  step: string;
  id: number;
}

export function LaunchCountdown() {
  const [open, setOpen] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const getTrackTime = sessionStorage.getItem("IsShow");
  const [isShow, setIsShow] = useState("");

  useEffect(() => {
    if (parseInt(getTrackTime ?? "0") > 0) {
      setIsShow(parseInt(getTrackTime ?? "0") + 86400 < Math.floor(Date.now() / 1000) ? "1" : "0");
    } else {
      setIsShow("1");
    }
  }, [open, isChecked]);

  useEffect(() => {
    const delay = async () => {
      await sleep(isFirst ? 0.1 : 8);
      if (isShow === "1") {
        setOpen(true);
        setIsFirst(false);
      }
    };
    if (!open && isShow === "1") delay();
  }, [open, isShow]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "24px",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  const [leftTime, setLeftTime] = useState(0);

  const getOverTime = (time: number) => {
    return time <= 0 ? 0 : time;
  };

  function format2Digit(x: number) {
    return x > 9 ? x.toString() : "0" + x;
  }

  useEffect(() => {
    const timer = setInterval(() => {
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
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        ".MuiBox-root": {
          backgroundImage: `url("src/assets/launch-bg.png")`,
          backgroundSize: "100% 100%",
          width: "600px",
          height: "340px",
          padding: "28px 80px",
        },
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" fontSize={30} fontWeight={700} lineHeight={"38px"}>
          Launch on
        </Typography>
        <Typography id="modal-modal-title" fontSize={30} fontWeight={700} lineHeight={"38px"}>
          Oct 3rd at 17:00 PM(UTC)
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: "28px", fontWeight: "700" }}>
          {days}
          <span className="less-small-text"> (d)</span> : {hours}
          <span className="less-small-text"> (h)</span> : {minutes}
          <span className="less-small-text"> (m)</span> : {seconds}
          <span className="less-small-text"> (s)</span>
        </Typography>
        <Typography variant="h3" component="h2">
          on Base network
        </Typography>
        <Typography fontSize={17}>
          Please check our &nbsp;
          <Link href="https://docs.nodesynapse.org" target="_blank" style={{ color: "#e3a3a3", fontWeight: "700" }}>
            document
          </Link>
          &nbsp; for more information and stay tuned for more exciting events and updates on our social networks. &nbsp;
          <Link target="_blank" href="https://linktr.ee/nodesynapse" style={{ color: "#e3a3a3", fontWeight: "700" }}>
            https://linktr.ee/nodesynapse
          </Link>
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              onChange={e => {
                setIsChecked(e.target.checked);
                if (e.target.checked) {
                  sessionStorage.setItem("IsShow", Math.floor(Date.now() / 1000).toString());
                } else {
                  sessionStorage.setItem("IsShow", "0");
                }
              }}
              value={isChecked}
            />
          }
          label="Don't show for one day."
        />
      </Box>
    </Modal>
  );
}

function Landing() {
  const theme = useTheme();
  const { chain = { id: 8453 } } = useNetwork();
  const buyLink =
    BUY_LINK[getValidChainId(chain.id) as keyof typeof BUY_LINK] +
    MILK_ADDRESSES[getValidChainId(chain.id) as keyof typeof MILK_ADDRESSES];

  const totalValueLocked = useAppSelector(state => String(state.app.totalValueLocked));
  const milkPrice = useAppSelector(state => Number(state.app.milkPrice));
  const mintPrice = useAppSelector(state => Number(state.app.mintPrice));

  const primaryButtonStyle = {
    height: "50px",
    width: "180px",
    borderRadius: "25px",
    background: `${theme.colors.primary[300]}`,
    color: "white",
    fontWeight: "400",
    fontSize: "20px",
  };

  const buttonStyle = {
    height: "50px",
    width: "180px",
    borderRadius: "25px",
    background: `${theme.colors.text}`,
    color: `${theme.colors.paper.background}`,
    fontWeight: "400",
    fontSize: "20px",
    zIndex: "5",
  };

  const Divider = () => {
    return <div style={{ borderBottom: `1px solid ${theme.colors.gray[10]}`, height: "1px", margin: "12px 5%" }} />;
  };

  const activeProgress = 11;

  const chunkIntoN = (arr: RoadItem[], n: number) => {
    const size = Math.ceil(arr.length / n);
    return Array.from({ length: n }, (v, i) => arr.slice(i * size, i * size + size));
  };
  const splitSteps = chunkIntoN(steps, 5);
  const isSmallScreen = useMediaQuery("(max-width: 992px)");

  const SubRoadmap = (roads: RoadItem[], isWrapDone: boolean) => {
    let _roads = roads;
    if (!isSmallScreen && roads.length == 4 && (roads[3].id + 1) % 8 == 0) {
      _roads = roads.reverse();
    }
    return (
      <div className={`roadmap-wrap ${isWrapDone ? "roadmap-wrap-done" : ""} roadmap-wrap-s1 mb-0`}>
        <div className="row no-gutters">
          {_roads.map(road => {
            const isDone = road.id < activeProgress;
            const isCurrent = road.id === activeProgress;
            return (
              <div className="col-lg">
                <div
                  className={`roadmap roadmap-s1 ${isDone ? "roadmap-done" : ""} ${
                    isCurrent ? "roadmap-current" : ""
                  } text-lg-center`}
                >
                  <div className="roadmap-step roadmap-step-s1">
                    <div className="roadmap-head roadmap-head-s1">
                      <span className="roadmap-time roadmap-time-s1">STEP {road.id + 1}</span>
                      <span className="roadmap-title roadmap-title-s1">{road.content}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isMobileScreen = useMediaQuery("(max-width: 450px)");

  return (
    <div>
      {Date.now() / 1000 < START_TIME && LaunchCountdown()}
      <Box className="full-width-container top-header" style={{ position: "relative" }}>
        <div className="header-image-wrap">
          <img src={HeaderLeftImage} className="left-down" />
          <img src={HeaderRightImage} className="right-down" />
        </div>
        <div className="main-content-wrap">
          <Grid container>
            <Grid item sm={12} md={6} xs={12}>
              <Typography
                color={`${theme.colors.paper.background}`}
                fontSize={90}
                fontWeight={900}
                lineHeight={"100px"}
                className="header-title"
              >
                UP TO 820,749.9%
              </Typography>
              <Typography
                color={`${theme.colors.text}`}
                fontSize={50}
                lineHeight={"60px"}
                fontWeight={900}
                className="header-title-2"
              >
                Reward in ETH
              </Typography>
              <Typography fontSize={18}>
                Synapse is the world 1st, specially designed transferable passive income pool that gives extra reward to
                pool owners. We introduced NODE to show all information of each pool including owner info, TVL, pool
                level, reward rates and so on.
              </Typography>
              <Box
                mt={4}
                width={"100%"}
                display={"flex"}
                justifyContent={"space-evenly"}
                className="landing-buttons-wrap"
              >
                <NavLink to="/mint">
                  <Button sx={primaryButtonStyle}>Mint</Button>
                </NavLink>
                <NavLink to="/nodes">
                  <Button sx={primaryButtonStyle}>Explore</Button>
                </NavLink>
              </Box>
            </Grid>
          </Grid>
          <Box mt={4} width={"100%"} textAlign={"center"} display={"flex"} justifyContent={"center"}>
            <Box className="header-stats-wrap" style={{ background: `${theme.colors.paper.cardHover}` }}>
              <Box m={2}>
                <Typography className="value">1.2 M</Typography>
                <Typography className="title"> $MILK SUPPLY</Typography>
              </Box>
              <Box width={"2px"} style={{ background: `${theme.colors.text}` }} m={"16px 0px"} />
              <Box m={2}>
                {milkPrice ? (
                  <Typography className="value">
                    ${new Intl.NumberFormat().format(Math.floor(parseFloat(totalValueLocked) * milkPrice))}
                  </Typography>
                ) : (
                  <Skeleton width={50} />
                )}
                <Typography className="title"> TVL</Typography>
              </Box>
              <Box width={"2px"} style={{ background: `${theme.colors.text}` }} m={"16px 0px"} />
              <Box m={2}>
                {mintPrice ? <Typography className="value">{mintPrice}</Typography> : <Skeleton width={50} />}
                <Typography className="title"> NODE PRICE (ETH)</Typography>
              </Box>
              <Box width={"2px"} style={{ background: `${theme.colors.text}` }} m={"16px 0px"} />
              <Box m={2}>
                <Typography className="value">~3%</Typography>
                <Typography className="title">REWARD / DAY</Typography>
              </Box>
            </Box>
          </Box>
        </div>
      </Box>
      <Box
        className="full-width-container"
        style={{ background: `${theme.colors.primary[300]}`, zIndex: "1", position: "relative" }}
      >
        <div className="main-content-wrap">
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 4 }} rowSpacing={3}>
            <Grid item sm={12} md={6}>
              <Box display={"flex"}>
                <LockOutlined fontSize="large" className="section-svg" />
                <Typography fontSize={50} lineHeight={"50px"} fontWeight={900} ml={1} className="section-title">
                  SECURITY
                </Typography>
              </Box>
              <Typography mt={2} className="small-text">
                Transparency and openness are the two main reasons why Defi exists and has thrived over TradFi to date,
                but they are qualities that are still often lacking in many projects. At we want the community to feel
                safe using the platform. To do this we have removed the need to even have to trust us everything can be
                verified by yourself. As the popular saying in Bitcoin/Crypto goes, "Don't trust, verify".
              </Typography>
              <Box mt={2} display={"flex"} justifyContent={"space-around"} zIndex={2} className="landing-buttons-wrap">
                <Button
                  sx={buttonStyle}
                  href="https://twitter.com/VB_Audit/status/1694687084739535276?t=ecwi9ZMH2_ISeop9fTZJig&s=19"
                  target="_blank"
                >
                  KYC
                </Button>
                <Button
                  sx={buttonStyle}
                  href="https://github.com/solidproof/projects/blob/main/2023/Synapse/SmartContract_Audit_Solidproof_Synapse.pdf"
                  target="_blank"
                >
                  Audit
                </Button>
              </Box>
            </Grid>
            <Grid item sm={12} md={6}>
              <Box display={"flex"}>
                <Person2Outlined fontSize="large" className="section-svg" />
                <Typography fontSize={50} lineHeight={"50px"} fontWeight={900} ml={1} className="section-title">
                  REFERRAL
                </Typography>
              </Box>
              <Typography mt={2} className="small-text">
                <b>NODE MINT</b>: When a referrer refers his friend to mint NODE, 10%of ETH amount will go to the referrer
                address directly.
              </Typography>
              <Typography className="small-text">
                <b>TOKEN STAKE</b>: When a referrer refers his friend to stake $MILK tokens to the transferable pool,
                the referrer will get 10% of $MILK staked amount by his friend.
              </Typography>
              <Typography className="small-text">
                Please refer your friends and get 10% reward directly in your wallet.
              </Typography>
              <Box mt={2} display={"flex"} justifyContent={"space-around"} zIndex={2} className="landing-buttons-wrap">
                <NavLink to="/referral">
                  <Button sx={buttonStyle}>Mint Referral</Button>
                </NavLink>
                <NavLink to="/nftitem?id=1">
                  <Button sx={buttonStyle}>Stake Referral</Button>
                </NavLink>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box className="full-width-container" mt={2} zIndex={3}>
        <div className="main-content-wrap">
          <Grid container columnSpacing={{ xs: 0, sm: 2, md: 4 }} style={{ margin: "auto" }}>
            <Grid item md={7} xs={12} sm={7}>
              <div className="left-milk-content">
                <div style={{ width: "80%" }} className="wrap">
                  <Typography className="subtitle section-title" mb={2}>
                    $MILK
                  </Typography>
                  <Typography className="small-text">
                    MILK is a token that people can stake into the transferable NODESYNAPSENAPSE pool minted by others or yourself
                    for passive income in ETH. The reward rate is usually 2% per day and it raises as the staked MILK
                    amount grows.
                  </Typography>
                  <Typography mt={2} className="small-text">
                    You can check the reward rates based on $MILK staked amount.
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {rows.map((r, index) =>
                          !isMobileScreen ? (
                            <TableCell sx={{ fontSize: "10px" }}>{r.name}</TableCell>
                          ) : (
                            index !== 3 && <TableCell sx={{ fontSize: "10px" }}>{r.name}</TableCell>
                          ),
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(r => (
                        <TableRow
                          key={r.name}
                          sx={{ background: `${theme.colors.special.olyZaps}` }}
                          className="milk-table-row"
                        >
                          <TableCell>{r.staked}</TableCell>
                          <TableCell>{r.rewardDaily}</TableCell>
                          <TableCell>{r.apyNormal}</TableCell>
                          {!isMobileScreen && <TableCell>{r.apyCompound}</TableCell>}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div style={{ textAlign: "center" }}>
                    <Button sx={primaryButtonStyle} href={buyLink} target="_blank">
                      {" "}
                      Buy
                    </Button>
                  </div>
                </div>
                <img className="left-milk-img" src={MilkImage} />
              </div>
            </Grid>
            <Grid item md={5} sm={5} xs={12} className="right-milk-wrap">
              <div className="right-milk-content" style={{ width: "250px", fontSize: "18px", lineHeight: "24px" }}>
                <Typography fontWeight={700} fontSize={20} lineHeight={"48px"}>
                  Initial Supply:
                </Typography>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>Initial Supply: 1.2M</li>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>Marketing: 0.1M(8.33%)</li>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>Development: 0.1M(8.33%)</li>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>LP Pair: 1M $MILK + 10ETH</li>
                <Typography fontWeight={700} fontSize={20} lineHeight={"40px"}>
                  Max Wallet, Tx:
                </Typography>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>No limit</li>
                <Typography fontWeight={700} fontSize={20} lineHeight={"40px"}>
                  Tax:
                </Typography>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>Buy Tax: 0%</li>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>Transfer Tax: 0%</li>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>
                  Sell Tax: 25% (
                  <a
                    target="_blank"
                    href="https://docs.nodesynapse.org/milk#questions-on-caramel-usdcml"
                    style={{ color: "#fff" }}
                  >
                    why 25%
                  </a>
                  )
                </li>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>0% for reward sell</li>
                <Typography fontWeight={700} fontSize={20} lineHeight={"40px"}>
                  Tax Allocation:
                </Typography>
                <li style={{ lineHeight: "32px", fontSize: "16px" }}>100%: Add LP</li>
              </div>
            </Grid>
          </Grid>
        </div>
      </Box>
      <Divider />
      <Box className="full-width-container">
        <div className="main-content-wrap">
          <Typography className="subtitle section-title">ROADMAP</Typography>
          <div className="roadmap-all" style={{ marginTop: "32px" }}>
            {splitSteps.map(steps => {
              const isDone = steps[steps.length - 1].id < activeProgress;
              return SubRoadmap(steps, isDone);
            })}
          </div>
        </div>
      </Box>
      <Divider />
      <Box className="full-width-container">
        <div className="main-content-wrap">
          <Typography className="subtitle section-title" mb={4}>
            FAQS
          </Typography>
          {faqs.map(faq => (
            <Accordion style={{ marginTop: "16px" }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ background: `${theme.colors.paper.card}` }}
              >
                <Typography sx={{ fontSize: "24px", lineHeight: "36px", fontWeight: 500 }}>{faq.que}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontSize: "20px", lineHeight: "30px" }}>{faq.ans}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Box>
    </div>
  );
}

export default Landing;
