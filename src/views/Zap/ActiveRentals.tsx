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
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import { red } from '@mui/material/colors';

function createData(
  name: string,
  gpu: number,
  pricePerHour: number,
  createdAt: string,
  approved: number,
  status: number,
) {
  return { name, gpu, pricePerHour, createdAt, approved, status };
}


// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, '24', 4.0, 2),
//   createData('Ice cream sandwich', 237, 9.0, '37', 4.3, 3),
//   createData('Eclair', 262, 16.0, '24', 6.0, 3),
//   createData('Cupcake', 305, 3.7, '67', 4.3, 4),
//   createData('Gingerbread', 356, 16.0, '49', 3.9, 55),
// ];

export default function BasicTable() {
  const { address = "", isConnected } = useAccount();
  const totalNodeData = useAppSelector(state => state.adminGallery.items);
  const rows = totalNodeData.filter(node => node.seller_address === address);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='cell-name'>NAME</TableCell>
            <TableCell align="right" className='cell-name'>GPU AMOUNT</TableCell>
            <TableCell align="right" className='cell-name'>PRICE PER HOUR</TableCell>
            <TableCell align="right" className='cell-name'>CREATED AT</TableCell>
            <TableCell align="right" className='cell-name'>APPROVED</TableCell>
            <TableCell align="right" className='cell-name'>STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.node_no}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.node_name}
              </TableCell>
              <TableCell align="right">{row.gpu_capacity}</TableCell>
              <TableCell align="right">$ {row.node_price}</TableCell>
              <TableCell align="right">{row.node_createDate.slice(0, -5)}</TableCell>
              {row.approve == 1 ?
                <TableCell align="right"><DoneTwoToneIcon color="success"/></TableCell>
                :
                <TableCell align="right"><DoneTwoToneIcon sx={{ color: red[500] }}/></TableCell>
              }
              {row.status == 1 ?
                <TableCell align="right">ONLINE</TableCell>
                :
                <TableCell align="right" style={{ color: "#00ff08" }}>ONLINE</TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}