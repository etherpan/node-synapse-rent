import "src/views/Gallery/gallery.scss";

import { Sort } from "@mui/icons-material";
import {
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo, useRef, useState } from "react";
import LoadingIcon from "src/assets/icons/loading.gif";
import NodeCard from "src/components/NodeCard";
import PageTitle from "src/components/PageTitle";
import { NUMBER_OF_GALLER_VISIBLE } from "src/constants/data";
import { useAppSelector } from "src/hooks";
import NotFound from "../404/NotFound";
import { accounts } from "src/testWagmiUtils";
import { connect } from "http2";
// import

function Gallery() {
  const theme = useTheme();

  const isAppLoading = useAppSelector(state => state.app.loading);
  const galleryDate = useAppSelector(state => state.adminGallery.items);
  const listGalleryDate = useMemo(() => galleryDate.filter(node => node.status != 0 || node.approve === 1),[galleryDate]);
  
  const [activeGallery, setActiveGallery] = useState([
    {
      node_no: 0,
      seller_address: "",
      node_ip: "",
      node_cpu: "",
      node_gpu: "",
      gpu_capacity: 0,
      cpu_capacity: 0,
      node_download: 0,
      node_upload: 0,
      node_usage: 0,
      node_price: 0,
      approve: 0,
      status: 0,
    },
  ]);
  const [desc, setDesc] = useState(true);

  useEffect(() => {
    setActiveGallery(listGalleryDate);
  },[listGalleryDate]);
  
  const [name, setName] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filterQuery, setFilterQuery] = useState<string>("1");
  const handleQueryChange = (event: SelectChangeEvent) => {
    setFilterQuery(event.target.value as string);
    sortGallery(parseInt(event.target.value));
  };

  const [loading, setLoading] = useState<boolean>(false);

  function sortGallery(value: number) {
    switch (value) {
      case 1:
        setActiveGallery(
          listGalleryDate.slice().sort((a, b) => (a.node_price > b.node_price ? (desc ? -1 : 1) : desc ? 1 : -1)),
        );
        return;
      case 2:
        setActiveGallery(listGalleryDate.slice().sort((a, b) => (a.gpu_capacity > b.gpu_capacity ? (desc ? -1 : 1) : desc ? 1 : -1)));
        return;
      case 3:
        setActiveGallery(listGalleryDate.slice().sort((a, b) => (a.gpu_capacity > b.cpu_capacity ? (desc ? -1 : 1) : desc ? 1 : -1)));
        return;
      case 4:
        setActiveGallery(
          listGalleryDate.slice().sort((a, b) => (a.gpu_capacity > b.gpu_capacity ? (desc ? -1 : 1) : desc ? 1 : -1)),
        );
        return;
    }
  }

  useEffect(() => {
    sortGallery(parseInt(filterQuery));
  }, [desc, filterQuery, listGalleryDate]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [numberOfGalleryVisible, setNumberOfGalleryVisible] = useState(9);

  const chosenNUMBER_OF_GALLER_VISIBLE = useRef(0);
  const [observerIsSet, setObserverIsSet] = useState(false);
  const chosenGalleryMemoized = activeGallery.slice(0, numberOfGalleryVisible);

  useEffect(() => {
    const showMoreGallery: IntersectionObserverCallback = entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setNumberOfGalleryVisible(farmsCurrentlyVisible => {
          if (farmsCurrentlyVisible <= chosenNUMBER_OF_GALLER_VISIBLE.current) {
            return farmsCurrentlyVisible + NUMBER_OF_GALLER_VISIBLE;
          }
          return farmsCurrentlyVisible;
        });
      }
    };

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreGallery, {
        rootMargin: "0px",
        threshold: 1,
      });
      loadMoreObserver.observe(loadMoreRef.current as Element);
      setObserverIsSet(true);
    }
  }, [observerIsSet]);

  return (
    <div className="gallery-view">
      <PageTitle name="Nodes" />
      <div className="gallery-infos-row">
        <Box display={"flex"} className="gallery-sort-box">
          <FormControl>
            <Select
              value={filterQuery}
              onChange={handleQueryChange}
              placeholder="Filter Options"
              style={{ color: `${theme.colors.primary[300]}`, marginLeft: "8px", marginRight: "8px", width: "160px" }}
            >
              <MenuItem disabled value={0}>
                <em>Filter Options</em>
              </MenuItem>
              <MenuItem value={1}>Filter By Price</MenuItem>
              <MenuItem value={2}>Filter By GPU</MenuItem>
              {/* <MenuItem value={3}>Filter By Level</MenuItem>
              <MenuItem value={4}>Filter By Stakers</MenuItem> */}
            </Select>
          </FormControl>
          <Box>
            <IconButton onClick={() => setDesc(!desc)}>
              <Sort style={{ rotate: `${desc ? "270deg" : "90deg"}` }} />
            </IconButton>
          </Box>
        </Box>
      </div>
      <div className="gallery-infos-wrap">
        <div className="gallery-infos-nfts">
          {!loading && (
            <>
              <Grid container rowSpacing={{ xs: 1, sm: 2, md: 4 }} pr={4} style={{ justifyContent: "center" }}>
                {chosenGalleryMemoized.length == 0 ? (
                  <NotFound />
                ) : (
                  chosenGalleryMemoized.map((node, index) => (
                    <Grid key={index} item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <NodeCard
                        node_no={node.node_no}
                        node_cpu={node.node_cpu}
                        seller_address={node.seller_address}
                        node_ip={node.node_ip}
                        node_gpu={node.node_gpu}
                        gpu_capacity={node.gpu_capacity}
                        cpu_capacity={node.cpu_capacity}
                        node_download={node.node_download}
                        node_upload={node.node_upload}
                        node_price={node.node_price}
                        approve={node.approve}
                        status={node.status}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </>
          )}
          <div ref={loadMoreRef} />
        </div>
      </div>
    </div>
  );
}

export default Gallery;
