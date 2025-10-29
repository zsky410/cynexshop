# 15 Sản phẩm mẫu cho Supabase

## Cách sử dụng:

1. Mở Supabase Studio → Table Editor → products
2. Click "Insert row" và copy dữ liệu từng sản phẩm dưới đây
3. Chú ý:
   - `offerings` phải là JSON hợp lệ (paste vào Supabase sẽ tự convert sang JSONB)
   - `description_markdown` có thể chứa markdown với xuống dòng

---

## 1. Netflix Premium

```json
{
  "slug": "netflix-premium",
  "name": "Netflix Premium",
  "category": "Giải trí",
  "image_url": "assets/banner-product/Netflix.png",
  "status": "inStock",
  "base_price": 129000,
  "base_original_price": 550000,
  "likes": 156,
  "sold": 1240,
  "warranty": "Trọn đời",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 tháng", "price": 129000, "originalPrice": 550000 },
        { "duration": "3 tháng", "price": 329000, "originalPrice": 1050000 },
        { "duration": "6 tháng", "price": 599000, "originalPrice": 3300000 },
        { "duration": "12 tháng", "price": 1099000, "originalPrice": 6600000 }
      ]
    }
  ],
  "description_markdown": "## Giới thiệu gói Netflix Premium\n\nTrải nghiệm kho nội dung khổng lồ của Netflix với chất lượng **Ultra HD** và âm thanh vòm. Tài khoản được nâng cấp chính chủ, bảo hành trọn gói trong suốt thời gian sử dụng.\n\n### Điểm nổi bật\n\n- Xem **không giới hạn phim, series, show truyền hình** mới nhất\n- Tối đa **4 thiết bị** xem đồng thời\n- Hỗ trợ smart TV, mobile, tablet, PC\n- Tùy chọn audio, phụ đề đa ngôn ngữ\n- Streaming ổn định ở mọi băng thông\n\n### Quy trình kích hoạt\n\n1. Chọn hình thức (tài khoản cấp sẵn hoặc nâng cấp email chính chủ)\n2. Thanh toán qua Momo, ViettelPay, ngân hàng\n3. Nhận thông tin đăng nhập trong vòng 5 phút\n4. Truy cập netflix.com/login và thưởng thức"
}
```

## 2. Spotify Premium 1 năm

```json
{
  "slug": "spotify-premium-1year",
  "name": "Spotify Premium 1 năm - Tài khoản",
  "category": "Giải trí",
  "image_url": "assets/banner-product/Spotify.png",
  "status": "inStock",
  "base_price": 299000,
  "base_original_price": 708000,
  "likes": 89,
  "sold": 567,
  "warranty": "1 năm",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 299000, "originalPrice": 708000 }
      ]
    }
  ],
  "description_markdown": "## Spotify Premium 1 năm\n\nNghe nhạc không giới hạn, không quảng cáo với chất lượng cao nhất. Hỗ trợ tải xuống nghe offline và phát nhạc theo yêu cầu.\n\n**Tính năng:**\n- Nghe không giới hạn\n- Không quảng cáo\n- Tải xuống offline\n- Chất lượng âm thanh cao (320 kbps)\n- Phát nhạc theo yêu cầu"
}
```

## 3. Canva Pro 1 năm

```json
{
  "slug": "canva-pro-1year",
  "name": "Canva Pro 1 năm - Gia hạn chính chủ",
  "category": "Edit Ảnh-Video",
  "image_url": "assets/banner-product/Canva.png",
  "status": "inStock",
  "base_price": 495000,
  "base_original_price": 1500000,
  "likes": 234,
  "sold": 890,
  "warranty": "1 năm",
  "upgrade_method": "Gia hạn chính chủ",
  "offerings": [
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 năm", "price": 495000, "originalPrice": 1500000 }
      ]
    }
  ],
  "description_markdown": "## Canva Pro 1 năm\n\nCông cụ thiết kế đồ họa chuyên nghiệp với hơn 100 triệu ảnh, video và template cao cấp.\n\n**Bao gồm:**\n- Hơn 100 triệu hình ảnh và video stock\n- Template thiết kế không giới hạn\n- Xóa nền tự động\n- Xuất file chất lượng cao\n- Lưu trữ không giới hạn\n- Thiết kế cho team (5 thành viên)"
}
```

## 4. ElevenLabs Creator

