import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./lending.scss";
import { Skeleton } from "@material-ui/lab";
import BasicTable from "../Zap/BasicTable";
// import { IReduxState } from "../../store/slices/state.interface";
// import { IAppSlice } from "../../store/slices/app-slice";
// // import { useHistory } from "react-router-dom";
// import { usePathForNetwork, useWeb3Context } from "../../hooks";

function Dashboard() {
  // const history = useHistory();
  // const { chainID } = useWeb3Context();
  // usePathForNetwork({ pathName: "dashboard", networkID: chainID, history });

  // const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  // const app = useSelector<IReduxState, IAppSlice>(state => state.app);

  return (
    <div className="dashboard-view">
      <div className="dashboard-infos-wrap">
        {/* <Zoom in={true}> */}
        <Grid container spacing={4}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Node Price</p>
              <p className="card-value">$234244</p>
            </div>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Node Price</p>
              <p className="card-value">$234244</p>
            </div>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Node Price</p>
              <p className="card-value">$234244</p>
            </div>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Node Price</p>
              <p className="card-value">$234244</p>
            </div>
          </Grid>
        </Grid>

        {/* </Zoom> */}
      </div>
      <div className="dashboard-infos-wrap" style={{ paddingTop: "30px" }}>
        {/* <Zoom in={true}> */}
        {/* </Zoom> */}
        <Grid item lg={12} md={12} sm={12} xs={12} spacing={4}>
          <div className="dashboard-card">
            <BasicTable />
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Dashboard;