export interface Architect {
  name: string;
  works: string[];
  trait: string; // タイプ内での区別特徴
}

export interface MBTIType {
  code: string;
  name: string;
  reading: string;
  catchcopy: string;
  architects: [Architect, Architect];
}

export const mbtiTypes: Record<string, MBTIType> = {
  ESTJ: {
    code: "ESTJ",
    name: "鉄骨型棟梁",
    reading: "てっこつがたとうりょう",
    catchcopy: "都市という巨大な図面を、鉄の意志で引く",
    architects: [
      {
        name: "丹下健三",
        works: ["代々木体育館", "東京都庁", "広島平和記念資料館"],
        trait: "国家規模のビジョンを構造と造形で実現する、ダイナミックな統率者",
      },
      {
        name: "前川國男",
        works: ["東京文化会館", "神奈川県立図書館・音楽堂"],
        trait: "師の教えを日本の風土に落とし込む、堅実かつ信念の人",
      },
    ],
  },
  ESTP: {
    code: "ESTP",
    name: "仮設型破壊者",
    reading: "かせつがたはかいしゃ",
    catchcopy: "壊していい。また建てればいい。スピードこそ構造だ",
    architects: [
      {
        name: "藤本壮介",
        works: ["House NA", "大阪万博リング", "武蔵野美術大学図書館"],
        trait: "常識を軽やかに壊し、新しい空間の原理を次々と試す実験者",
      },
      {
        name: "永山祐子",
        works: ["ドバイ万博日本館", "JINS渋谷店"],
        trait: "テクノロジーと感性を掛け合わせ、都市にインパクトを与える行動派",
      },
    ],
  },
  ESFJ: {
    code: "ESFJ",
    name: "長屋型世話人",
    reading: "ながやがたせわにん",
    catchcopy: "住人の顔が見える距離に、いつも建築がある",
    architects: [
      {
        name: "山本理顕",
        works: ["横須賀美術館", "名古屋造形大学"],
        trait: "地域社会のつながりを建築で可視化する、コミュニティの設計者",
      },
      {
        name: "手塚貴晴＋手塚由比",
        works: ["ふじようちえん", "屋根の家"],
        trait: "子供や家族の笑顔を設計の中心に据える、幸福の建築家",
      },
    ],
  },
  ESFP: {
    code: "ESFP",
    name: "祝祭型空間師",
    reading: "しゅくさいがたくうかんし",
    catchcopy: "建築はステージだ。素材が踊り、人が歌う",
    architects: [
      {
        name: "隈研吾",
        works: ["国立競技場", "根津美術館", "浅草文化観光センター"],
        trait: "自然素材を祝祭的に操り、場所に溶け込む建築を世界中に展開する表現者",
      },
      {
        name: "坂茂",
        works: ["紙の教会", "ポンピドゥー・メス", "紙のログハウス"],
        trait: "紙や木など身近な素材で人を救い、建築の可能性を拡張する行動の人",
      },
    ],
  },
  ENTJ: {
    code: "ENTJ",
    name: "都市型預言者",
    reading: "としがたよげんしゃ",
    catchcopy: "100年後の地図は、今日の設計図から始まる",
    architects: [
      {
        name: "黒川紀章",
        works: ["中銀カプセルタワー", "国立新美術館"],
        trait: "メタボリズムで未来都市を構想した、理論と行動のビジョナリスト",
      },
      {
        name: "磯崎新",
        works: ["つくばセンタービル", "北九州市立美術館"],
        trait: "歴史と前衛を横断し、建築思想そのものを設計する知の巨人",
      },
    ],
  },
  ENTP: {
    code: "ENTP",
    name: "浮遊型錬金術師",
    reading: "ふゆうがたれんきんじゅつし",
    catchcopy: "重力？ルール？それ、本当に必要ですか？",
    architects: [
      {
        name: "伊東豊雄",
        works: ["せんだいメディアテーク", "台中国家歌劇院"],
        trait: "流動的な空間概念で建築の枠組みを溶かし続ける、変化の建築家",
      },
      {
        name: "石上純也",
        works: ["KAIT工房", "水庭"],
        trait: "物理の限界に挑み、見たことのない風景を現実にする極限の詩人",
      },
    ],
  },
  ENFJ: {
    code: "ENFJ",
    name: "光壁型導師",
    reading: "こうへきがたどうし",
    catchcopy: "コンクリートにスリットを入れれば、光が言葉になる",
    architects: [
      {
        name: "安藤忠雄",
        works: ["光の教会", "直島地中美術館", "住吉の長屋"],
        trait: "コンクリートと光で人の心を動かす、独学の求道者にしてカリスマ",
      },
      {
        name: "槇文彦",
        works: ["幕張メッセ", "スパイラル", "代官山ヒルサイドテラス"],
        trait: "都市のコンテクストを読み解き、品格ある空間を導く穏やかな指導者",
      },
    ],
  },
  ENFP: {
    code: "ENFP",
    name: "透明型妖精",
    reading: "とうめいがたようせい",
    catchcopy: "壁をなくせば、世界はもっと仲良くなれる",
    architects: [
      {
        name: "妹島和世",
        works: ["金沢21世紀美術館", "ルーヴル・ランス"],
        trait: "透明で軽やかな空間で人と人の境界を溶かす、繊細な革命家",
      },
      {
        name: "藤森照信",
        works: ["たんぽぽの家", "空飛ぶ泥舟", "ラ コリーナ近江八幡"],
        trait: "自然と建築の境界を遊びながら消す、縄文的ファンタジスト",
      },
    ],
  },
  ISTJ: {
    code: "ISTJ",
    name: "目地型求道者",
    reading: "めじがたぐどうしゃ",
    catchcopy: "0.5mmの目地にこそ、建築の魂が宿る",
    architects: [
      {
        name: "谷口吉生",
        works: ["MoMA新館", "法隆寺宝物館", "東京国立博物館法隆寺宝物館"],
        trait: "ミリ単位のディテールに魂を込める、静謐なる完璧主義者",
      },
      {
        name: "内藤廣",
        works: ["海の博物館", "島根県芸術文化センター"],
        trait: "構造の誠実さと素材への敬意で、時間に耐える建築を積み上げる職人",
      },
    ],
  },
  ISTP: {
    code: "ISTP",
    name: "陰影型刀匠",
    reading: "いんえいがたとうしょう",
    catchcopy: "光の入り方ひとつで、空間は刃物になる",
    architects: [
      {
        name: "中村拓志",
        works: ["リボンチャペル", "石の美術館"],
        trait: "自然と建築の接点を繊細に設計し、風景を変える一手を打つ職人",
      },
      {
        name: "堀部安嗣",
        works: ["竹林寺納骨堂", "OVERLAP HOUSE"],
        trait: "陰影と沈黙の中に美を見出す、禅的なまでの空間の鍛冶師",
      },
    ],
  },
  ISFJ: {
    code: "ISFJ",
    name: "縁側型守人",
    reading: "えんがわがたもりびと",
    catchcopy: "よい建築は、住んだ人が10年後に気づく",
    architects: [
      {
        name: "吉村順三",
        works: ["軽井沢の山荘", "奈良国立博物館"],
        trait: "住む人の暮らしに寄り添い、時を超えて愛される住宅を紡ぐ穏やかな名匠",
      },
      {
        name: "篠原一男",
        works: ["白の家", "上原通りの住宅"],
        trait: "日本の住宅に数学的美学を持ち込み、空間の本質を問い続けた理論家",
      },
    ],
  },
  ISFP: {
    code: "ISFP",
    name: "地形型隠者",
    reading: "ちけいがたいんじゃ",
    catchcopy: "建てるのではない。大地が自ら隆起するのを手伝うだけだ",
    architects: [
      {
        name: "西沢立衛",
        works: ["豊島美術館", "十和田市現代美術館"],
        trait: "地形と一体化する空間を生む、静かな感性の建築家",
      },
      {
        name: "石山修武",
        works: ["幻庵", "世田谷村"],
        trait: "大地と対話しセルフビルドで空間を生む、野生の建築家",
      },
    ],
  },
  INTJ: {
    code: "INTJ",
    name: "集落型哲人",
    reading: "しゅうらくがたてつじん",
    catchcopy: "空間には文法がある。それを書き換えるのが建築だ",
    architects: [
      {
        name: "原広司",
        works: ["京都駅ビル", "梅田スカイビル"],
        trait: "集落調査から独自の空間理論を構築し、巨大建築に知の体系を注ぎ込む哲学者",
      },
      {
        name: "青木淳",
        works: ["青森県立美術館", "ルイ・ヴィトン表参道"],
        trait: "論理と遊びを同居させ、空間の意味を更新し続ける知的アーティスト",
      },
    ],
  },
  INTP: {
    code: "INTP",
    name: "座標型解析者",
    reading: "ざひょうがたかいせきしゃ",
    catchcopy: "建築とは、空間に関する証明問題である",
    architects: [
      {
        name: "坂本一成",
        works: ["散田の家", "House SA"],
        trait: "住宅の構成を徹底的に分析し、空間の文法を解明する理論の建築家",
      },
      {
        name: "長谷川逸子",
        works: ["新潟市民芸術文化会館", "湘南台文化センター"],
        trait: "都市と建築の関係を独自の座標軸で解析する、知の探求者",
      },
    ],
  },
  INFJ: {
    code: "INFJ",
    name: "曲線型祈祷師",
    reading: "きょくせんがたきとうし",
    catchcopy: "美を信じない建築家は、建築を信じていない",
    architects: [
      {
        name: "村野藤吾",
        works: ["日生劇場", "新高輪プリンスホテル"],
        trait: "曲線と装飾に祈りを込め、建築に精神性を宿らせる美の求道者",
      },
      {
        name: "竹山聖",
        works: ["京都造形芸術大学", "OXY乃木坂"],
        trait: "言葉と空間を往復しながら、建築の詩学を紡ぐ知的祈祷師",
      },
    ],
  },
  INFP: {
    code: "INFP",
    name: "風土型夢想家",
    reading: "ふうどがたむそうか",
    catchcopy: "この土地の風を聴け。答えは最初からそこにあった",
    architects: [
      {
        name: "藤井厚二",
        works: ["聴竹居"],
        trait: "日本の気候風土を科学的に読み解き、理想の住まいを追い求めた環境建築の先駆者",
      },
      {
        name: "中川エリカ",
        works: ["桃山ハウス"],
        trait: "既存の風景に溶け込みながら新しい居場所を見出す、風土に寄り添う感性の建築家",
      },
    ],
  },
};

export const axisDefinitions = {
  EI: {
    label: "社交建築 vs 瞑想建築",
    left: { letter: "E", label: "社交建築", description: "人との関わりからインスピレーションを得る" },
    right: { letter: "I", label: "瞑想建築", description: "孤独な思索から生み出す" },
  },
  SN: {
    label: "素材主義 vs 概念主義",
    left: { letter: "S", label: "素材主義", description: "素材・環境から積み上げる" },
    right: { letter: "N", label: "概念主義", description: "コンセプトから降ろす" },
  },
  TF: {
    label: "構造論理 vs 空間感性",
    left: { letter: "T", label: "構造論理", description: "合理的構造で解く" },
    right: { letter: "F", label: "空間感性", description: "体験・感情で設計する" },
  },
  JP: {
    label: "完結主義 vs 即興主義",
    left: { letter: "J", label: "完結主義", description: "完璧なプランを練る" },
    right: { letter: "P", label: "即興主義", description: "プロセスで変化を受入れる" },
  },
};
