-- SQL script để import 15 sản phẩm mẫu vào Supabase
-- Chạy script này trong Supabase SQL Editor

INSERT INTO public.products (
  slug, name, category, image_url, status,
  description_markdown, offerings
) VALUES

-- 1. Netflix Premium
(
  'netflix-premium',
  'Netflix Premium',
  'entertainment',
  'assets/banner-product/Netflix.png',
  'inStock',
  $$## Giới thiệu gói Netflix Premium

Trải nghiệm kho nội dung khổng lồ của Netflix với chất lượng **Ultra HD** và âm thanh vòm. Tài khoản được nâng cấp chính chủ, bảo hành trọn gói trong suốt thời gian sử dụng.

### Điểm nổi bật

- Xem **không giới hạn phim, series, show truyền hình** mới nhất
- Tối đa **4 thiết bị** xem đồng thời
- Hỗ trợ smart TV, mobile, tablet, PC
- Tùy chọn audio, phụ đề đa ngôn ngữ
- Streaming ổn định ở mọi băng thông

### Quy trình kích hoạt

1. Chọn hình thức (tài khoản cấp sẵn hoặc nâng cấp email chính chủ)
2. Thanh toán qua Momo, ViettelPay, ngân hàng
3. Nhận thông tin đăng nhập trong vòng 5 phút
4. Truy cập netflix.com/login và thưởng thức$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 tháng", "price": 129000, "originalPrice": 550000 },
        { "duration": "3 tháng", "price": 329000, "originalPrice": 1050000 },
        { "duration": "6 tháng", "price": 599000, "originalPrice": 3300000 },
        { "duration": "12 tháng", "price": 1099000, "originalPrice": 6600000 }
      ]
    }
  ]'::jsonb
),

-- 2. Spotify Premium 1 năm
(
  'spotify-premium-1year',
  'Spotify Premium 1 năm - Tài khoản',
  'entertainment',
  'assets/banner-product/Spotify.png',
  'inStock',
  $$## Spotify Premium 1 năm

Nghe nhạc không giới hạn, không quảng cáo với chất lượng cao nhất. Hỗ trợ tải xuống nghe offline và phát nhạc theo yêu cầu.

**Tính năng:**
- Nghe không giới hạn
- Không quảng cáo
- Tải xuống offline
- Chất lượng âm thanh cao (320 kbps)
- Phát nhạc theo yêu cầu$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 299000, "originalPrice": 708000 }
      ]
    }
  ]'::jsonb
),

-- 3. Canva Pro 1 năm
(
  'canva-pro-1year',
  'Canva Pro 1 năm - Gia hạn chính chủ',
  'edit-design',
  'assets/banner-product/Canva.png',
  'inStock',
  $$## Canva Pro 1 năm

Công cụ thiết kế đồ họa chuyên nghiệp với hơn 100 triệu ảnh, video và template cao cấp.

**Bao gồm:**
- Hơn 100 triệu hình ảnh và video stock
- Template thiết kế không giới hạn
- Xóa nền tự động
- Xuất file chất lượng cao
- Lưu trữ không giới hạn
- Thiết kế cho team (5 thành viên)$$,
  '[
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 năm", "price": 495000, "originalPrice": 1500000 }
      ]
    }
  ]'::jsonb
),

-- 4. ElevenLabs Creator
(
  'elevenlabs-creator-3months',
  'ElevenLabs Creator 3 tháng - Tài khoản',
  'ai-tools',
  'assets/banner-product/ELEVENLABS.png',
  'inStock',
  $$## ElevenLabs Creator - AI Voice Generator

Tạo giọng nói AI tự nhiên với công nghệ deep learning hàng đầu. Hỗ trợ nhiều ngôn ngữ và giọng đọc khác nhau.

**Tính năng:**
- Tạo giọng nói AI tự nhiên
- Hỗ trợ nhiều ngôn ngữ
- Clone giọng từ mẫu ngắn
- Điều chỉnh tốc độ, tone, emotion
- Xuất file audio chất lượng cao$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "3 tháng", "price": 290000, "originalPrice": 1500000 }
      ]
    }
  ]'::jsonb
),

