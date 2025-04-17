// ✅ Add email notification via EmailJS
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

// 🔧 EmailJS config
const EMAILJS_SERVICE_ID = "your_service_id";
const EMAILJS_TEMPLATE_ID = "your_template_id";
const EMAILJS_USER_ID = "your_user_id";

type WatchItem = {
  symbol: string;
  targetPrice: number;
  email: string;
};

export default function Page() {
  const [watchlist, setWatchlist] = useState<WatchItem[]>([]);
  const [symbol, setSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    const interval = setInterval(() => {
      watchlist.forEach(stock => {
        axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${stock.symbol}`)
          .then(res => {
            const result = res.data.quoteResponse.result[0];
            const currentPrice = result?.regularMarketPrice;
            if (currentPrice !== undefined && currentPrice <= stock.targetPrice) {
              const alertMsg = `${stock.symbol} dropped to $${currentPrice} (target: $${stock.targetPrice})`;
              setAlerts(prev => [...prev, alertMsg]);

              // ✅ Send email notification
              if (stock.email) {
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                  to_email: stock.email,
                  subject: "Stock Alert",
                  message: alertMsg
                }, EMAILJS_USER_ID);
              }
            }
          });
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const handleAdd = () => {
    if (symbol && targetPrice && email) {
      const item: WatchItem = {
        symbol: symbol.trim().toUpperCase(),
        targetPrice: parseFloat(targetPrice),
        email
      };
      setWatchlist(prev => [...prev, item]);
      setSymbol("");
      setTargetPrice("");
      setEmail("");
    }
  };

  const handleClear = () => {
    setWatchlist([]);
    setAlerts([]);
    localStorage.removeItem("watchlist");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">📈 股票价格监控系统 + 邮件提醒</h1>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="股票代码 (如 AAPL / HARTA.KL)" value={symbol} onChange={e => setSymbol(e.target.value)} />
        <Input placeholder="目标价 (如 100.00)" type="number" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} />
        <Input placeholder="电子邮件地址" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Button onClick={handleAdd}>加入监控</Button>
        <Button onClick={handleClear}>清空</Button>
      </div>

      <div>
        <h2 className="font-semibold">🕵️ 当前监控列表：</h2>
        {watchlist.length === 0 && <p className="text-sm text-gray-500">没有加入任何股票。</p>}
        {watchlist.map((item, idx) => (
          <Card key={idx} className="my-2">
            <CardContent>
              {item.symbol} — 目标价：${item.targetPrice.toFixed(2)} — 📧 {item.email}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-semibold">🚨 触发提醒：</h2>
        {alerts.length === 0 && <p className="text-sm text-gray-400">尚未触发任何提醒</p>}
        {alerts.map((alert, idx) => (
          <p key={idx} className="text-red-500">{alert}</p>
        ))}
      </div>
    </div>
  );
}
