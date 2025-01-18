"use client";

import React, { useState, useEffect } from 'react';
import { useClient } from "@/context/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Select,
  SelectItem,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";

// 定义交易数据的类型
type Transaction = {
  unique: number;
  amount: string;
  numeric_code: number;
  remarks?: string;
  occurrence_at: number;
  created_at: number;
  updated_at: number;
};

export const TransactionList = () => {
  const { client, isClientReady } = useClient(); // 获取 isClientReady
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure(); // 控制弹窗的显示和隐藏

  // 获取交易列表
  const fetchTransactions = async () => {
    try {
      const response = await client.finance.transactionList(0); // 假设有一个获取交易列表的接口
      if (response) {
        setTransactions(response);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isClientReady) return; // 如果 client 未准备好，直接返回

    const fetchTransactions = async () => {
      try {
        const response = await client.finance.transactionList(0);
        if (response) {
          setTransactions(response);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [client, isClientReady]); // 依赖 isClientReady

  // 定义表格列
  const columns = [
    { key: 'amount', label: 'AMOUNT' },
    { key: 'numeric_code', label: 'CURRENCY' },
    { key: 'remarks', label: 'REMARKS' },
    { key: 'occurrence_at', label: 'OCCURRENCE AT' },
    { key: 'created_at', label: 'CREATED AT' },
  ];

  // 格式化时间戳为可读日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // 根据列键获取对应的值
  const getKeyValue = (item: Transaction, columnKey: string | number) => {
    switch (columnKey) {
      case 'amount':
        return item.amount;
      case 'numeric_code':
        return item.numeric_code;
      case 'remarks':
        return item.remarks || 'N/A';
      case 'occurrence_at':
        return formatDate(item.occurrence_at);
      case 'created_at':
        return formatDate(item.created_at);
      default:
        return 'N/A';
    }
  };

  return (
    <div>
      {/* 添加按钮 */}
      <div className="flex justify-end mb-4">
        <Button color="primary" onPress={onOpen}>
          Add Transaction
        </Button>
      </div>

      {/* 交易表格 */}
      <Table aria-label="Transactions table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={transactions} isLoading={isLoading}>
          {(item) => (
            <TableRow key={item.unique}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 弹窗 */}
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Transaction</ModalHeader>
              <ModalBody>
                <CreateTransaction
                  onClose={onClose}
                  onSuccess={fetchTransactions} // 表单提交成功后刷新交易列表
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export const CreateTransaction = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const { client } = useClient();

  const [currencies, setCurrencies] = useState<{ code: number; symbol: string }[]>([]);
  const [amount, setAmount] = useState<number | null>(null);
  const [numericCode, setNumericCode] = useState<number | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [occurrenceAt, setOccurrenceAt] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      const response = await client.finance.currencyList();
      setCurrencies(response);
    };

    fetchCurrencies();
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount === null || numericCode === null) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await client.finance.createTransaction(
        amount,
        numericCode,
        remarks,
        occurrenceAt
      );

      if (response) {
        alert('Transaction created successfully!');
        // 重置表单
        setAmount(null);
        setNumericCode(null);
        setRemarks('');
        setOccurrenceAt(null);
        onClose(); // 关闭弹窗
        onSuccess(); // 刷新交易列表
      } else {
        alert('Failed to create transaction.');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('An error occurred while creating the transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Amount"
        placeholder="0.00"
        type="number"
        value={amount !== null ? amount.toString() : ''}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        required
      />

      <Select
        label="Currency"
        placeholder="Select a currency"
        value={numericCode !== null ? numericCode.toString() : ''}
        onChange={(e) => setNumericCode(parseInt(e.target.value))}
        required
      >
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol}
          </SelectItem>
        ))}
      </Select>

      <Input
        label="Remarks"
        placeholder="Optional remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      <Input
        label="Occurrence At"
        type="datetime-local"
        value={occurrenceAt !== null ? new Date(occurrenceAt).toISOString().slice(0, 16) : ''}
        onChange={(e) => setOccurrenceAt(new Date(e.target.value).getTime())}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};