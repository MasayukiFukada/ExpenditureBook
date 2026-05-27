import SubscriptionList from "@/components/subscription-list";
import Link from "next/link";

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">サブスク管理</h1>
          <p className="text-sm text-muted-foreground">
            定期購読を登録・管理します
          </p>
        </div>
        <div>
          <Link href="/" className="border px-3 py-2 rounded-lg hover:bg-muted">
            トップへ戻る
          </Link>
        </div>
      </header>

      <SubscriptionList />
    </div>
  );
}
