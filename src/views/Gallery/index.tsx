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
import React, { useEffect, useRef, useState } from "react";
import LoadingIcon from "src/assets/icons/loading.gif";
import NodeCard from "src/components/NodeCard";
import PageTitle from "src/components/PageTitle";
import { NUMBER_OF_GALLER_VISIBLE } from "src/constants/data";
import { useAppSelector } from "src/hooks";
// import

function Gallery() {
  const theme = useTheme();

  const isAppLoading = useAppSelector(state => state.app.loading);
  const gallery = useAppSelector(state => state.gallery.items);

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
    },
  ]);
  const [desc, setDesc] = useState(true);

  useEffect(() => {
    setActiveGallery(gallery);
  }, [gallery]);

  const [name, setName] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filterQuery, setFilterQuery] = useState<string>("1");
  const handleQueryChange = (event: SelectChangeEvent) => {
    setFilterQuery(event.target.value as string);
    sortGallery(parseInt(event.target.value));
  };

  const [loading, setLoading] = useState<boolean>(false);

  // const searchAddress = async (name: string) => {
  //   setLoading(true);
  //   // const data = loadAccountDetails({ networkID: chainID, provider, address: name });
  //   setActiveGallery(gallery.filter(nft => nft.owner.toLowerCase() === name.toLowerCase()));
  //   // setNfts(data.nft);
  //   // setQuery(name)
  //   setLoading(false);
  // };

  const searchID = async (name: string[]) => {
    setLoading(true);
    for (let i = 0; i < name.length; i++) {
      if (parseInt(name[i]) > NUMBER_OF_GALLER_VISIBLE) {
        return;
      }
      setActiveGallery(gallery.filter(node => node.node_price.toString() == name[i]));
    }
    // const data = await loadIdDetails({ networkID: chainID, provider, id: name });
    // setNfts(name);
    setLoading(false);
  };

  const isNameArray = (name: string) => {
    if (!name) return false;
    if (!name.startsWith("[")) return false;
    if (!name.endsWith("]")) return false;
    let content = name.substring(1, name.length - 1);
    content = content.replace(" ", "");
    const ids = content.split(",");
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      if (parseInt(id) <= 0 || parseInt(id) > NUMBER_OF_GALLER_VISIBLE * 1) return false;
    }
    searchID(ids);
    setQuery("query");
    setName([]);
    return true;
  };

  const [open, setOpen] = useState(false);

  const [nftId, setNftId] = useState("");

  const handleOpen = (id: string) => {
    setNftId(id);
    setOpen(true);
    if (typeof window !== "undefined") {
      window.location.href = window.location.origin + "/nftitem?id=" + id;
    }
  };

  function sortGallery(value: number) {
    switch (value) {
      case 1:
        setActiveGallery(
          gallery.slice().sort((a, b) => (a.node_price > b.node_price ? (desc ? -1 : 1) : desc ? 1 : -1)),
        );
        return;
      case 2:
        setActiveGallery(gallery.slice().sort((a, b) => (a.gpu_capacity > b.gpu_capacity ? (desc ? -1 : 1) : desc ? 1 : -1)));
        return;
      case 3:
        setActiveGallery(gallery.slice().sort((a, b) => (a.gpu_capacity > b.cpu_capacity ? (desc ? -1 : 1) : desc ? 1 : -1)));
        return;
      case 4:
        setActiveGallery(
          gallery.slice().sort((a, b) => (a.gpu_capacity > b.gpu_capacity ? (desc ? -1 : 1) : desc ? 1 : -1)),
        );
        return;
    }
  }

  useEffect(() => {
    sortGallery(parseInt(filterQuery));
  }, [desc, filterQuery, gallery]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [numberOfGalleryVisible, setNumberOfGalleryVisible] = useState(9);
  
  const chosenNUMBER_OF_GALLER_VISIBLE = useRef(0);
  const [observerIsSet, setObserverIsSet] = useState(false);
  const chosenGalleryMemoized = activeGallery.slice(0, numberOfGalleryVisible);
  
  chosenNUMBER_OF_GALLER_VISIBLE.current = chosenGalleryMemoized.length;

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
          {loading && (
            <div className="gallery-infos-loading">
              <CircularProgress color="secondary" size={80} />
            </div>
          )}
          {!loading && (
            <Grid container rowSpacing={{ xs: 1, sm: 2, md: 4 }} pr={4}>
              {chosenGalleryMemoized.length == 0 ? (
                <>
                  <img src={LoadingIcon} width={200} height={200} style={{ margin: "auto", marginTop: "100px" }} />
                </>
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
                      node_usage={node.node_usage}
                      node_price={node.node_price}
                      approve={node.approve}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          )}
          <div ref={loadMoreRef} />
        </div>
      </div>
    </div>
  );
}

export default Gallery;
