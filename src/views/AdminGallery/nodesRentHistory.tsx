import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { BASEURL } from 'src/constants';

export default function BasicTable() {
  const { address = "", isConnected } = useAccount();
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
  const [totalPurchaseData, setData] = React.useState<PurchaseData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/node/adminpurchase`);
        setData(response.data.items);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();

    // Clean-up function
    return () => {
      // Any clean-up code here
    };
  }, []);

  const [copied, setCopied] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const [copiedRows, setCopiedRows] = useState<boolean[]>(new Array(totalPurchaseData?.length ?? 0).fill(false));

  const copyAddressToClipboard = (address: string, rowIndex: number) => {
    navigator.clipboard.writeText(address);
    setCopiedRows(prevState => prevState.map((copied, index) => index === rowIndex));
  };

  const shortenEthereumAddress = (address: string): string => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      throw new Error("Invalid Ethereum address");
    }
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='cell-name'>NODE NAME</TableCell>
            <TableCell align="left" className='cell-name'>PURCHASE DATE</TableCell>
            <TableCell align="left" className='cell-name'>SELLER ADDRESS</TableCell>
            <TableCell align="left" className='cell-name'>SELLER TELEGRAM</TableCell>
            <TableCell align="left" className='cell-name'>BUYER ADDRESS</TableCell>
            <TableCell align="left" className='cell-name'>BUYER TELEGRAM</TableCell>
            <TableCell align="left" className='cell-name'>NODE PRICE</TableCell>
            <TableCell align="left" className='cell-name'>PURCHASE ETH</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totalPurchaseData && totalPurchaseData.map((row, index) => (
            <TableRow
              key={row.node_no}
              selected={index === selectedRow}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align='left'>{row.node_name}</TableCell>
              <TableCell align="left">{row.node_createDate.slice(0, -5)}</TableCell>
              <TableCell
                align="left"
                onClick={() => copyAddressToClipboard(row.seller_address, index)}
                style={{ cursor: 'pointer' }}
              >
                {copiedRows[index] ? "Copied!" : shortenEthereumAddress(row.seller_address)}
              </TableCell>
              <TableCell align="left">{row.seller_info}</TableCell>
              {/* <TableCell align="left">{row.buyer_address ? row.buyer_address : "- - -"}</TableCell> */}
              <TableCell
                align="left"
                onClick={() => copyAddressToClipboard(row.buyer_address, index)}
                style={{ cursor: 'pointer' }}
              >
                {copiedRows[index] ? "Copied!" : shortenEthereumAddress(row.buyer_address)}
              </TableCell>
              <TableCell align="left">{row.buyer_info ? row.buyer_info : "- - -"}</TableCell>
              <TableCell align="left">$ {row.node_price}</TableCell>
              <TableCell align="left">$ {row.purchase} ETH</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
