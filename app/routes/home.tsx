// صفحه لندینگ (فعلاً ساده)
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold text-brand-500">NexChat AI</h1>
      <p className="text-tx-s">به پلتفرم هوش مصنوعی خوش آمدید.</p>
      <Link to="/chat" className="px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition">
        شروع چت 
      </Link>
    </div>
  );
}