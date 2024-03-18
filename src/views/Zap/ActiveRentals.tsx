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
import axios from 'axios';
import EditNodeModal from './EditNodeModal';
import { BASEURL } from 'src/constants';
import { INodeItem } from 'src/slices/GallerySlice';

interface ActiveRentalsProps {
  totalNode: INodeItem[];
}

export default function ActiveRentals({ totalNode }: ActiveRentalsProps) {
  const { address = "", isConnected } = useAccount();
  // const totalNodeData = useAppSelector(state => state.adminGallery.items);
  // const rows = totalNodeData.filter(node => node.seller_address === address);

  // const purchaseNodeData = useAppSelector(state => state.)
  interface PurchaseData {
    purchase: string;
    seller_info: string;
    seller_address: string;
    buyer_address: string,
    buyer_info: string,
    node_name: string;
    node_no: string,
    gpu_capacity: number,
    node_price: number,
    node_createDate: string,
    approve: number,
    status: number,
  }

  const rows = totalNode ? totalNode.filter(node => node.seller_address === address) : [];
  const [customNode, setCustomNode] = useState(rows);


  const handleNodeModalOpen = (rows: INodeItem) => setNodeModalOpen(true);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  
  return (
    <>
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
                  <TableCell align="right"><DoneTwoToneIcon color="success" /></TableCell>
                  :
                  <TableCell align="right"><DoneTwoToneIcon sx={{ color: red[500] }} /></TableCell>
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
    </>
  );
}