```json
{
  "slug": "elevenlabs-creator-3months",
  "name": "ElevenLabs Creator 3 tháng - Tài khoản",
  "category": "Công cụ AI",
  "image_url": "assets/banner-product/ELEVENLABS.png",
  "status": "inStock",
  "base_price": 290000,
  "base_original_price": 1500000,
  "likes": 145,
  "sold": 423,
  "warranty": "3 tháng",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "3 tháng", "price": 290000, "originalPrice": 1500000 }
      ]
    }
  ],
  "description_markdown": "## ElevenLabs Creator - AI Voice Generator\n\nTạo giọng nói AI tự nhiên với công nghệ deep learning hàng đầu. Hỗ trợ nhiều ngôn ngữ và giọng đọc khác nhau.\n\n**Tính năng:**\n- Tạo giọng nói AI tự nhiên\n- Hỗ trợ nhiều ngôn ngữ\n- Clone giọng từ mẫu ngắn\n- Điều chỉnh tốc độ, tone, emotion\n- Xuất file audio chất lượng cao"
}
```

## 5. YouTube Premium + Music

```json
{
  "slug": "youtube-premium-1year",
  "name": "YouTube Premium + Music 1 năm - Gia hạn",
  "category": "Giải trí",
  "image_url": "assets/banner-product/Youtube.png",
  "status": "inStock",
  "base_price": 599000,
  "base_original_price": 6720000,
  "likes": 312,
  "sold": 1567,
  "warranty": "1 năm",
  "upgrade_method": "Gia hạn chính chủ",
  "offerings": [
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 năm", "price": 599000, "originalPrice": 6720000 }
      ]
    }
  ],
  "description_markdown": "## YouTube Premium + Music\n\nXem video không quảng cáo, nghe nhạc offline và phát nền trên YouTube. Bao gồm YouTube Music Premium.\n\n**Tính năng:**\n- Không quảng cáo trên YouTube\n- Phát video nền khi tắt màn hình\n- Tải video để xem offline\n- YouTube Music Premium đi kèm\n- Hỗ trợ nhiều thiết bị\n- Chia sẻ với gia đình (6 người)"
}
```

## 6. ChatGPT Plus

```json
{
  "slug": "chatgpt-plus",
  "name": "ChatGPT Plus",
  "category": "Công cụ AI",
  "image_url": "assets/banner-product/CHATGPT.png",
  "status": "inStock",
  "base_price": 490000,
  "base_original_price": 600000,
  "likes": 678,
  "sold": 2341,
  "warranty": "Vĩnh viễn",
  "upgrade_method": "Gia hạn trực tiếp",
  "offerings": [
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 tháng", "price": 490000, "originalPrice": 600000 },
        { "duration": "3 tháng", "price": 1390000, "originalPrice": 1800000 },
        { "duration": "6 tháng", "price": 2590000, "originalPrice": 3600000 }
      ]
    }
  ],
  "description_markdown": "## ChatGPT Plus\n\nTrải nghiệm ChatGPT với GPT-4, tốc độ phản hồi nhanh hơn và ưu tiên truy cập vào các tính năng mới nhất.\n\n**Tính năng:**\n- Truy cập GPT-4 không giới hạn\n- Tốc độ phản hồi nhanh\n- Ưu tiên truy cập tính năng mới\n- Không bị giới hạn trong giờ cao điểm\n- Plugins và browsing mode\n- Tạo hình ảnh với DALL·E"
}
```

## 7. Claude AI

```json
{
  "slug": "claude-ai-1month",
  "name": "Claude AI 1 tháng - Tài khoản",
  "category": "Công cụ AI",
  "image_url": "assets/banner-product/CLAUDE.png",
  "status": "inStock",
  "base_price": 199000,
  "base_original_price": 6500000,
  "likes": 234,
  "sold": 567,
  "warranty": "1 tháng",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 tháng", "price": 199000, "originalPrice": 6500000 }
      ]
    }
  ],
  "description_markdown": "## Claude AI\n\nTrợ lý AI thông minh với khả năng xử lý văn bản dài, phân tích dữ liệu và hỗ trợ công việc chuyên nghiệp.\n\n**Tính năng:**\n- Xử lý context cực dài (200K tokens)\n- Phân tích tài liệu phức tạp\n- Viết code và debug\n- Hỗ trợ nhiều ngôn ngữ\n- API access cho developers"
}
```

## 8. HMA VPN

