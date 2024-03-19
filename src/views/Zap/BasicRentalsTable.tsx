import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppSelector } from 'src/hooks';
import { useAccount } from 'wagmi';
import { EthPrice } from 'src/hooks/usePrices';
import NotFound from '../404/NotFound';
import { Grid } from '@mui/material';

export default function BasicTable() {
  const { address = "", isConnected } = useAccount();
  // const totalNodeData = useAppSelector(state => state.accountGallery.items);
  const totalNodeData = useAppSelector(state => state.adminPurchaseHistory.items);
  const rows = totalNodeData.filter(node => node.seller_address.toLowerCase() === address.toLowerCase());

  // const 
  // useEffect(() => {
  //   setActiveGallery(rows);
  // },[rows]);
  console.log('debug totalNodeData', rows, totalNodeData, address)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='cell-name'>NODE</TableCell>
            <TableCell align="right" className='cell-name'>NODE NAME</TableCell>
            <TableCell align="right" className='cell-name'>USER</TableCell>
            <TableCell align="right" className='cell-name'>RENTAL END</TableCell>
            <TableCell align="right" className='cell-name'>COST</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length == 0 &&
            <Grid pl={2}>Not Found</Grid>
          }
          {rows.map((row) => (
            <TableRow
              key={row.node_no}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.node_no}
              </TableCell>
              <TableCell align="right">{row.node_name}</TableCell>
              <TableCell align="right">{row.buyer_info}</TableCell>
              <TableCell align="right">{(30 - ((new Date()).getTime() - new Date(row.purchase_date).getTime()) / (1000 * 60 * 60 * 24)).toFixed(2)} Days</TableCell>
              <TableCell align="right">{row.purchase} ETH</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}