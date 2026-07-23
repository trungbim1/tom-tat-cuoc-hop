# 🎙️ MeetMind AI - Privacy-First Meeting Summarizer (NotebookLM Alternative)

Công cụ tóm tắt biên bản cuộc họp từ tệp **Âm thanh (Audio)** hoặc **Video** với tính năng bảo mật thông tin tuyệt đối. Giao diện hiện đại, tự động trích xuất danh sách việc cần làm (Action Items), các quyết định quan trọng và trợ lý hỏi đáp thông minh (Grounding Chat) với trích dẫn mốc thời gian (timestamp).

---

## 🔒 Đảm bảo An toàn & Bảo mật Thông tin (Data Privacy)

1. **Chế độ 100% Client-Side (Local Mode)**:
   - Tất cả tiến trình tách giọng nói (Audio Speech Recognition) và phân tích đều chạy trực tiếp trong trình duyệt bằng WebAssembly/WebGPU.
   - Không có bất kỳ dữ liệu âm thanh, video hay văn bản nào gửi ra máy chủ trung gian.
2. **Chế độ BYOK (Bring Your Own Key)**:
   - Nếu muốn tốc độ cực nhanh với mô hình lớn, bạn có thể dùng API Key riêng (Groq / OpenAI / Cloudflare Workers AI).
   - API Key được lưu duy nhất trong `localStorage` trên trình duyệt của bạn, không bao giờ gửi tới server bên thứ ba nào ngoại trừ API chính thức do bạn chỉ định.
3. **Lưu trữ bảo mật**:
   - Biên bản và transcript được lưu vào cơ sở dữ liệu `IndexedDB` cục bộ trên trình duyệt. Bạn có thể xóa dữ liệu bất kỳ lúc nào với 1 cú nhấp chuột.

---

## 🚀 Hướng dẫn Đẩy Code lên GitHub và Gắn vào Website Cloudflare

### Bước 1: Khởi tạo Git và đẩy code lên GitHub
Mở terminal tại thư mục dự án và chạy các lệnh:

```bash
git init
git add .
git commit -m "Initial commit: MeetMind AI Privacy Meeting Summarizer"
git branch -M main
git remote add origin https://github.com/TEN_TAI_KHOAN_CUA_BAN/meetmind-ai-privacy.git
git push -u origin main
```

---

### Bước 2: Gắn ứng dụng vào Cloudflare Pages

#### Cách 1: Kết nối trực tiếp qua Giao diện Cloudflare (Khuyên dùng - Nhanh nhất)
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Chọn mục **Workers & Pages** -> Nhấn **Create Application** -> chọn thẻ **Pages** -> **Connect to Git**.
3. Chọn Repository `meetmind-ai-privacy` vừa đẩy lên GitHub.
4. Cấu hình Build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Nhấn **Save and Deploy**. Cloudflare sẽ tự động build và cấp cho bạn một tên miền miễn phí (ví dụ: `meetmind-ai-privacy.pages.dev`).

#### Cách 2: Tự động Deploy qua GitHub Actions
1. Vào Cloudflare Dashboard -> **My Profile** -> **API Tokens** -> Tạo Token cấp quyền Cloudflare Pages.
2. Trên GitHub Repository: Vào **Settings** -> **Secrets and variables** -> **Actions**.
3. Thêm 2 Secrets:
   - `CLOUDFLARE_API_TOKEN`: Token vừa tạo.
   - `CLOUDFLARE_ACCOUNT_ID`: Account ID trên Cloudflare.
4. Mỗi khi bạn `git push` lên GitHub, GitHub Actions sẽ tự động deploy bản mới nhất lên Cloudflare Pages.

---

### Bước 3: Gắn Tên miền riêng (Custom Domain) trên Cloudflare
1. Trong giao diện Cloudflare Pages của dự án `meetmind-ai-privacy`.
2. Chuyển sang thẻ **Custom domains** -> Chọn **Set up a custom domain**.
3. Nhập tên miền của bạn (ví dụ: `meeting.yoursite.com`).
4. Cloudflare sẽ tự động cấu hình DNS và cấp chứng chỉ SSL HTTPS hoàn toàn miễn phí.

---

## 🛠️ Công nghệ sử dụng
- **Core**: React 18, Vite
- **UI & Icon**: Custom Glassmorphism CSS design system, Lucide Icons
- **Xuất file**: jsPDF (Xuất báo cáo PDF trực tiếp ở client)
- **Deployment**: Cloudflare Pages / GitHub Actions

---

## 📄 Giấy phép
Dự án phát hành theo giấy phép MIT.
