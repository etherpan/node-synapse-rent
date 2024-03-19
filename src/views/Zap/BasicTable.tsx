import React, { useEffect, useState } from "react";
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
import { Button } from '@mui/material';
import EditNodeModal from './EditNodeModal';


export default function BasicTable() {
  const { address = "", isConnected } = useAccount();
  const totalNodeData = useAppSelector(state => state.adminGallery.items);
  const rows = totalNodeData.filter(node => node.seller_address === address);
  const [index, setIndex] = useState(0);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  
  const handleNodeModalOpen = (index : any) => {
    setNodeModalOpen(true);
    setIndex(index);
  }

  interface INodeItem {
    ssh_key: string;
    ssh_hostname: string;
    ssh_username: string;
    seller_info: string;
    node_name: string;
    node_no: number;
    seller_address: string;
    node_cpu: string;
    node_gpu: string;
    gpu_capacity: number;
    cpu_capacity: number;
    node_download: any;
    node_upload: any;
    node_usage: any;
    node_price: number;
    approve: number;
    status: number;
    node_ip: string;
  }
  
  return (
    <>
      <EditNodeModal
        handleClose={() => setNodeModalOpen(false)}
        modalOpen={nodeModalOpen}
        currentNode={rows[index] as unknown as INodeItem}
      />
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
              <TableCell align="left" className='cell-name'>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
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
                  <TableCell align="right"><DoneTwoToneIcon color="success" /></TableCell>
                  :
                  <TableCell align="right"><DoneTwoToneIcon sx={{ color: red[500] }} /></TableCell>
                }
                {row.status == 1 ?
                  <TableCell align="right">ONLINE</TableCell>
                  :
                  <TableCell align="right" style={{ color: "#00ff08" }}>ONLINE</TableCell>
                }
                <TableCell>
                  <Button onClick={() => handleNodeModalOpen(index)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}