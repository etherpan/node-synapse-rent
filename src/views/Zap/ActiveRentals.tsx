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

interface ActiveRentalsProps {
  totalNode: INodeItem[]; // Ensure this matches the filtered totalNode type
}

interface INodeItem {
  node_createDate: any;
  node_name: string;
  status: number;
  node_no: number;
  seller_address: string;
  node_ip: string;
  node_cpu: string;
  node_gpu: string;
  gpu_capacity: number;
  cpu_capacity: number;
  node_download: any;
  node_upload: any;
  node_usage: any;
  node_price: number;
  approve: number;
}


const ActiveRentals: React.FC = () => {
  const { address = "", isConnected } = useAccount();


  const totalPurchaseData = useAppSelector(state => state.adminPurchaseHistory.items);

  const rows = totalPurchaseData 
    ? totalPurchaseData.filter(node => node.buyer_address === address && node.status === 3) 
    : [];

  interface PurchaseData {
    purchase_date: string,
    purchase: number,
    purchase_tx: string,
    seller_info: string,
    seller_address: string,
    buyer_address: string,
    buyer_info: string,
    node_name: string,
    node_no: string,
    gpu_capacity: number,
    node_price: number,
    node_createDate: string,
    approve: number,
    status: number,
    ssh_key: string,
    ssh_username: string,
    node_ip: string,
  }

  const uniqueActiveRows = [];
  for (let i = 0; i < rows.length; i++) {
    let isDuplicate = false;
    for (let j = 0; j < uniqueActiveRows.length; j++) {
      if (rows[i].node_no === uniqueActiveRows[j].node_no) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      uniqueActiveRows.push(rows[i]);
    }
  }
  
  function shortenString(str: string, maxLength: number = 10): string {
    if (str.length <= maxLength) {
      return str;
    }
    const halfLength = Math.floor(maxLength / 2);
    return `${str.slice(0, halfLength)}...${str.slice(-halfLength)}`;
  }

  const [copiedSshUser, setCopiedSshUser] = useState<boolean[]>(new Array(totalPurchaseData?.length ?? 0).fill(false));
  const copySshUserToClipboard = (address: string, rowIndex: number) => {
    navigator.clipboard.writeText(address);
    setCopiedSshUser(prevState => prevState.map((copied, index) => index === rowIndex));
  };
  
  const [copiedSshKey, setCopiedSshKey] = useState<boolean[]>(new Array(totalPurchaseData?.length ?? 0).fill(false));
  const copySshKeyToClipboard = (address: string, rowIndex: number) => {
    navigator.clipboard.writeText(address);
    setCopiedSshKey(prevState => prevState.map((copied, index) => index === rowIndex));
  };

  const [copiedNodeIp, setCopiedNodeIp] = useState<boolean[]>(new Array(totalPurchaseData?.length ?? 0).fill(false));
  const copyNodeIpToClipboard = (address: string, rowIndex: number) => {
    navigator.clipboard.writeText(address);
    setCopiedNodeIp(prevState => prevState.map((copied, index) => index === rowIndex));
  };


  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className='cell-name'>NAME</TableCell>
              <TableCell align="right" className='cell-name'>RENTAL PERIOD</TableCell>
              <TableCell align="right" className='cell-name'>TIME LEFT</TableCell>
              <TableCell align="right" className='cell-name'>COST</TableCell>
              <TableCell align="right" className='cell-name'>TX</TableCell>
              <TableCell align="right" className='cell-name'>SSH/WIN USER NAME</TableCell>
              <TableCell align="right" className='cell-name'>SSH KEY / PASSWORD</TableCell>
              <TableCell align="right" className='cell-name'>NODE IP</TableCell>
              <TableCell align="right" className='cell-name'>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uniqueActiveRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.node_name}
                </TableCell>
                <TableCell align="right">{ } 30 days</TableCell>
                <TableCell align="right">{(30 - ((new Date()).getTime() - new Date(row.purchase_date).getTime()) / (1000 * 60 * 60 * 24)).toFixed(2)}</TableCell>
                <TableCell align="right">{row.purchase.toFixed(6)} ETH</TableCell>
                <TableCell align="right" >{shortenString(row.purchase_tx)}</TableCell>
                {/* <TableCell align="right">{shortenString(row.ssh_username)}</TableCell> */}
                <TableCell align="right"
                  onClick={() => { copySshUserToClipboard(row.ssh_username, index); }} style={{ cursor: 'pointer' }}>
                  {copiedSshUser[index] ? "Copied!" : shortenString(row.ssh_username)}
                </TableCell>
                <TableCell align="right"
                  onClick={() => { copySshKeyToClipboard(row.ssh_key, index); }} style={{ cursor: 'pointer' }}>
                  {copiedSshKey[index] ? "Copied!" : shortenString(row.ssh_key)}
                </TableCell>
                <TableCell align="right"
                  onClick={() => { copyNodeIpToClipboard(row.node_ip, index); }} style={{ cursor: 'pointer' }}>
                  {copiedNodeIp[index] ? "Copied!" : shortenString(row.node_ip)}
                </TableCell>
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

export default ActiveRentals;