-- 5. YouTube Premium + Music
(
  'youtube-premium-1year',
  'YouTube Premium + Music 1 năm - Gia hạn',
  'entertainment',
  'assets/banner-product/Youtube.png',
  'inStock',
  $$## YouTube Premium + Music

Xem video không quảng cáo, nghe nhạc offline và phát nền trên YouTube. Bao gồm YouTube Music Premium.

**Tính năng:**
- Không quảng cáo trên YouTube
- Phát video nền khi tắt màn hình
- Tải video để xem offline
- YouTube Music Premium đi kèm
- Hỗ trợ nhiều thiết bị
- Chia sẻ với gia đình (6 người)$$,
  '[
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 năm", "price": 599000, "originalPrice": 6720000 }
      ]
    }
  ]'::jsonb
),

-- 6. ChatGPT Plus
(
  'chatgpt-plus',
  'ChatGPT Plus',
  'ai-tools',
  'assets/banner-product/CHATGPT.png',
  'inStock',
  $$## ChatGPT Plus

Trải nghiệm ChatGPT với GPT-4, tốc độ phản hồi nhanh hơn và ưu tiên truy cập vào các tính năng mới nhất.

**Tính năng:**
- Truy cập GPT-4 không giới hạn
- Tốc độ phản hồi nhanh
- Ưu tiên truy cập tính năng mới
- Không bị giới hạn trong giờ cao điểm
- Plugins và browsing mode
- Tạo hình ảnh với DALL·E$$,
  '[
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 tháng", "price": 490000, "originalPrice": 600000 },
        { "duration": "3 tháng", "price": 1390000, "originalPrice": 1800000 },
        { "duration": "6 tháng", "price": 2590000, "originalPrice": 3600000 }
      ]
    }
  ]'::jsonb
),

-- 7. Claude AI
(
  'claude-ai-1month',
  'Claude AI 1 tháng - Tài khoản',
  'ai-tools',
  'assets/banner-product/CLAUDE.png',
  'inStock',
  $$## Claude AI

Trợ lý AI thông minh với khả năng xử lý văn bản dài, phân tích dữ liệu và hỗ trợ công việc chuyên nghiệp.

**Tính năng:**
- Xử lý context cực dài (200K tokens)
- Phân tích tài liệu phức tạp
- Viết code và debug
- Hỗ trợ nhiều ngôn ngữ
- API access cho developers$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 tháng", "price": 199000, "originalPrice": 6500000 }
      ]
    }
  ]'::jsonb
),

-- 8. HMA VPN
(
  'hma-vpn-1year',
  'HMA VPN 1 năm - 1 thiết bị',
  'vpn',
  'assets/banner-product/HMA.png',
  'inStock',
  $$## HMA VPN

Bảo vệ quyền riêng tư trực tuyến với VPN tốc độ cao, mã hóa mạnh mẽ và hỗ trợ đa nền tảng.

**Tính năng:**
- Hơn 1100 server tại 290+ vị trí
- Tốc độ không giới hạn
- Mã hóa 256-bit AES
- Kill switch tự động
- Hỗ trợ Windows, Mac, iOS, Android
- Không log dữ liệu người dùng$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 199000, "originalPrice": 800000 }
      ]
    }
  ]'::jsonb
),

-- 9. Gemini Ultra
(
  'gemini-ultra-1month',
  'Gemini Ultra 1 tháng - Tài khoản',
  'ai-tools',
  'assets/banner-product/GEMINI.png',
  'inStock',
  $$## Gemini Ultra

Mô hình AI đa phương thức mạnh mẽ của Google, hỗ trợ xử lý văn bản, hình ảnh, âm thanh và video.

**Tính năng:**
- Xử lý đa phương thức (text, image, audio, video)
- Hiểu và phân tích hình ảnh
- Tạo nội dung sáng tạo
- Hỗ trợ code generation
- Tích hợp Google services$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 tháng", "price": 199000, "originalPrice": 12000000 }
      ]
    }
  ]'::jsonb
),

-- 10. Office 365 Family
(
  'office-365-family-1year',
  'Office 365 Family 1 năm - Gia hạn',
  'storage',
  'assets/banner-product/Office 365.png',
  'inStock',
  $$## Office 365 Family

Bộ công cụ văn phòng đầy đủ với Word, Excel, PowerPoint, Outlook và nhiều tính năng cloud.

**Bao gồm:**
- Word, Excel, PowerPoint, Outlook
- OneDrive 1TB cho mỗi người (6 người)
- Skype 60 phút/tháng
- Microsoft Teams
- Cài đặt trên 5 PC/Mac
- Cập nhật tự động
- Hỗ trợ 24/7$$,
  '[
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 năm", "price": 690000, "originalPrice": 1200000 }
      ]
    }
  ]'::jsonb
),

