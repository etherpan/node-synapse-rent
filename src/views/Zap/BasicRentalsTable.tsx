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

function createData(
  name: string,
  user: number,
  rentalDate: number,
  cost: string,
) {
  return { name, user, rentalDate, cost };
}

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, '24'),
//   createData('Ice cream sandwich', 237, 9.0, '37'),
//   createData('Eclair', 262, 16.0, '24'),
//   createData('Cupcake', 305, 3.7, '67'),
//   createData('Gingerbread', 356, 16.0, '49'),
// ];

export default function BasicTable() {
  const { address = "", isConnected } = useAccount();
  const totalNodeData = useAppSelector(state => state.accountGallery.items);
  const rows = totalNodeData.filter(node => node.seller_address === address);
  const currentTime = new Date();

  const timeDifference = currentTime - rows.purchase_date;

  // Convert the difference to the desired unit (assuming unit is in milliseconds)
  const usedTime = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days

  // Define the fixed duration (30 units)
  const fixedDuration = 30;

  // Calculate the remaining time
  const restTime = fixedDuration - usedTime;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>NODE</TableCell>
            <TableCell align="right">USER</TableCell>
            <TableCell align="right">RENTAL END</TableCell>
            <TableCell align="right">COST</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}