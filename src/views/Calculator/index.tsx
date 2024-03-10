import "src/views/Calculator/calculator.scss";

import { Box, Grid, MenuItem, Select, Slider, Typography, useTheme } from "@mui/material";
import { InfoNotification, SwapCard } from "@olympusdao/component-library";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { useAppSelector } from "src/hooks";
import { getDailyAPRByUser, getExtraDailyAPRByLevel } from "src/views/NftItem";

function getLevel(level: string) {
  if (level == "COMMON") {
    return 0;
  } else if (level == "GOLD") {
    return 1;
  } else if (level == "PLANTIUM") {
    return 2;
  } else {
    return 3;
  }
}

function Calculator() {
  const milkBalance = useAppSelector(state => Number(state.account.balances.milk));
  const [milkAmount, setMilkAmount] = useState("0");
  const theme = useTheme();

  const [stakeDays, setStakeDays] = useState(30);
  const [compDays, setCompDays] = useState("1");

  const [apr, setApr] = useState("0");
  const [reward, setReward] = useState("0");

  const [level, setLevel] = useState("COMMON");

  useEffect(() => {
    const levelAsNumber = getLevel(level);
    const extraRate = getExtraDailyAPRByLevel(levelAsNumber, false);
    const dailyRate = getDailyAPRByUser(Number(milkAmount)) + extraRate;
    const pendingDays = Number(compDays) > stakeDays ? 1 : stakeDays / Number(compDays);
    const myApr =
      Number(compDays) == 0
        ? (dailyRate * stakeDays) / 100
        : (1 + (dailyRate * Number(compDays)) / 100) ** pendingDays - 1;
    // setApr(Number(milkAmount) ? (myApr * 100).toFixed(2) : "0");
    setReward((myApr * Number(milkAmount)).toFixed(2));
  }, [milkAmount, stakeDays, compDays, level]);

  return (
    <Box className="calculator-view">
      <PageTitle name="Calculator" />
      <Grid container>
        <Grid item xs={12} className="calculator-wrap">
          <Box className="calculator-card" style={{ background: `${theme.colors.gray[700]}` }}>
            <Typography mt={3} fontSize={28} fontWeight={600} mb={2}>
              Estimate Your Returns
            </Typography>
            <InfoNotification style={{ color: "#FFFFFF" }}>
              Visit{" "}
              <NavLink to={"https://docs.nodesynapse.org/nodesynapse"} style={{ color: "#FFFFFF" }} target="_blank">
                our documentation
              </NavLink>{" "}
              for more details.
            </InfoNotification>
            {/* <Box className="row"> */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <div className="calculator-card-wrap">
                  <p className="calculator-card-title">
                    STAKE <span style={{ color: "#1aded1" }}>{milkAmount}</span> $MILK
                  </p>
                  <div style={{ border: "1px solid", borderRadius: "12px" }}>
                    <SwapCard
                      id="ohm-amount"
                      key="ohmAmount"
                      inputProps={{ "data-testid": "ohm-amount" }}
                      name={"ohmAmount"}
                      value={milkAmount}
                      onChange={event => setMilkAmount(event.currentTarget.value)}
                      endString={`Max`}
                      endStringOnClick={() => setMilkAmount(milkBalance.toString())}
                      // token="MILK"
                      type="string"
                      info={`Balance: ${new Intl.NumberFormat("en-US").format(milkBalance)} $MILK`}
                      disabled={false}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="calculator-card-wrap">
                  <p className="calculator-card-title">
                    COMPOUND EVERY <span style={{ color: "1aded1" }}>{compDays}</span>{" "}
                    {`DAY${Number(compDays) > 1 ? "s" : ""}`}
                  </p>
                  <div style={{ border: "1px solid", borderRadius: "12px" }}>
                    <SwapCard
                      id="ohm-amount"
                      key="ohmAmount"
                      inputProps={{ "data-testid": "ohm-amount" }}
                      name={"ohmAmount"}
                      value={compDays}
                      onChange={event => setCompDays(event.currentTarget.value)}
                      // endString={`Max`}
                      // endStringOnClick={() => setMilkAmount(milkBalance.toString())}
                      // token="MILK"
                      type="string"
                      info={`DAY${Number(compDays) > 1 ? "s" : ""}`}
                      disabled={false}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="calculator-card-wrap">
                  <p className="calculator-card-title">
                    CLAIM AFTER <span style={{ color: "1aded1" }}>{stakeDays}</span> DAY{`${stakeDays > 1 ? "s" : ""}`}
                  </p>
                  <div style={{ border: "0px solid", borderRadius: "12px", padding: "10px" }}>
                    <Slider
                      className="calculator-days-slider"
                      min={1}
                      max={365}
                      value={stakeDays}
                      style={{ color: "#FFFFFF", marginTop: "10px", maxWidth: "70%" }}
                      onChange={(e, newValue: any) => setStakeDays(newValue)}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} marginLeft="auto" marginRight="auto">
                <p className="calculator-card-title">
                  STAKE ON <span style={{ color: "1aded1" }}>{level}</span> LEVEL
                </p>
                <Select
                  value={level}
                  onChange={event => setLevel(event.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value={"COMMON"}>COMMON</MenuItem>
                  <MenuItem value={"GOLD"}>GOLD</MenuItem>
                  <MenuItem value={"PLANTIUM"}>PLANTIUM</MenuItem>
                  <MenuItem value={"DIAMOND"}>DIAMOND</MenuItem>
                </Select>
              </Grid>
            </Grid>
            {/* <Box className="row" paddingX={3} paddingTop={3}>
              <Typography fontSize={20}>APR</Typography>
              <Typography fontSize={20}>{apr} %</Typography>
            </Box> */}
            {/* </Box> */}
            <Box className="row" padding={3}>
              <Typography fontSize={20}>Reward</Typography>
              <Typography fontSize={20} color="1aded1">
                {reward} $MILK
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Calculator;