```json
{
  "slug": "hma-vpn-1year",
  "name": "HMA VPN 1 năm - 1 thiết bị",
  "category": "VPN",
  "image_url": "assets/banner-product/HMA.png",
  "status": "inStock",
  "base_price": 199000,
  "base_original_price": 800000,
  "likes": 123,
  "sold": 890,
  "warranty": "1 năm",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 199000, "originalPrice": 800000 }
      ]
    }
  ],
  "description_markdown": "## HMA VPN\n\nBảo vệ quyền riêng tư trực tuyến với VPN tốc độ cao, mã hóa mạnh mẽ và hỗ trợ đa nền tảng.\n\n**Tính năng:**\n- Hơn 1100 server tại 290+ vị trí\n- Tốc độ không giới hạn\n- Mã hóa 256-bit AES\n- Kill switch tự động\n- Hỗ trợ Windows, Mac, iOS, Android\n- Không log dữ liệu người dùng"
}
```

## 9. Gemini Ultra

```json
{
  "slug": "gemini-ultra-1month",
  "name": "Gemini Ultra 1 tháng - Tài khoản",
  "category": "Công cụ AI",
  "image_url": "assets/banner-product/GEMINI.png",
  "status": "inStock",
  "base_price": 199000,
  "base_original_price": 12000000,
  "likes": 345,
  "sold": 678,
  "warranty": "1 tháng",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 tháng", "price": 199000, "originalPrice": 12000000 }
      ]
    }
  ],
  "description_markdown": "## Gemini Ultra\n\nMô hình AI đa phương thức mạnh mẽ của Google, hỗ trợ xử lý văn bản, hình ảnh, âm thanh và video.\n\n**Tính năng:**\n- Xử lý đa phương thức (text, image, audio, video)\n- Hiểu và phân tích hình ảnh\n- Tạo nội dung sáng tạo\n- Hỗ trợ code generation\n- Tích hợp Google services"
}
```

## 10. Office 365 Family

```json
{
  "slug": "office-365-family-1year",
  "name": "Office 365 Family 1 năm - Gia hạn",
  "category": "Lưu trữ",
  "image_url": "assets/banner-product/Office 365.png",
  "status": "inStock",
  "base_price": 690000,
  "base_original_price": 1200000,
  "likes": 456,
  "sold": 1234,
  "warranty": "1 năm",
  "upgrade_method": "Gia hạn chính chủ",
  "offerings": [
    {
      "type": "upgrade",
      "packages": [
        { "duration": "1 năm", "price": 690000, "originalPrice": 1200000 }
      ]
    }
  ],
  "description_markdown": "## Office 365 Family\n\nBộ công cụ văn phòng đầy đủ với Word, Excel, PowerPoint, Outlook và nhiều tính năng cloud.\n\n**Bao gồm:**\n- Word, Excel, PowerPoint, Outlook\n- OneDrive 1TB cho mỗi người (6 người)\n- Skype 60 phút/tháng\n- Microsoft Teams\n- Cài đặt trên 5 PC/Mac\n- Cập nhật tự động\n- Hỗ trợ 24/7"
}
```

## 11. Grammarly Premium

```json
{
  "slug": "grammarly-premium-1year",
  "name": "Grammarly Premium 1 năm - Tài khoản",
  "category": "Tiện ích",
  "image_url": "assets/banner-product/GRAMMARLY.png",
  "status": "inStock",
  "base_price": 390000,
  "base_original_price": 1800000,
  "likes": 267,
  "sold": 789,
  "warranty": "1 năm",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 390000, "originalPrice": 1800000 }
      ]
    }
  ],
  "description_markdown": "## Grammarly Premium\n\nCông cụ kiểm tra ngữ pháp và chỉnh sửa văn bản AI, giúp bạn viết rõ ràng, chuyên nghiệp hơn.\n\n**Tính năng:**\n- Kiểm tra ngữ pháp và chính tả nâng cao\n- Gợi ý cải thiện văn phong\n- Phát hiện đạo văn\n- Hỗ trợ nhiều ngôn ngữ\n- Tích hợp với trình duyệt và ứng dụng\n- Phân tích tone và style"
}
```

## 12. HBO Vieon

```json
{
  "slug": "hbo-vieon-1year",
  "name": "HBO Vieon 1 năm - Tài khoản",
  "category": "Giải trí",
  "image_url": "assets/banner-product/Vieon.png",
  "status": "inStock",
  "base_price": 299000,
  "base_original_price": 720000,
  "likes": 189,
  "sold": 654,
  "warranty": "1 năm",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 299000, "originalPrice": 720000 }
      ]
    }
  ],
  "description_markdown": "## HBO Vieon\n\nXem phim và series độc quyền từ HBO, HBO Max và nhiều nội dung giải trí khác.\n\n**Tính năng:**\n- Hơn 10,000 giờ nội dung\n- Phim và series độc quyền HBO\n- Chất lượng HD và 4K\n- Xem trên nhiều thiết bị\n- Tải xuống để xem offline\n- Hỗ trợ phụ đề đa ngôn ngữ"
}
```

