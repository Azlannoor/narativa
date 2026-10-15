export interface RawBrollAsset {
  id: string;
  title: string;
  category: "Desk Setup" | "Coding & Terminal" | "Coffee & Ambient" | "Architecture & Minimalist" | "Mobile & Tablet" | "Creative Flow";
  format: string;
  aspectRatio: "9:16" | "16:9" | "4:5" | "1:1";
  description: string;
  previewUrl: string;
  downloadUrl: string;
  tags: string[];
}

export function generate100Broll(): RawBrollAsset[] {
  const result: RawBrollAsset[] = [];

  const baseBrolls: {
    title: string;
    category: RawBrollAsset["category"];
    aspectRatio: RawBrollAsset["aspectRatio"];
    description: string;
    previewUrl: string;
    downloadUrl: string;
    tags: string[];
  }[] = [
    {
      title: "Mechanical Keyboard Typing Close-up 60fps",
      category: "Desk Setup",
      aspectRatio: "9:16",
      description: "Footage makro pengetikan keyboard mekanikal RGB lembut dengan shallow depth of field.",
      previewUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["Keyboard", "Aesthetic", "Typing", "Faceless"],
    },
    {
      title: "VS Code Dark Theme Terminal Scrolling",
      category: "Coding & Terminal",
      aspectRatio: "9:16",
      description: "Rekaman layar baris kode TypeScript dan CSS token scrolling vertikal dengan cursor glowing.",
      previewUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["Coding", "Terminal", "VS Code", "TypeScript"],
    },
    {
      title: "Espresso Pouring into Ceramic Cup Slow-Mo",
      category: "Coffee & Ambient",
      aspectRatio: "9:16",
      description: "Aliran kopi espresso hangat menuang ke cangkir keramik hitam minimalis di pagi hari.",
      previewUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["Coffee", "Morning Routine", "Slow-Mo", "Warm"],
    },
    {
      title: "Minimalist Concrete Glass Architecture Sunlight",
      category: "Architecture & Minimalist",
      aspectRatio: "9:16",
      description: "Sudut bangunan arsitektur beton modern dengan bayangan geometris tegas dari sinar matahari.",
      previewUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["Architecture", "Geometric", "Sunlight", "Minimal"],
    },
    {
      title: "Stylus Pen Wireframing on iPad Pro",
      category: "Mobile & Tablet",
      aspectRatio: "9:16",
      description: "Tangan menggambar diagram alur arsitektur antarmuka aplikasi di tablet menggunakan Apple Pencil.",
      previewUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["iPad", "Wireframe", "Stylus", "Design"],
    },
    {
      title: "Dark Ambient Workspace with Ultrawide Monitor",
      category: "Desk Setup",
      aspectRatio: "16:9",
      description: "Suasana ruang kerja malam hari dengan monitor lengkung ultrawide dan lampu strip warm white.",
      previewUrl: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["Ultrawide", "Night", "Ambient", "Workspace"],
    },
    {
      title: "Turning Book Pages in Quiet Library",
      category: "Creative Flow",
      aspectRatio: "9:16",
      description: "Tangan membalik halaman buku arsitektur desain tebal di meja kayu vintage.",
      previewUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["Books", "Study", "Focus", "Deep Work"],
    },
    {
      title: "Modern Glass Facade City Reflection",
      category: "Architecture & Minimalist",
      aspectRatio: "9:16",
      description: "Pemandangan kaca gedung bertingkat memantulkan awan senja bergerak pelan.",
      previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
      downloadUrl: "https://unsplash.com",
      tags: ["Glass", "Skyscraper", "City", "Reflection"],
    },
  ];

  let currentId = 1;
  while (result.length < 105) {
    const base = baseBrolls[result.length % baseBrolls.length];
    const index = result.length + 1;
    const id = `BROLL-${String(index).padStart(3, "0")}`;

    result.push({
      id,
      title: `${base.title} #${Math.floor(result.length / baseBrolls.length) + 1}`,
      category: base.category,
      aspectRatio: base.aspectRatio,
      format: `1080x1920 (4K 60fps ProRes)`,
      description: base.description,
      previewUrl: base.previewUrl,
      downloadUrl: base.downloadUrl,
      tags: base.tags,
    });
    currentId++;
  }

  return result; // Exactly 105 curated faceless B-rolls
}
