// Visual trait definitions for each architect's portrait and building
export interface ArchitectVisuals {
  // Portrait traits
  gender: "male" | "female";
  hairStyle: "short" | "swept" | "long" | "bald" | "bob" | "curly" | "spiky" | "parted";
  glasses: boolean;
  hairColor: string;
  outfitColor: string;
  // Building
  buildingName: string;
}

export const architectVisuals: Record<string, ArchitectVisuals> = {
  // ESTJ
  "丹下健三": {
    gender: "male", hairStyle: "swept", glasses: true,
    hairColor: "#2D3436", outfitColor: "#2D3436",
    buildingName: "代々木体育館",
  },
  "前川國男": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#34495E",
    buildingName: "東京文化会館",
  },
  // ESTP
  "藤本壮介": {
    gender: "male", hairStyle: "short", glasses: true,
    hairColor: "#2D3436", outfitColor: "#636E72",
    buildingName: "House NA",
  },
  "永山祐子": {
    gender: "female", hairStyle: "long", glasses: false,
    hairColor: "#2D3436", outfitColor: "#6C5CE7",
    buildingName: "ドバイ万博日本館",
  },
  // ESFJ
  "山本理顕": {
    gender: "male", hairStyle: "short", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#2D3436",
    buildingName: "横須賀美術館",
  },
  "手塚貴晴＋手塚由比": {
    gender: "male", hairStyle: "short", glasses: false,
    hairColor: "#2D3436", outfitColor: "#00B894",
    buildingName: "ふじようちえん",
  },
  // ESFP
  "隈研吾": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#2D3436",
    buildingName: "国立競技場",
  },
  "坂茂": {
    gender: "male", hairStyle: "short", glasses: false,
    hairColor: "#2D3436", outfitColor: "#636E72",
    buildingName: "紙の教会",
  },
  // ENTJ
  "黒川紀章": {
    gender: "male", hairStyle: "swept", glasses: true,
    hairColor: "#2D3436", outfitColor: "#2D3436",
    buildingName: "中銀カプセルタワー",
  },
  "磯崎新": {
    gender: "male", hairStyle: "bald", glasses: true,
    hairColor: "#B2BEC3", outfitColor: "#2D3436",
    buildingName: "北九州市立美術館",
  },
  // ENTP
  "伊東豊雄": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#B2BEC3", outfitColor: "#2D3436",
    buildingName: "せんだいメディアテーク",
  },
  "石上純也": {
    gender: "male", hairStyle: "short", glasses: false,
    hairColor: "#2D3436", outfitColor: "#636E72",
    buildingName: "KAIT工房",
  },
  // ENFJ
  "安藤忠雄": {
    gender: "male", hairStyle: "curly", glasses: false,
    hairColor: "#4A4A4A", outfitColor: "#2D3436",
    buildingName: "光の教会",
  },
  "槇文彦": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#B2BEC3", outfitColor: "#34495E",
    buildingName: "スパイラル",
  },
  // ENFP
  "妹島和世": {
    gender: "female", hairStyle: "bob", glasses: false,
    hairColor: "#2D3436", outfitColor: "#2D3436",
    buildingName: "金沢21世紀美術館",
  },
  "藤森照信": {
    gender: "male", hairStyle: "curly", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#6D4C41",
    buildingName: "たんぽぽの家",
  },
  // ISTJ
  "谷口吉生": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#2D3436",
    buildingName: "法隆寺宝物館",
  },
  "内藤廣": {
    gender: "male", hairStyle: "short", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#34495E",
    buildingName: "海の博物館",
  },
  // ISTP
  "中村拓志": {
    gender: "male", hairStyle: "short", glasses: false,
    hairColor: "#2D3436", outfitColor: "#636E72",
    buildingName: "リボンチャペル",
  },
  "堀部安嗣": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#2D3436", outfitColor: "#2D3436",
    buildingName: "竹林寺納骨堂",
  },
  // ISFJ
  "吉村順三": {
    gender: "male", hairStyle: "swept", glasses: false,
    hairColor: "#4A4A4A", outfitColor: "#34495E",
    buildingName: "軽井沢の山荘",
  },
  "篠原一男": {
    gender: "male", hairStyle: "bald", glasses: true,
    hairColor: "#B2BEC3", outfitColor: "#2D3436",
    buildingName: "白の家",
  },
  // ISFP
  "西沢立衛": {
    gender: "male", hairStyle: "short", glasses: false,
    hairColor: "#2D3436", outfitColor: "#636E72",
    buildingName: "豊島美術館",
  },
  "石山修武": {
    gender: "male", hairStyle: "curly", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#6D4C41",
    buildingName: "幻庵",
  },
  // INTJ
  "原広司": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#B2BEC3", outfitColor: "#2D3436",
    buildingName: "京都駅ビル",
  },
  "青木淳": {
    gender: "male", hairStyle: "short", glasses: true,
    hairColor: "#2D3436", outfitColor: "#636E72",
    buildingName: "青森県立美術館",
  },
  // INTP
  "坂本一成": {
    gender: "male", hairStyle: "parted", glasses: true,
    hairColor: "#4A4A4A", outfitColor: "#34495E",
    buildingName: "House SA",
  },
  "長谷川逸子": {
    gender: "female", hairStyle: "bob", glasses: true,
    hairColor: "#2D3436", outfitColor: "#6C5CE7",
    buildingName: "湘南台文化センター",
  },
  // INFJ
  "村野藤吾": {
    gender: "male", hairStyle: "swept", glasses: true,
    hairColor: "#B2BEC3", outfitColor: "#2D3436",
    buildingName: "日生劇場",
  },
  "竹山聖": {
    gender: "male", hairStyle: "short", glasses: false,
    hairColor: "#2D3436", outfitColor: "#34495E",
    buildingName: "OXY乃木坂",
  },
  // INFP
  "藤井厚二": {
    gender: "male", hairStyle: "parted", glasses: false,
    hairColor: "#2D3436", outfitColor: "#34495E",
    buildingName: "聴竹居",
  },
  "中川エリカ": {
    gender: "female", hairStyle: "long", glasses: false,
    hairColor: "#2D3436", outfitColor: "#A29BFE",
    buildingName: "桃山ハウス",
  },
};
