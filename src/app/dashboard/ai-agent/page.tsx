"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  Users,
  Layout,
  MessageSquare,
  BarChart3,
  Mail,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/clinic-context";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "ai",
    content:
      "こんにちは！NEXOS AI採用エージェントです。求人票の作成、候補者分析、採用ページの改善など、採用に関するあらゆるタスクをお手伝いします。何をしましょうか？",
    timestamp: "10:00",
  },
  {
    id: "2",
    role: "user",
    content: "新しい看護師の求人票を作成したい",
    timestamp: "10:01",
  },
  {
    id: "3",
    role: "ai",
    content:
      "看護師の求人票を作成しますね。以下の情報を提案します：\n\n**職種名**: 正看護師（病棟勤務）\n**勤務形態**: 常勤\n**給与**: 年収450万〜600万円\n**必要資格**: 正看護師免許\n\n詳細な要件をカスタマイズしますか？",
    timestamp: "10:01",
  },
  {
    id: "4",
    role: "user",
    content: "給与を500万〜650万に変更して",
    timestamp: "10:02",
  },
  {
    id: "5",
    role: "ai",
    content:
      "給与レンジを更新しました。求人票のプレビューを生成中です...\n\nこの求人票は、同地域の看護師求人の平均年収（480万円）を上回っており、競争力のある条件です。公開しますか？",
    timestamp: "10:02",
  },
];

const capabilities = [
  {
    icon: Sparkles,
    title: "求人票AI生成",
    description: "AIが最適な求人票を自動生成",
    gradient: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
  },
  {
    icon: Users,
    title: "候補者スコアリング",
    description: "応募者と求人のマッチング分析",
    gradient: "from-violet-500 to-fuchsia-500",
    bg: "bg-violet-50",
  },
  {
    icon: Layout,
    title: "採用ページ最適化",
    description: "AIがページ改善を提案",
    gradient: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-50",
  },
  {
    icon: MessageSquare,
    title: "選考アシスタント",
    description: "面接質問・評価テンプレート生成",
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "レポート生成",
    description: "採用データの自動分析・レポート",
    gradient: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-50",
  },
  {
    icon: Mail,
    title: "メール文面作成",
    description: "候補者への連絡文を自動生成",
    gradient: "from-teal-500 to-cyan-500",
    bg: "bg-teal-50",
  },
];

const recentActivities = [
  { action: "求人票「正看護師」を生成", time: "2分前", status: "completed" },
  { action: "候補者3名のマッチングスコアを算出", time: "15分前", status: "completed" },
  { action: "採用ページのSEO改善提案を作成", time: "1時間前", status: "completed" },
  { action: "面接質問テンプレートを生成中", time: "2時間前", status: "in_progress" },
];

const suggestionChips = [
  "求人票を作成",
  "候補者を分析",
  "採用ページを改善",
  "レポートを生成",
];

export default function AIAgentPage() {
  const { currentClinic } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          "承知しました。リクエストを処理しています。少々お待ちください...\n\n" +
          currentClinic.name +
          "のデータを分析中です。",
        timestamp: new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleChipClick = (chip: string) => {
    setInputValue(chip);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ));
    });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI採用エージェント</h1>
            <p className="text-sm text-muted-foreground">
              {currentClinic.name}の採用活動をAIがサポートします
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-0 shadow-sm flex flex-col" style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b bg-gradient-to-r from-indigo-50 to-violet-50">
              <div className="relative">
                <div className="p-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">NEXOS AI エージェント</p>
                <p className="text-xs text-emerald-600">オンライン</p>
              </div>
              <Badge variant="accent" className="text-xs">
                Claude搭載
              </Badge>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="shrink-0 mr-2 mt-1">
                      <div className="p-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-br-lg"
                        : "bg-white border shadow-sm rounded-bl-lg"
                    }`}
                  >
                    <div>{renderMessageContent(msg.content)}</div>
                    <div
                      className={`text-[10px] mt-1.5 ${
                        msg.role === "user" ? "text-indigo-200" : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestion Chips */}
            <div className="px-5 py-2 border-t bg-white">
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
                  >
                    <Zap className="h-3 w-3" />
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="AIエージェントにメッセージを送信..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  variant="accent"
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Capabilities Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Capabilities */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                AIエージェント機能
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {capabilities.map((cap, index) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <button className="w-full group flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-all cursor-pointer text-left">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${cap.gradient} shrink-0`}>
                      <cap.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{cap.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {cap.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
                  </button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-500" />
                最近のアクティビティ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="relative mt-1.5">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          activity.status === "completed"
                            ? "bg-emerald-400"
                            : "bg-amber-400 animate-pulse"
                        }`}
                      />
                      {index < recentActivities.length - 1 && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">{activity.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
