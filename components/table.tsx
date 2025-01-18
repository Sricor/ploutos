"use client";

import React, { useState, useEffect } from "react";
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
  const [currencies, setCurrencies] = useState<Currency[]>([]); // 货币列表状态
  const { isOpen, onOpen, onClose } = useDisclosure(); // 控制弹窗的显示和隐藏

  const fetchData = async () => {
    try {
      // 并行获取交易列表和货币列表
      const [transactionsResponse, currenciesResponse] = await Promise.all([
        client.finance.transactionList(0), // 获取交易列表
        client.finance.currencyList(), // 获取货币列表
      ]);

      if (transactionsResponse) {
        setTransactions(transactionsResponse); // 设置交易列表
      }
      if (currenciesResponse) {
        setCurrencies(currenciesResponse); // 设置货币列表
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false); // 无论成功或失败，都关闭加载状态
    }
  };

  // 获取交易列表和货币列表
  useEffect(() => {
    if (!isClientReady) return; // 如果 client 未准备好，直接返回

    fetchData();
  }, [client, isClientReady]); // 依赖 client 和 isClientReady

  // 定义表格列
  const columns = [
    { key: "amount", label: "AMOUNT" },
    { key: "numeric_code", label: "CURRENCY" },
    { key: "remarks", label: "REMARKS" },
    { key: "occurrence_at", label: "OCCURRENCE AT" },
    { key: "created_at", label: "CREATED AT" },
  ];

  // 格式化时间戳为可读日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // 根据货币代码获取货币符号
  const getCurrencySymbol = (code: number) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : code; // 如果找不到，返回代码
  };

  // 根据列键获取对应的值
  const getKeyValue = (item: Transaction, columnKey: string | number) => {
    switch (columnKey) {
      case "amount":
        return item.amount;
      case "numeric_code":
        return getCurrencySymbol(item.numeric_code); // 显示货币符号
      case "remarks":
        return item.remarks || "N/A";
      case "occurrence_at":
        return formatDate(item.occurrence_at);
      case "created_at":
        return formatDate(item.created_at);
      default:
        return "N/A";
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
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={transactions} isLoading={isLoading}>
          {(item) => (
            <TableRow key={item.unique}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
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
                  onSuccess={fetchData} // 表单提交成功后刷新交易列表
                  currencies={currencies}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

type Currency = {
  code: number;
  symbol: string;
};

type CreateTransactionProps = {
  onClose: () => void;
  onSuccess: () => void;
  currencies: Currency[]; // 接收父组件传递的货币列表
};

export const CreateTransaction = ({
  onClose,
  onSuccess,
  currencies,
}: CreateTransactionProps) => {
  const { client } = useClient();
  const [amount, setAmount] = useState<number | null>(null);
  const [numericCode, setNumericCode] = useState<number | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [occurrenceAt, setOccurrenceAt] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount === null || numericCode === null) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await client.finance.createTransaction(
        amount,
        numericCode,
        remarks,
        occurrenceAt,
      );

      if (response) {
        alert("Transaction created successfully!");
        setAmount(null);
        setNumericCode(null);
        setRemarks("");
        setOccurrenceAt(null);
        onClose();
        onSuccess();
      } else {
        alert("Failed to create transaction.");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("An error occurred while creating the transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <Input
        label="Amount"
        placeholder="0.00"
        type="number"
        value={amount !== null ? amount.toString() : ""}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        required
        fullWidth
      />

      <Select
        label="Currency"
        placeholder="Select a currency"
        value={numericCode !== null ? numericCode.toString() : ""}
        onChange={(e) => setNumericCode(parseInt(e.target.value))}
        required
        fullWidth
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
        fullWidth
      />

      <Input
        label="Occurrence At"
        placeholder="Optional remarks"
        type="datetime-local"
        onChange={(e) => setOccurrenceAt(new Date(e.target.value).getTime())}
        fullWidth
      />

      <Button type="submit" disabled={isSubmitting} color="primary" fullWidth>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>

      <Button onPress={onClose} fullWidth>
        Cancel
      </Button>
    </form>
  );
};
