  // ========== DATA MANAGEMENT ==========
  export let posts = [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/100?img=32",
      name: "Chí Thành",
      time: "2 giờ trước",
      content: "Hôm nay mình sẽ chia sẻ công thức nấu ăn món bánh ngọt này nhé, chúc mọi người thành công thực hiện.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
      likes: 45,
      comments: 12,
      shares: 5,
      isLiked: false,
      recipe: {
        title: "Bánh Ngọt Pháp",
        prepTime: "30 phút",
        cookTime: "25 phút",
        servings: "4 người",
        difficulty: "Trung bình",
        ingredients: [
          "200g bột mì",
          "150g đường",
          "3 quả trứng",
          "100g bơ",
          "200ml sữa tươi",
          "1 thìa cà phê vani",
          "1 thìa cà phê bột nở"
        ],
        steps: [
          "Làm nóng lò nướng ở 180°C",
          "Trộn bột mì, đường và bột nở",
          "Đánh tan trứng với sữa và vani",
          "Trộn đều hỗn hợp ướt và khô",
          "Cho bơ đun chảy vào trộn đều",
          "Đổ hỗn hợp vào khuôn",
          "Nướng trong 25 phút"
        ],
        tips: "Có thể thêm chocolate chips hoặc trái cây khô để tăng hương vị"
      },
      commentsList: [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/100?img=15",
          name: "Minh Anh",
          time: "1 giờ trước",
          content: "Nhìn ngon quá! Có thể chia sẻ chi tiết nguyên liệu không bạn?"
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/100?img=22",
          name: "Tuấn Vũ",
          time: "45 phút trước",
          content: "Mình đã thử làm theo và thành công, cảm ơn bạn!"
        }
      ]
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/100?img=12",
      name: "Minh Anh",
      time: "5 giờ trước",
      content: "Cá kho tộ là món ăn dân dã nhưng rất đậm đà hương vị Việt Nam. Cùng thử nhé!",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop",
      likes: 89,
      comments: 23,
      shares: 8,
      isLiked: true,
      recipe: {
        title: "Cá Kho Tộ",
        prepTime: "15 phút",
        cookTime: "45 phút",
        servings: "3-4 người",
        difficulty: "Dễ",
        ingredients: [
          "500g cá lóc",
          "3 thìa nước màu",
          "2 thìa nước mắm",
          "1 thìa đường",
          "1 củ hành tím",
          "2 trái ớt",
          "1 ít tiêu xay"
        ],
        steps: [
          "Cá làm sạch, cắt khúc vừa ăn",
          "Ướp cá với nước màu, nước mắm, đường, hành tím trong 15 phút",
          "Cho cá vào nồi đất, thêm nước xâm xấp mặt cá",
          "Kho với lửa nhỏ trong 45 phút",
          "Thêm ớt và tiêu trước khi tắt bếp"
        ],
        tips: "Nên dùng nồi đất để cá thấm gia vị và có màu đẹp hơn"
      },
      commentsList: []
    }
  ];