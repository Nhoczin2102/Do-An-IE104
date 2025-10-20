// feed-demo.js
document.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = `
    <div class="feed-card">
      <div class="composer">
        <img src="../img/image 1.png" alt="" style="width:40px;height:40px;border-radius:50%">
        <input type="text" placeholder="Chia sẻ công thức mới của bạn...">
      </div>
      <div class="tabs">
        <span>Ảnh</span>
        <span>Video</span>
        <span>🍴 Công thức</span>
        <button class="btn-post">Đăng</button>
      </div>
    </div>

    <article style="margin-top:16px;border:1px solid #eaeaea;border-radius:14px;padding:14px;background:#fff;">
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">
        <img src="https://i.pravatar.cc/100?img=32" style="width:44px;height:44px;border-radius:50%">
        <div>
          <strong>Chí Thành</strong>
          <div style="color:#777;font-size:14px;">2 giờ trước</div>
        </div>
      </div>
      <p style="margin:8px 0 12px">
        Hôm nay mình sẽ chia sẻ công thức nấu ăn món bánh ngọt này nhé,
        chúc mọi người thành công thực hiện.
      </p>
      <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop"
           style="width:100%;border-radius:12px">
    </article>
  `;
});
