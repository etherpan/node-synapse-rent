import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { useAccount } from 'wagmi';

export default function BasicTable() {
  const dispatch = useAppDispatch();
  const { address = "", isConnected } = useAccount();
  const totalNodeData = useAppSelector(state => state.adminPurchaseHistory.items);
  const rows = totalNodeData.filter(node => node.buyer_address === address);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='cell-name'>NODE</TableCell>
            <TableCell align="right" className='cell-name'>USER</TableCell>
            <TableCell align="right" className='cell-name'>RENTAL END</TableCell>
            <TableCell align="right" className='cell-name'>COST</TableCell>
            <TableCell align="right" className='cell-name'>RENT STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.node_no}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.node_no}
              </TableCell>
              <TableCell align="right">{row.buyer_info}</TableCell>
              <TableCell align="right">{(30 - ((new Date()).getTime() - new Date(row.purchase_date).getTime()) / (1000 * 60 * 60 * 24)).toFixed(2)} Days</TableCell>
              <TableCell align="right">{row.purchase}</TableCell>
              {row.rent_approve == 1 ?
                <TableCell align="right" style={{ color: "#00ff08" }}>{`Rented`}</TableCell>
                :
                <TableCell align="right" style={{ color: "#ffdb0a" }}>{`Pending`}</TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}