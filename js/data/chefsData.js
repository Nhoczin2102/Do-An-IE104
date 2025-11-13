// data/chefsData.js
export const chefsData = [
  {
    id: 1,
    name: "Gordon Ramsay",
    avatar: "https://images.unsplash.com/photo-1583394293214-28ded15ee548",
    specialty: "Ẩm thực Âu • MasterChef",
    bio: "Đầu bếp 3 sao Michelin với hơn 30 năm kinh nghiệm. Chuyên về ẩm thực châu Âu hiện đại.",
    rating: 4.9,
    recipes: 156,
    followers: "125K",
    experience: "25 năm",
    expertise: ["Pháp", "Ý", "Anh"],
    category: "european",
    featured: true,
    isFollowing: false,
    social: {
      youtube: "gordonramsay",
      instagram: "gordonramsay"
    }
  },
  {
    id: 2,
    name: "Phan Tôn Tịnh Hải",
    avatar: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf",
    specialty: "Ẩm thực Việt • Top Chef",
    bio: "Bếp trưởng nhà hàng Việt Nam danh tiếng. Bảo tồn và phát triển ẩm thực truyền thống.",
    rating: 4.8,
    recipes: 89,
    followers: "89K",
    experience: "15 năm",
    expertise: ["Miền Bắc", "Miền Trung", "Hải sản"],
    category: "vietnamese",
    featured: true,
    isFollowing: false,
    social: {
      youtube: "chefhaiton",
      facebook: "chefhaiphan"
    }
  },
  {
    id: 3,
    name: "Marco Pierre White",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c",
    specialty: "Ẩm thực Anh • Hell's Kitchen",
    bio: "Người đầu bếp trẻ nhất đạt 3 sao Michelin. Phong cách ẩm thực tinh tế và sáng tạo.",
    rating: 4.7,
    recipes: 134,
    followers: "98K",
    experience: "30 năm",
    expertise: ["Anh", "Pháp", "Hải sản"],
    category: "european",
    featured: false,
    isFollowing: true,
    social: {
      instagram: "marcowhite",
      twitter: "mpw"
    }
  },
  {
    id: 4,
    name: "Nguyễn Thị Diệu Linh",
    avatar: "https://images.unsplash.com/photo-1547428067-6bbce4d8f77e",
    specialty: "Làm bánh • MasterChef Vietnam",
    bio: "Chuyên gia làm bánh với các công thức độc quyền. Từng tham gia MasterChef Vietnam.",
    rating: 4.6,
    recipes: 203,
    followers: "67K",
    experience: "8 năm",
    expertise: ["Bánh ngọt", "Bánh mì", "Dessert"],
    category: "baking",
    featured: true,
    isFollowing: false,
    social: {
      instagram: "linhbaker",
      tiktok: "linh_cakes"
    }
  },
  {
    id: 5,
    name: "David Chang",
    avatar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
    specialty: "Ẩm thực Châu Á • Momofuku",
    bio: "Người sáng lập Momofuku. Kết hợp ẩm thực châu Á với kỹ thuật hiện đại.",
    rating: 4.7,
    recipes: 178,
    followers: "112K",
    experience: "18 năm",
    expertise: ["Hàn Quốc", "Nhật Bản", "Fusion"],
    category: "asian",
    featured: false,
    isFollowing: false,
    social: {
      instagram: "davidchang",
      youtube: "momofuku"
    }
  },
  {
    id: 6,
    name: "Trần Văn Minh",
    avatar: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f",
    specialty: "Ẩm thực Việt • Street Food",
    bio: "Chuyên gia ẩm thực đường phố Việt Nam. Đam mê các món ăn dân dã nhưng đậm đà.",
    rating: 4.5,
    recipes: 95,
    followers: "45K",
    experience: "12 năm",
    expertise: ["Miền Nam", "Đường phố", "Chay"],
    category: "vietnamese",
    featured: false,
    isFollowing: true,
    social: {
      facebook: "minhstreetfood",
      tiktok: "minh_amthuc"
    }
  },
  {
    id: 7,
    name: "Jamie Oliver",
    avatar: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f",
    specialty: "Ẩm thực Healthy • The Naked Chef",
    bio: "Đầu bếp nổi tiếng với phong cách nấu ăn healthy và dễ làm. Tác giả nhiều sách dạy nấu ăn.",
    rating: 4.8,
    recipes: 267,
    followers: "156K",
    experience: "22 năm",
    expertise: ["Healthy", "Organic", "Family Meals"],
    category: "healthy",
    featured: true,
    isFollowing: false,
    social: {
      youtube: "jamieoliver",
      instagram: "jamieoliver"
    }
  },
  {
    id: 8,
    name: "Lê Thị Hương",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e",
    specialty: "Ăn uống lành mạnh • Eat Clean",
    bio: "Chuyên gia dinh dưỡng và ẩm thực healthy. Chia sẻ công thức eat clean cho gia đình Việt.",
    rating: 4.6,
    recipes: 124,
    followers: "78K",
    experience: "10 năm",
    expertise: ["Eat Clean", "Dinh dưỡng", "Chay"],
    category: "healthy",
    featured: false,
    isFollowing: false,
    social: {
      instagram: "huong_eatclean",
      facebook: "huonghealthy"
    }
  },
  {
    id: 9,
    name: "Masaharu Morimoto",
    avatar: "https://images.unsplash.com/photo-1583394293214-28ded15ee548",
    specialty: "Ẩm thực Nhật • Iron Chef",
    bio: "Đầu bếp sushi huyền thoại. Kết hợp kỹ thuật truyền thống Nhật Bản với ẩm thực hiện đại.",
    rating: 4.9,
    recipes: 142,
    followers: "134K",
    experience: "35 năm",
    expertise: ["Sushi", "Nhật Bản", "Hải sản"],
    category: "asian",
    featured: true,
    isFollowing: false,
    social: {
      instagram: "morimotochef",
      twitter: "morimoto"
    }
  },
  {
    id: 10,
    name: "Nguyễn Văn Hùng",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    specialty: "Bánh Việt • Traditional Baking",
    bio: "Nghệ nhân làm bánh truyền thống Việt Nam. Bảo tồn các công thức bánh cổ truyền.",
    rating: 4.4,
    recipes: 87,
    followers: "32K",
    experience: "20 năm",
    expertise: ["Bánh Việt", "Bánh truyền thống", "Bánh mì"],
    category: "baking",
    featured: false,
    isFollowing: false,
    social: {
      facebook: "hungbaker",
      youtube: "banhviet"
    }
  }
];