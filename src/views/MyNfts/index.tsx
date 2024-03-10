import "src/views/MyNfts/mynfts.scss";

import { Box, Button, Grid, SvgIcon, Typography, useTheme, Zoom } from "@mui/material";
import { useState } from "react";
import { ReactComponent as LeftIcon } from "src/assets/icons/left.svg";
import { ReactComponent as NoNFTIcon } from "src/assets/icons/no-nfts.svg";
import { ReactComponent as RightIcon } from "src/assets/icons/right.svg";
import { ReactComponent as WhiteLogoIcon } from "src/assets/icons/white-logo.svg";
import PageTitle from "src/components/PageTitle";
import UCowCard from "src/components/UCowCard";
import { useAppSelector } from "src/hooks";

function MyNfts() {
  const theme = useTheme();
  const availableNfts = useAppSelector(state => {
    return state.account.nft;
  });
  const ownedNfts = useAppSelector(state => {
    return state.account.ownedNfts;
  });
  const gallery = useAppSelector(state => {
    return state.gallery.nfts;
  });

  const [open, setOpen] = useState(false);

  const [nftId, setNftId] = useState("");

  const handleOpen = (id: string) => {
    setNftId(id);
    setOpen(true);
    if (typeof window !== "undefined") {
      window.location.href = window.location.origin + "/nftitem?id=" + id;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="mynfts-view">
        <PageTitle name="My NFTs" />
        <div className="mynfts-infos-wrap" style={{ marginBottom: "32px" }}>
          {availableNfts == undefined || availableNfts.length == 0 ? (
            <Box
              display={"flex"}
              mt={4}
              alignItems={"center"}
              width={"100%"}
              justifyContent={"center"}
              position={"relative"}
            >
              <SvgIcon component={NoNFTIcon} viewBox="0 0 401 399" style={{ width: "354px", height: "350px" }} />
              <Box position={"absolute"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                <SvgIcon component={WhiteLogoIcon} viewBox="0 0 155 193" style={{ width: "150px", height: "152px" }} />
                <Typography fontSize={24} fontWeight={800}>
                  You Don't Own Any NFTs.
                </Typography>
                <Box display={"flex"} justifyContent={"space-between"} mt={1}>
                  <SvgIcon component={LeftIcon} viewBox="0 0 110 74" style={{ width: "90px", height: "45px" }} />
                  <Button
                    style={{
                      height: "50px",
                      width: "200px",
                      borderRadius: "25px",
                      background: `${theme.colors.primary[300]}`,
                      color: "white",
                      fontWeight: "400",
                      fontSize: "18px",
                    }}
                    href="/nodes"
                  >
                    View Gallery
                  </Button>
                  <SvgIcon component={RightIcon} viewBox="0 0 110 74" style={{ width: "90px", height: "45px" }} />
                </Box>
              </Box>
            </Box>
          ) : (
            <Zoom in={true}>
              <Grid container spacing={4}>
                {availableNfts.map(nft => (
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <UCowCard
                      nftId={nft.toString()}
                      level={gallery[nft - 1].level}
                      totalStakers={gallery[nft - 1].totalStakers}
                      totalStaked={gallery[nft - 1].totalStakedAmount}
                      owner={gallery[nft - 1].owner}
                      handleOpen={handleOpen}
                    />
                  </Grid>
                ))}
              </Grid>
            </Zoom>
          )}
        </div>
      </div>
    </>
  );
}

export default MyNfts;