-- 11. Grammarly Premium
(
  'grammarly-premium-1year',
  'Grammarly Premium 1 năm - Tài khoản',
  'utilities',
  'assets/banner-product/GRAMMARLY.png',
  'inStock',
  $$## Grammarly Premium

Công cụ kiểm tra ngữ pháp và chỉnh sửa văn bản AI, giúp bạn viết rõ ràng, chuyên nghiệp hơn.

**Tính năng:**
- Kiểm tra ngữ pháp và chính tả nâng cao
- Gợi ý cải thiện văn phong
- Phát hiện đạo văn
- Hỗ trợ nhiều ngôn ngữ
- Tích hợp với trình duyệt và ứng dụng
- Phân tích tone và style$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 390000, "originalPrice": 1800000 }
      ]
    }
  ]'::jsonb
),

-- 12. HBO Vieon
(
  'hbo-vieon-1year',
  'HBO Vieon 1 năm - Tài khoản',
  'entertainment',
  'assets/banner-product/Vieon.png',
  'inStock',
  $$## HBO Vieon

Xem phim và series độc quyền từ HBO, HBO Max và nhiều nội dung giải trí khác.

**Tính năng:**
- Hơn 10,000 giờ nội dung
- Phim và series độc quyền HBO
- Chất lượng HD và 4K
- Xem trên nhiều thiết bị
- Tải xuống để xem offline
- Hỗ trợ phụ đề đa ngôn ngữ$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 299000, "originalPrice": 720000 }
      ]
    }
  ]'::jsonb
),

-- 13. NordVPN
(
  'nordvpn-1year',
  'NordVPN 1 năm - Tài khoản',
  'vpn',
  'assets/banner-product/NORD.png',
  'inStock',
  $$## NordVPN

Dịch vụ VPN hàng đầu với bảo mật mạnh mẽ, tốc độ cao và mạng lưới server rộng lớn.

**Tính năng:**
- Hơn 5900 server tại 60+ quốc gia
- Mã hóa lớp quân sự
- Kill switch và Double VPN
- CyberSec chặn quảng cáo
- Hỗ trợ 6 thiết bị đồng thời
- Không log policy$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 199000, "originalPrice": 600000 }
      ]
    }
  ]'::jsonb
),

-- 14. Surfshark VPN
(
  'surfshark-vpn-1year',
  'Surfshark VPN 1 năm - Unlimited',
  'vpn',
  'assets/banner-product/SURFSHARK.png',
  'inStock',
  $$## Surfshark VPN

VPN không giới hạn thiết bị với giá cả phải chăng, bảo mật mạnh mẽ và tính năng đầy đủ.

**Tính năng:**
- Không giới hạn số lượng thiết bị
- Hơn 3200 server tại 100+ quốc gia
- CleanWeb chặn quảng cáo và malware
- MultiHop (Double VPN)
- Kill switch tự động
- Không log policy$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 199000, "originalPrice": 840000 }
      ]
    }
  ]'::jsonb
),

-- 15. CapCut Pro
(
  'capcut-pro-1year',
  'CapCut Pro 1 năm - Premium',
  'edit-design',
  'assets/banner-product/Capcut.png',
  'inStock',
  $$## CapCut Pro

Ứng dụng chỉnh sửa video chuyên nghiệp với công cụ AI, hiệu ứng đẹp mắt và xuất video chất lượng cao.

**Tính năng:**
- Công cụ chỉnh sửa video đầy đủ
- Hiệu ứng và filter chuyên nghiệp
- AI tự động tạo subtitle
- Âm thanh và nhạc nền miễn phí
- Xuất video 4K không watermark
- Hỗ trợ nhiều định dạng$$,
  '[
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 399000, "originalPrice": 1200000 }
      ]
    }
  ]'::jsonb
);

-- Kiểm tra kết quả
SELECT COUNT(*) as total_products FROM public.products;
