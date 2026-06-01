"use client";

import React, { useEffect, useState, useRef } from "react";
import { Subscription, PlanHistoryEntry } from "@/types";

const STATUS_OPTIONS = [
  { value: "active", label: "アクティブ" },
  { value: "trial", label: "トライアル" },
  { value: "past_due", label: "支払い遅延" },
  { value: "canceled", label: "キャンセル" },
  { value: "paused", label: "一時停止" },
  { value: "expired", label: "期限切れ" },
  { value: "pending", label: "保留" },
];

const BILLING_UNIT_OPTIONS = [
  { value: "day", label: "日次" },
  { value: "week", label: "週次" },
  { value: "month", label: "月次" },
  { value: "year", label: "年次" },
  { value: "custom", label: "カスタム" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "credit_card", label: "クレジットカード" },
  { value: "bank_transfer", label: "銀行振込" },
  { value: "invoice", label: "請求書" },
  { value: "paypal", label: "PayPal" },
];

const HISTORY_REASON_OPTIONS = [
  { value: "initial_subscription", label: "初回登録" },
  { value: "upgrade", label: "アップグレード" },
  { value: "downgrade", label: "ダウングレード" },
  { value: "price_change", label: "価格変更" },
  { value: "manual", label: "手動" },
  { value: "auto_renew", label: "自動更新" },
];

function getStatusLabel(v?: string) {
  return STATUS_OPTIONS.find((o) => o.value === v)?.label || v || "-";
}

function getBillingUnitLabel(v?: string) {
  return BILLING_UNIT_OPTIONS.find((o) => o.value === v)?.label || v || "-";
}

function getPaymentMethodLabel(v?: string) {
  return PAYMENT_METHOD_OPTIONS.find((o) => o.value === v)?.label || v || "-";
}