## 13. NordVPN

```json
{
  "slug": "nordvpn-1year",
  "name": "NordVPN 1 năm - Tài khoản",
  "category": "VPN",
  "image_url": "assets/banner-product/NORD.png",
  "status": "inStock",
  "base_price": 199000,
  "base_original_price": 600000,
  "likes": 234,
  "sold": 987,
  "warranty": "1 năm",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 199000, "originalPrice": 600000 }
      ]
    }
  ],
  "description_markdown": "## NordVPN\n\nDịch vụ VPN hàng đầu với bảo mật mạnh mẽ, tốc độ cao và mạng lưới server rộng lớn.\n\n**Tính năng:**\n- Hơn 5900 server tại 60+ quốc gia\n- Mã hóa lớp quân sự\n- Kill switch và Double VPN\n- CyberSec chặn quảng cáo\n- Hỗ trợ 6 thiết bị đồng thời\n- Không log policy"
}
```

## 14. Surfshark VPN

```json
{
  "slug": "surfshark-vpn-1year",
  "name": "Surfshark VPN 1 năm - Unlimited",
  "category": "VPN",
  "image_url": "assets/banner-product/SURFSHARK.png",
  "status": "inStock",
  "base_price": 199000,
  "base_original_price": 840000,
  "likes": 312,
  "sold": 1456,
  "warranty": "1 năm",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 199000, "originalPrice": 840000 }
      ]
    }
  ],
  "description_markdown": "## Surfshark VPN\n\nVPN không giới hạn thiết bị với giá cả phải chăng, bảo mật mạnh mẽ và tính năng đầy đủ.\n\n**Tính năng:**\n- Không giới hạn số lượng thiết bị\n- Hơn 3200 server tại 100+ quốc gia\n- CleanWeb chặn quảng cáo và malware\n- MultiHop (Double VPN)\n- Kill switch tự động\n- Không log policy"
}
```

## 15. CapCut Pro

```json
{
  "slug": "capcut-pro-1year",
  "name": "CapCut Pro 1 năm - Premium",
  "category": "Edit Ảnh-Video",
  "image_url": "assets/banner-product/Capcut.png",
  "status": "inStock",
  "base_price": 399000,
  "base_original_price": 1200000,
  "likes": 423,
  "sold": 1123,
  "warranty": "1 năm",
  "upgrade_method": "Cấp tài khoản",
  "offerings": [
    {
      "type": "account",
      "packages": [
        { "duration": "1 năm", "price": 399000, "originalPrice": 1200000 }
      ]
    }
  ],
  "description_markdown": "## CapCut Pro\n\nỨng dụng chỉnh sửa video chuyên nghiệp với công cụ AI, hiệu ứng đẹp mắt và xuất video chất lượng cao.\n\n**Tính năng:**\n- Công cụ chỉnh sửa video đầy đủ\n- Hiệu ứng và filter chuyên nghiệp\n- AI tự động tạo subtitle\n- Âm thanh và nhạc nền miễn phí\n- Xuất video 4K không watermark\n- Hỗ trợ nhiều định dạng"
}
```

---

## Lưu ý khi nhập vào Supabase:

1. **UUID**: Supabase sẽ tự tạo UUID cho `id` nếu bạn để trống
2. **offerings**: Copy JSON array vào field `offerings`, Supabase sẽ tự chuyển sang JSONB
3. **description_markdown**: Paste markdown trực tiếp, có thể xuống dòng tự nhiên
4. **status**: Phải là `"inStock"` hoặc `"outOfStock"` (chính xác)
5. **image_url**: Đảm bảo đường dẫn đúng với file trong `public/assets/banner-product/`
6. **Số**: `likes`, `sold`, `base_price`, `base_original_price` phải là số nguyên (integer/numeric)

## Cách nhập nhanh:

Bạn có thể copy từng block JSON ở trên, paste vào Supabase Studio. Hoặc có thể import hàng loạt bằng cách:

1. Export file CSV từ Supabase template
2. Fill data và import lại
3. Hoặc dùng SQL INSERT (trong SQL Editor)
