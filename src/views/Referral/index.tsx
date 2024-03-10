import "src/views/Referral/referral.scss";
import { Box, Grid, InputAdornment, OutlinedInput, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Paper } from "@olympusdao/component-library";
import CopyLinkIcon from "src/assets/icons/copylink.png";
import PageTitle from "src/components/PageTitle";
import { MAIN_URL, getValidChainId } from "src/constants/data";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useAppSelector } from "src/hooks";
import rot13 from "src/lib/encode";
import { useAccount, useNetwork } from "wagmi";
import { LaunchCountdown } from "../Landing";
import { NetworkId } from "src/networkDetails";

function Referral() {
  const theme = useTheme();
  const { chain = { id: 8453 } } = useNetwork();

  const hidePaperSidePadding = useMediaQuery(theme.breakpoints.down("md"));

  const provider = Providers.getProviderUrl(getValidChainId(chain.id) as NetworkId);
  const { address = "", isConnected, isReconnecting } = useAccount();

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

  const Clipboard = () => {
    navigator.clipboard.writeText(`${MAIN_URL}mint?ref=${rot13(address)}`);
  };
  const nftReferrers = useAppSelector(state => {
    return state.account && state.account.nftReferrers;
  });
  const stakeReferrers = useAppSelector(state => {
    return state.account && state.account.stakeReferrers;
  });
  const totalUserNftRefAmounts = useAppSelector(state => {
    return state.account && state.account.totalNftRefAmounts;
  });
  const totalUserMilkRefAmounts = useAppSelector(state => {
    return state.account && state.account.totalMilkRefAmounts;
  });

  const totalNftReferralAmount = useAppSelector(state => {
    return state.app.totalNftReferralAmount;
  });
  const totalStakeReferralAmount = useAppSelector(state => {
    return state.app.totalStakeReferralAmount;
  });
  return (
    <>
      <Box className="referral-view">
        <PageTitle name="Referral" />
        <Grid container>
          <Grid item xs={12}>
            <Grid container columnSpacing={3}>
              <Grid item md={6} sm={12} style={{ flexBasis: "100%" }}>
                <Paper {...paperProps} style={paperStyles}>
                  <Box className="status-card">
                    <Typography className="title">NODE Referral</Typography>
                    <Box className="row">
                      <Typography className="key">Total Referral Amounts:</Typography>
                      {totalNftReferralAmount ? (
                        <Typography className="value">
                          {new Intl.NumberFormat("en-US").format(totalNftReferralAmount)} ETH
                        </Typography>
                      ) : (
                        <Skeleton width="100px" />
                      )}
                    </Box>
                    <Box className="row">
                      <Typography className="key">Your Referral Counts:</Typography>
                      {nftReferrers ? (
                        <Typography className="value">{nftReferrers.length}</Typography>
                      ) : (
                        <Skeleton width="100px" />
                      )}
                    </Box>
                    <Box className="row">
                      <Typography className="key">Your Referral Profits:</Typography>
                      {totalUserNftRefAmounts || totalUserNftRefAmounts == 0 ? (
                        <Typography className="value">{totalUserNftRefAmounts} ETH</Typography>
                      ) : (
                        <Skeleton width="100px" />
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item md={6} sm={12} style={{ flexBasis: "100%" }}>
                <Paper {...paperProps} style={paperStyles}>
                  <Box className="status-card">
                    <Typography className="title">Stake Referral</Typography>
                    <Box className="row">
                      <Typography className="key">Total Referral Amount:</Typography>
                      {totalStakeReferralAmount ? (
                        <Typography className="value">
                          ${new Intl.NumberFormat("en-US").format(totalStakeReferralAmount)} $MILK
                        </Typography>
                      ) : (
                        <Skeleton width="100px" />
                      )}
                    </Box>
                    <Box className="row">
                      <Typography className="key">Your Referral Counts:</Typography>
                      {stakeReferrers ? (
                        <Typography className="value">{stakeReferrers.length}</Typography>
                      ) : (
                        <Skeleton width="100px" />
                      )}
                    </Box>
                    <Box className="row">
                      <Typography className="key">Your Referral Profits:</Typography>
                      {totalUserMilkRefAmounts || totalUserMilkRefAmounts == 0 ? (
                        <Typography className="value">
                          {new Intl.NumberFormat("en-US").format(totalUserMilkRefAmounts)} $MILK
                        </Typography>
                      ) : (
                        <Skeleton width="100px" />
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
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
    </>
  );
}

export default Referral;