function generateId() {
  return (globalThis as any).crypto?.randomUUID
    ? (globalThis as any).crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export default function SubscriptionList() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [tagsText, setTagsText] = useState("");
  const topRef = useRef<HTMLDivElement | null>(null);

  const emptyForm: Partial<Subscription> = {
    name: "",
    provider: "",
    category: "サブスク",
    status: "active",
    account: { login_id: "", associated_email: "" },
    contract: {
      plan_name: "",
      price: 0,
      currency: "JPY",
      billing_cycle: { unit: "month", interval: 1 },
      auto_renew: true,
    },
    schedule: {
      start_date: "",
      next_billing_date: "",
      cancellation_deadline: "",
    },
    payment: { method: "", last4: "", provider: "" },
    meta: { tags: [], url: "" },
    plan_history: [],
  };

  const emptyHistoryForm: Partial<PlanHistoryEntry> = {
    plan_name: "",
    price: 0,
    currency: "JPY",
    billing_cycle: { unit: "month", interval: 1 },
    start_date: "",
    end_date: null,
    reason: "manual",
    metadata: {},
  };

  const [form, setForm] = useState<Partial<Subscription>>(emptyForm);
  const [historyForm, setHistoryForm] =
    useState<Partial<PlanHistoryEntry>>(emptyHistoryForm);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    setLoading(true);
    const res = await fetch("/api/subscriptions");
    const json = await res.json();
    if (json.success) setItems(json.subscriptions);
    setLoading(false);
  }

  function updateForm(path: string, value: any) {
    setForm((prev) => {
      const next = { ...(prev || {}) } as any;
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!cur[p]) cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function updateHistoryForm(path: string, value: any) {
    setHistoryForm((prev) => {
      const next = { ...(prev || {}) } as any;
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!cur[p]) cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function openEdit(sub: Subscription) {
    setEditingId(sub.id);
    setEditingHistoryId(null);
    // populate form
    const clone: Partial<Subscription> = JSON.parse(JSON.stringify(sub));
    setTagsText(
      clone.meta && clone.meta.tags && Array.isArray(clone.meta.tags)
        ? clone.meta.tags.join(",")
        : "",
    );
    setForm(clone);
    setHistoryForm(emptyHistoryForm);
    // scroll to top of component where form is
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setTagsText("");
    setHistoryForm(emptyHistoryForm);
    setEditingHistoryId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // prepare payload
    const payload: any = { ...form };

    // billing_cycle ensure object
    if (payload.contract && payload.contract.billing_cycle) {
      const bc = payload.contract.billing_cycle;
      if (typeof bc === "string") {
        const map: any = {
          monthly: { unit: "month", interval: 1 },
          monthly1: { unit: "month", interval: 1 },
          yearly: { unit: "year", interval: 1 },
        };
        payload.contract.billing_cycle = map[bc] || { unit: bc, interval: 1 };
      } else {
        payload.contract.billing_cycle = {
          unit: bc.unit || "month",
          interval: Number(bc.interval) || 1,
        };
      }
    }

    // ensure numeric price
    if (payload.contract && payload.contract.price !== undefined) {
      payload.contract.price = Number(payload.contract.price);
    }

    // tags
    if (tagsText) {
      payload.meta = payload.meta || {};
      payload.meta.tags = tagsText
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

    // payment last4 compatibility
    payload.payment = payload.payment || {};
    const last4 = payload.payment.last4 || payload.payment.last_4_digits || "";
    if (last4) {
      payload.payment.last4 = String(last4);
      payload.payment.last_4_digits = String(last4);
    }

    // ensure category default
    payload.category = payload.category || "サブスク";

    // include id if editing
    if (editingId) payload.id = editingId;

    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      const saved: Subscription = json.subscription;
      if (editingId) {
        setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
      } else {
        setItems((prev) => [saved, ...prev]);
      }
      cancelEdit();
    } else {
      alert("保存に失敗しました");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("削除してもよいですか？")) return;
    const res = await fetch("/api/subscriptions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (json.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) cancelEdit();
    } else {
      alert("削除に失敗しました");
    }
  }

  function openHistoryEdit(entry: PlanHistoryEntry) {
    setEditingHistoryId(entry.id);
    setHistoryForm({ ...entry });
  }

  function resetHistoryForm() {
    setEditingHistoryId(null);
    setHistoryForm(emptyHistoryForm);
  }

  function addOrUpdateHistory(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const entry: any = { ...(historyForm || {}) };
    // ensure numeric price
    if (entry.price !== undefined) entry.price = Number(entry.price);
    // ensure billing_cycle structure
    if (entry.billing_cycle && typeof entry.billing_cycle === "string") {
      entry.billing_cycle = { unit: entry.billing_cycle, interval: 1 };
    } else if (entry.billing_cycle) {
      entry.billing_cycle = {
        unit: entry.billing_cycle.unit || "month",
        interval: Number(entry.billing_cycle.interval) || 1,
      };
    } else {
      entry.billing_cycle = { unit: "month", interval: 1 };
    }

    if (!form.plan_history) form.plan_history = [];

    if (editingHistoryId) {
      // update existing
      const idx = form.plan_history.findIndex(
        (p: any) => p.id === editingHistoryId,
      );
      if (idx !== -1) {
        entry.id = editingHistoryId;
        entry.created_at =
          form.plan_history[idx].created_at || new Date().toISOString();
        form.plan_history[idx] = entry;
      }
    } else {
      // add new
      entry.id = generateId();
      entry.created_at = new Date().toISOString();
      form.plan_history.unshift(entry);
    }

    // trigger state update
    setForm({ ...form });
    resetHistoryForm();
  }

  function removeHistory(id: string) {
    if (!confirm("履歴を削除してもよいですか？")) return;
    if (!form.plan_history) return;
    form.plan_history = form.plan_history.filter((p: any) => p.id !== id);
    setForm({ ...form });
    if (editingHistoryId === id) resetHistoryForm();
  }

  return (
    <div ref={topRef}>
      <div className="bg-card p-4 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold mb-3">
          {editingId ? "サブスクを編集" : "サブスクを追加"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            className="input"
            placeholder="サービス名"
            value={form.name || ""}
            onChange={(e) => updateForm("name", e.target.value)}
          />
          <input
            className="input"
            placeholder="提供元"
            value={form.provider || ""}
            onChange={(e) => updateForm("provider", e.target.value)}
          />
          <input
            className="input"
            placeholder="カテゴリ"
            value={form.category || "サブスク"}
            onChange={(e) => updateForm("category", e.target.value)}
          />

          <select
            className="input"
            value={form.status || "active"}
            onChange={(e) => updateForm("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <input
            className="input"
            placeholder="アカウント: ログインID"
            value={form.account?.login_id || ""}
            onChange={(e) => updateForm("account.login_id", e.target.value)}
          />
          <input
            className="input"
            placeholder="アカウント: 連絡先メール"
            value={form.account?.associated_email || ""}
            onChange={(e) =>
              updateForm("account.associated_email", e.target.value)
            }
          />

          <input
            className="input"
            placeholder="プラン名"
            value={form.contract?.plan_name || ""}
            onChange={(e) => updateForm("contract.plan_name", e.target.value)}
          />
          <input
            className="input"
            placeholder="価格（例: 10.00）"
            type="number"
            step="0.01"
            value={
              form.contract?.price !== undefined
                ? String(form.contract.price)
                : ""
            }
            onChange={(e) => updateForm("contract.price", e.target.value)}
          />

          <input
            className="input"
            placeholder="通貨（例: USD）"
            value={form.contract?.currency || "JPY"}
            onChange={(e) => updateForm("contract.currency", e.target.value)}
          />

          <div className="flex gap-2">
            <select
              className="input flex-1"
              value={form.contract?.billing_cycle?.unit || "month"}
              onChange={(e) =>
                updateForm("contract.billing_cycle.unit", e.target.value)
              }
            >
              {BILLING_UNIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              className="input w-24"
              placeholder="間隔"
              type="number"
              value={String(form.contract?.billing_cycle?.interval ?? 1)}
              onChange={(e) =>
                updateForm(
                  "contract.billing_cycle.interval",
                  Number(e.target.value),
                )
              }
            />
          </div>

          <label className="flex items-center gap-2 p-1">
            <input
              type="checkbox"
              checked={!!form.contract?.auto_renew}
              onChange={(e) =>
                updateForm("contract.auto_renew", e.target.checked)
              }
            />{" "}
            自動更新
          </label>

          <input
            className="input"
            placeholder="契約開始日（YYYY-MM-DD）"
            value={form.contract?.effective_from || ""}
            onChange={(e) =>
              updateForm("contract.effective_from", e.target.value)
            }
          />

          <input
            className="input"
            placeholder="スケジュール: 開始日（YYYY-MM-DD）"
            value={form.schedule?.start_date || ""}
            onChange={(e) => updateForm("schedule.start_date", e.target.value)}
          />
          <input
            className="input"
            placeholder="次回請求日（YYYY-MM-DD）"
            value={form.schedule?.next_billing_date || ""}
            onChange={(e) =>
              updateForm("schedule.next_billing_date", e.target.value)
            }
          />
          <input
            className="input"
            placeholder="解約期限（YYYY-MM-DD）"
            value={form.schedule?.cancellation_deadline || ""}
            onChange={(e) =>
              updateForm("schedule.cancellation_deadline", e.target.value)
            }
          />

          <select
            className="input"
            value={form.payment?.method || ""}
            onChange={(e) => updateForm("payment.method", e.target.value)}
          >
            {PAYMENT_METHOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="カード下4桁"
            value={form.payment?.last4 || form.payment?.last_4_digits || ""}
            onChange={(e) => updateForm("payment.last4", e.target.value)}
          />

          <input
            className="input md:col-span-2"
            placeholder="メモ/URL"
            value={form.meta?.url || ""}
            onChange={(e) => updateForm("meta.url", e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="タグ（カンマ区切り）"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />

          <div className="md:col-span-2 flex gap-2">
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
              type="submit"
            >
              {editingId ? "更新" : "追加"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg border"
              onClick={() => {
                if (editingId) cancelEdit();
                else {
                  setForm(emptyForm);
                  setTagsText("");
                }
              }}
            >
              {editingId ? "キャンセル" : "リセット"}
            </button>
          </div>
        </form>

        {/* プラン履歴編集セクション（編集モード時のみ表示） */}
        {editingId && (
          <div className="mt-6 bg-card p-4 rounded-lg border">
            <h4 className="text-lg font-medium mb-3">プラン履歴</h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addOrUpdateHistory();
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <input
                className="input"
                placeholder="プラン名"
                value={historyForm.plan_name || ""}
                onChange={(e) => updateHistoryForm("plan_name", e.target.value)}
              />
              <input
                className="input"
                placeholder="価格（例: 10.00）"
                type="number"
                step="0.01"
                value={
                  historyForm.price !== undefined
                    ? String(historyForm.price)
                    : ""
                }
                onChange={(e) => updateHistoryForm("price", e.target.value)}
              />
              <input
                className="input"
                placeholder="通貨（例: USD）"
                value={historyForm.currency || "JPY"}
                onChange={(e) => updateHistoryForm("currency", e.target.value)}
              />

              <div className="flex gap-2">
                <select
                  className="input flex-1"
                  value={historyForm.billing_cycle?.unit || "month"}
                  onChange={(e) =>
                    updateHistoryForm("billing_cycle.unit", e.target.value)
                  }
                >
                  {BILLING_UNIT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  className="input w-24"
                  placeholder="間隔"
                  type="number"
                  value={String(historyForm.billing_cycle?.interval ?? 1)}
                  onChange={(e) =>
                    updateHistoryForm(
                      "billing_cycle.interval",
                      Number(e.target.value),
                    )
                  }
                />
              </div>

              <input
                className="input"
                placeholder="開始日（YYYY-MM-DD）"
                value={historyForm.start_date || ""}
                onChange={(e) =>
                  updateHistoryForm("start_date", e.target.value)
                }
              />
              <input
                className="input"
                placeholder="終了日（YYYY-MM-DD、未設定は空欄)"
                value={historyForm.end_date || ""}
                onChange={(e) => updateHistoryForm("end_date", e.target.value)}
              />

              <select
                className="input"
                value={historyForm.reason || "manual"}
                onChange={(e) => updateHistoryForm("reason", e.target.value)}
              >
                {HISTORY_REASON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <div className="md:col-span-3 flex gap-2">
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
                  type="button"
                  onClick={() => addOrUpdateHistory()}
                >
                  {editingHistoryId ? "履歴を更新" : "履歴を追加"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => resetHistoryForm()}
                >
                  リセット
                </button>
              </div>
            </form>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2">プラン</th>
                    <th className="p-2">価格</th>
                    <th className="p-2">請求周期</th>
                    <th className="p-2">期間</th>
                    <th className="p-2">理由</th>
                    <th className="p-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {(form.plan_history || []).map((ph: any) => (
                    <tr key={ph.id} className="border-t">
                      <td className="p-2 align-top">
                        <div className="font-medium">{ph.plan_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {ph.currency}
                        </div>
                      </td>
                      <td className="p-2 align-top">
                        {ph.price !== undefined
                          ? Number(ph.price).toLocaleString()
                          : "-"}{" "}
                        {ph.currency || ""}
                      </td>
                      <td className="p-2 align-top">
                        {getBillingUnitLabel(ph.billing_cycle?.unit)}
                        {ph.billing_cycle?.interval &&
                        ph.billing_cycle?.interval > 1
                          ? ` / ${ph.billing_cycle.interval}`
                          : ""}
                      </td>
                      <td className="p-2 align-top">
                        {ph.start_date || "-"} ～ {ph.end_date || "現在"}
                      </td>
                      <td className="p-2 align-top">
                        {HISTORY_REASON_OPTIONS.find(
                          (o) => o.value === ph.reason,
                        )?.label || ph.reason}
                      </td>
                      <td className="p-2 align-top">
                        <button
                          className="px-2 py-1 rounded border text-sm mr-2"
                          onClick={() => {
                            navigator.clipboard?.writeText(JSON.stringify(ph));
                            alert("コピーしました");
                          }}
                        >
                          コピー
                        </button>
                        <button
                          className="px-2 py-1 rounded border text-sm mr-2"
                          onClick={() => openHistoryEdit(ph)}
                        >
                          編集
                        </button>
                        <button
                          className="px-2 py-1 rounded border text-sm text-red-600"
                          onClick={() => removeHistory(ph.id)}
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">
          登録済みサブスク{loading ? "（読み込み中）" : ""}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2">サービス</th>
                <th className="p-2">プラン</th>
                <th className="p-2">価格</th>
                <th className="p-2">請求周期</th>
                <th className="p-2">次回請求日</th>
                <th className="p-2">支払方法</th>
                <th className="p-2">状態</th>
                <th className="p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2 align-top">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.provider}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.account?.login_id || ""}
                    </div>
                  </td>
                  <td className="p-2 align-top">{s.contract?.plan_name}</td>
                  <td className="p-2 align-top">
                    {s.contract?.price
                      ? s.contract.price.toLocaleString()
                      : "-"}{" "}
                    {s.contract?.currency || ""}
                  </td>
                  <td className="p-2 align-top">
                    {getBillingUnitLabel(s.contract?.billing_cycle?.unit)}
                    {s.contract?.billing_cycle?.interval &&
                    s.contract?.billing_cycle?.interval > 1
                      ? ` / ${s.contract?.billing_cycle?.interval}`
                      : ""}
                  </td>
                  <td className="p-2 align-top">
                    {s.schedule?.next_billing_date || "-"}
                  </td>
                  <td className="p-2 align-top">
                    {getPaymentMethodLabel(s.payment?.method)}
                  </td>
                  <td className="p-2 align-top">{getStatusLabel(s.status)}</td>
                  <td className="p-2 align-top">
                    <button
                      className="px-2 py-1 rounded border text-sm mr-2"
                      onClick={() => {
                        navigator.clipboard?.writeText(JSON.stringify(s));
                        alert("コピーしました");
                      }}
                    >
                      コピー
                    </button>
                    <button
                      className="px-2 py-1 rounded border text-sm mr-2"
                      onClick={() => openEdit(s)}
                    >
                      編集
                    </button>
                    <button
                      className="px-2 py-1 rounded border text-sm text-red-600"
                      onClick={() => handleDelete(s.id)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
