import { getLang, Lang } from './i18n';

type LabelDict = {
  // Nav
  myRoom: string;
  showAndTell: string;
  // Toolbar
  save: string;
  colors: string;
  frame: string;
  shapes: string;
  // Panel
  shapePanel: string;
  grow: string;
  shrink: string;
  cut: string;
  fade: string;
  crumple: string;
  twin: string;
  toss: string;
  // General
  myBox: string;
  stencils: string;
  assets: string;
  fun: string;
  letters: string;
  kidsGallery: string;
  startOver: string;
  trash: string;
  sitDown: string;
  standUp: string;
  layers: string;
  tools: string;
  // Mode toggle
  kidMode: string;
  grannyMode: string;
  // Auth / nav
  signIn: string;
  signOut: string;
  profile: string;
  // Wall empty state
  startCreating: string;
  createDesign: string;
  letsMakeSomething: string;
  startFirstPiece: string;
};

type LabelsByMode = { kids: LabelDict; adult: LabelDict };

const LABELS_BY_LANG: Record<Lang, LabelsByMode> = {
  en: {
    kids: {
      myRoom: 'My Room', showAndTell: 'Show & Tell',
      save: 'Keep It!', colors: 'Colors', frame: 'Frame', shapes: 'Shapes',
      shapePanel: 'SHAPE', grow: 'Grow', shrink: 'Shrink', cut: 'Cut',
      fade: 'Fade', crumple: 'Crumple', twin: 'Twin', toss: 'Toss',
      myBox: 'My Treasure Box', stencils: 'Stencils', assets: 'My Stuff',
      letters: 'Letters', fun: 'Fun', kidsGallery: 'Gallery', startOver: 'Start Over',
      trash: 'Trash', sitDown: 'Sit Down', standUp: 'Stand Up',
      layers: 'Stack', tools: 'Magic Tools',
      kidMode: 'Kid Mode', grannyMode: 'Granny Mode',
      signIn: 'Sign In', signOut: 'Bye!', profile: 'Me',
      startCreating: '🖍️ Start Creating!', createDesign: 'Create Design',
      letsMakeSomething: "Let's make something!",
      startFirstPiece: 'Go create something awesome and it will show up here! ✨',
    },
    adult: {
      myRoom: 'Studio', showAndTell: 'Showcase',
      save: 'Save', colors: 'Swatches', frame: 'Display', shapes: 'Elements',
      shapePanel: 'ELEMENT', grow: 'Scale Up', shrink: 'Scale Down', cut: 'Delete',
      fade: 'Opacity', crumple: 'Distort', twin: 'Duplicate', toss: 'Remove',
      myBox: 'Library', stencils: 'Templates', assets: 'Assets',
      letters: 'Letters', fun: 'Explore', kidsGallery: 'Kids Gallery', startOver: 'Reset',
      trash: 'Delete', sitDown: 'Exit Canvas', standUp: 'Stand Up',
      layers: 'Layers', tools: 'Tools',
      kidMode: 'Kid Mode', grannyMode: 'Granny Mode',
      signIn: 'Sign In', signOut: 'Sign Out', profile: 'Profile',
      startCreating: 'Start Creating', createDesign: 'Create Design',
      letsMakeSomething: 'Start your first piece',
      startFirstPiece: 'Create a shadow box design and save it to begin building your personal wall.',
    },
  },
  tr: {
    kids: {
      myRoom: 'Odam', showAndTell: 'Göster Anlat',
      save: 'Sakla!', colors: 'Renkler', frame: 'Çerçeve', shapes: 'Şekiller',
      shapePanel: 'ŞEKİL', grow: 'Büyüt', shrink: 'Küçült', cut: 'Kes',
      fade: 'Soldur', crumple: 'Buruştur', twin: 'İkizle', toss: 'At',
      myBox: 'Hazine Sandığım', stencils: 'Şablonlar', assets: 'Eşyalarım',
      letters: 'Harfler', fun: 'Eğlence', kidsGallery: 'Galeri', startOver: 'Baştan Başla',
      trash: 'Çöp', sitDown: 'Otur', standUp: 'Kalk',
      layers: 'Katmanlar', tools: 'Sihirli Aletler',
      kidMode: 'Çocuk Modu', grannyMode: 'Nine Modu',
      signIn: 'Giriş', signOut: 'Hoşça Kal!', profile: 'Ben',
      startCreating: '🖍️ Hadi Başla!', createDesign: 'Tasarım Yap',
      letsMakeSomething: 'Hadi bir şey yapalım!',
      startFirstPiece: 'Git harika bir şey yap, burada görünecek! ✨',
    },
    adult: {
      myRoom: 'Stüdyo', showAndTell: 'Vitrin',
      save: 'Kaydet', colors: 'Paletler', frame: 'Sergi', shapes: 'Öğeler',
      shapePanel: 'ÖĞE', grow: 'Büyüt', shrink: 'Küçült', cut: 'Sil',
      fade: 'Opaklık', crumple: 'Bozulma', twin: 'Çoğalt', toss: 'Kaldır',
      myBox: 'Kütüphane', stencils: 'Şablonlar', assets: 'Varlıklar',
      letters: 'Harfler', fun: 'Keşfet', kidsGallery: 'Çocuk Galerisi', startOver: 'Sıfırla',
      trash: 'Sil', sitDown: 'Tuvalden Çık', standUp: 'Kalk',
      layers: 'Katmanlar', tools: 'Araçlar',
      kidMode: 'Çocuk Modu', grannyMode: 'Nine Modu',
      signIn: 'Giriş Yap', signOut: 'Çıkış Yap', profile: 'Profil',
      startCreating: 'Oluşturmaya Başla', createDesign: 'Tasarım Oluştur',
      letsMakeSomething: 'İlk eserinize başlayın',
      startFirstPiece: 'Bir gölge kutusu tasarımı oluşturun ve duvarınızı kurmaya başlayın.',
    },
  },
  fr: {
    kids: {
      myRoom: 'Ma Chambre', showAndTell: 'Montre & Raconte',
      save: 'Garde-le!', colors: 'Couleurs', frame: 'Cadre', shapes: 'Formes',
      shapePanel: 'FORME', grow: 'Grandir', shrink: 'Rétrécir', cut: 'Couper',
      fade: 'Estomper', crumple: 'Froisser', twin: 'Jumeler', toss: 'Jeter',
      myBox: 'Mon Coffre au Trésor', stencils: 'Pochoirs', assets: 'Mes Trucs',
      letters: 'Lettres', fun: 'Fun', kidsGallery: 'Galerie', startOver: 'Recommencer',
      trash: 'Poubelle', sitDown: "S'asseoir", standUp: 'Se Lever',
      layers: 'Pile', tools: 'Outils Magiques',
      kidMode: 'Mode Enfant', grannyMode: 'Mode Mamie',
      signIn: 'Connexion', signOut: 'Au Revoir!', profile: 'Moi',
      startCreating: '🖍️ Commence à Créer!', createDesign: 'Créer un Design',
      letsMakeSomething: 'Créons quelque chose!',
      startFirstPiece: 'Va créer un truc génial et il apparaîtra ici! ✨',
    },
    adult: {
      myRoom: 'Studio', showAndTell: 'Vitrine',
      save: 'Enregistrer', colors: 'Échantillons', frame: 'Affichage', shapes: 'Éléments',
      shapePanel: 'ÉLÉMENT', grow: 'Agrandir', shrink: 'Réduire', cut: 'Supprimer',
      fade: 'Opacité', crumple: 'Déformer', twin: 'Dupliquer', toss: 'Retirer',
      myBox: 'Bibliothèque', stencils: 'Modèles', assets: 'Ressources',
      letters: 'Lettres', fun: 'Explorer', kidsGallery: 'Galerie Enfants', startOver: 'Réinitialiser',
      trash: 'Supprimer', sitDown: 'Quitter le Canevas', standUp: 'Se Lever',
      layers: 'Calques', tools: 'Outils',
      kidMode: 'Mode Enfant', grannyMode: 'Mode Mamie',
      signIn: 'Se Connecter', signOut: 'Se Déconnecter', profile: 'Profil',
      startCreating: 'Commencer à Créer', createDesign: 'Créer un Design',
      letsMakeSomething: 'Commencez votre première œuvre',
      startFirstPiece: "Créez un design de boîte d'ombre et sauvegardez-le pour commencer votre mur personnel.",
    },
  },
  de: {
    kids: {
      myRoom: 'Mein Zimmer', showAndTell: 'Zeig & Erzähl',
      save: 'Behalt es!', colors: 'Farben', frame: 'Rahmen', shapes: 'Formen',
      shapePanel: 'FORM', grow: 'Wachsen', shrink: 'Schrumpfen', cut: 'Schneiden',
      fade: 'Verblassen', crumple: 'Knittern', twin: 'Zwilling', toss: 'Werfen',
      myBox: 'Meine Schatzkiste', stencils: 'Schablonen', assets: 'Mein Zeug',
      letters: 'Buchstaben', fun: 'Spaß', kidsGallery: 'Galerie', startOver: 'Neu Anfangen',
      trash: 'Müll', sitDown: 'Hinsetzen', standUp: 'Aufstehen',
      layers: 'Stapel', tools: 'Zauberwerkzeuge',
      kidMode: 'Kinder-Modus', grannyMode: 'Oma-Modus',
      signIn: 'Anmelden', signOut: 'Tschüss!', profile: 'Ich',
      startCreating: '🖍️ Loslegen!', createDesign: 'Design Erstellen',
      letsMakeSomething: 'Lass uns etwas machen!',
      startFirstPiece: 'Mach was Tolles und es erscheint hier! ✨',
    },
    adult: {
      myRoom: 'Studio', showAndTell: 'Schaufenster',
      save: 'Speichern', colors: 'Muster', frame: 'Anzeige', shapes: 'Elemente',
      shapePanel: 'ELEMENT', grow: 'Vergrößern', shrink: 'Verkleinern', cut: 'Löschen',
      fade: 'Deckkraft', crumple: 'Verzerren', twin: 'Duplizieren', toss: 'Entfernen',
      myBox: 'Bibliothek', stencils: 'Vorlagen', assets: 'Ressourcen',
      letters: 'Buchstaben', fun: 'Entdecken', kidsGallery: 'Kindergalerie', startOver: 'Zurücksetzen',
      trash: 'Löschen', sitDown: 'Leinwand Verlassen', standUp: 'Aufstehen',
      layers: 'Ebenen', tools: 'Werkzeuge',
      kidMode: 'Kinder-Modus', grannyMode: 'Oma-Modus',
      signIn: 'Anmelden', signOut: 'Abmelden', profile: 'Profil',
      startCreating: 'Mit dem Erstellen Beginnen', createDesign: 'Design Erstellen',
      letsMakeSomething: 'Beginnen Sie Ihr erstes Werk',
      startFirstPiece: 'Erstellen Sie ein Schaukasten-Design und speichern Sie es, um Ihre persönliche Wand zu beginnen.',
    },
  },
  es: {
    kids: {
      myRoom: 'Mi Cuarto', showAndTell: 'Muestra y Cuenta',
      save: '¡Guárdalo!', colors: 'Colores', frame: 'Marco', shapes: 'Formas',
      shapePanel: 'FORMA', grow: 'Crecer', shrink: 'Encoger', cut: 'Cortar',
      fade: 'Difuminar', crumple: 'Arrugar', twin: 'Gemelo', toss: 'Tirar',
      myBox: 'Mi Cofre del Tesoro', stencils: 'Plantillas', assets: 'Mis Cosas',
      letters: 'Letras', fun: 'Diversión', kidsGallery: 'Galería', startOver: 'Empezar de Nuevo',
      trash: 'Basura', sitDown: 'Sentarse', standUp: 'Levantarse',
      layers: 'Pila', tools: 'Herramientas Mágicas',
      kidMode: 'Modo Niño', grannyMode: 'Modo Abuela',
      signIn: 'Entrar', signOut: '¡Adiós!', profile: 'Yo',
      startCreating: '🖍️ ¡A Crear!', createDesign: 'Crear Diseño',
      letsMakeSomething: '¡Hagamos algo!',
      startFirstPiece: '¡Ve a crear algo increíble y aparecerá aquí! ✨',
    },
    adult: {
      myRoom: 'Estudio', showAndTell: 'Vitrina',
      save: 'Guardar', colors: 'Muestras', frame: 'Exhibición', shapes: 'Elementos',
      shapePanel: 'ELEMENTO', grow: 'Ampliar', shrink: 'Reducir', cut: 'Eliminar',
      fade: 'Opacidad', crumple: 'Distorsionar', twin: 'Duplicar', toss: 'Quitar',
      myBox: 'Biblioteca', stencils: 'Plantillas', assets: 'Recursos',
      letters: 'Letras', fun: 'Explorar', kidsGallery: 'Galería Infantil', startOver: 'Reiniciar',
      trash: 'Eliminar', sitDown: 'Salir del Lienzo', standUp: 'Levantarse',
      layers: 'Capas', tools: 'Herramientas',
      kidMode: 'Modo Niño', grannyMode: 'Modo Abuela',
      signIn: 'Iniciar Sesión', signOut: 'Cerrar Sesión', profile: 'Perfil',
      startCreating: 'Empezar a Crear', createDesign: 'Crear Diseño',
      letsMakeSomething: 'Comienza tu primera obra',
      startFirstPiece: 'Crea un diseño de caja de sombras y guárdalo para empezar tu pared personal.',
    },
  },
  nl: {
    kids: {
      myRoom: 'Mijn Kamer', showAndTell: 'Laten Zien',
      save: 'Bewaar Het!', colors: 'Kleuren', frame: 'Lijst', shapes: 'Vormen',
      shapePanel: 'VORM', grow: 'Groter', shrink: 'Kleiner', cut: 'Knippen',
      fade: 'Vervagen', crumple: 'Kreukelen', twin: 'Tweeling', toss: 'Weggooien',
      myBox: 'Mijn Schatkist', stencils: 'Sjablonen', assets: 'Mijn Spullen',
      letters: 'Letters', fun: 'Plezier', kidsGallery: 'Galerij', startOver: 'Opnieuw',
      trash: 'Prullenbak', sitDown: 'Ga Zitten', standUp: 'Sta Op',
      layers: 'Stapel', tools: 'Toverspullen',
      kidMode: 'Kindermodus', grannyMode: 'Omamodus',
      signIn: 'Inloggen', signOut: 'Doei!', profile: 'Ik',
      startCreating: '🖍️ Begin Met Maken!', createDesign: 'Ontwerp Maken',
      letsMakeSomething: 'Laten we iets maken!',
      startFirstPiece: 'Maak iets geweldigs en het verschijnt hier! ✨',
    },
    adult: {
      myRoom: 'Atelier', showAndTell: 'Etalage',
      save: 'Opslaan', colors: 'Stalen', frame: 'Weergave', shapes: 'Elementen',
      shapePanel: 'ELEMENT', grow: 'Vergroten', shrink: 'Verkleinen', cut: 'Verwijderen',
      fade: 'Dekking', crumple: 'Vervormen', twin: 'Dupliceren', toss: 'Weghalen',
      myBox: 'Bibliotheek', stencils: 'Sjablonen', assets: 'Materialen',
      letters: 'Letters', fun: 'Ontdekken', kidsGallery: 'Kindergalerij', startOver: 'Opnieuw Beginnen',
      trash: 'Verwijderen', sitDown: 'Doek Verlaten', standUp: 'Opstaan',
      layers: 'Lagen', tools: 'Gereedschap',
      kidMode: 'Kindermodus', grannyMode: 'Omamodus',
      signIn: 'Inloggen', signOut: 'Uitloggen', profile: 'Profiel',
      startCreating: 'Begin Met Maken', createDesign: 'Ontwerp Maken',
      letsMakeSomething: 'Begin je eerste werk',
      startFirstPiece: 'Maak een lijstontwerp en sla het op om je eigen muur te beginnen.',
    },
  },
  zh: {
    kids: {
      myRoom: '我的房间', showAndTell: '展示时间',
      save: '保存！', colors: '颜色', frame: '画框', shapes: '形状',
      shapePanel: '形状', grow: '变大', shrink: '变小', cut: '剪掉',
      fade: '变淡', crumple: '揉皱', twin: '复制', toss: '扔掉',
      myBox: '我的百宝箱', stencils: '模板', assets: '我的东西',
      letters: '字母', fun: '好玩', kidsGallery: '画廊', startOver: '重新开始',
      trash: '垃圾桶', sitDown: '坐下', standUp: '站起来',
      layers: '叠放', tools: '魔法工具',
      kidMode: '儿童模式', grannyMode: '奶奶模式',
      signIn: '登录', signOut: '再见！', profile: '我',
      startCreating: '🖍️ 开始创作！', createDesign: '创作作品',
      letsMakeSomething: '一起来做点什么吧！',
      startFirstPiece: '快去创作很棒的作品，它会出现在这里！✨',
    },
    adult: {
      myRoom: '工作室', showAndTell: '展示',
      save: '保存', colors: '布样', frame: '展示', shapes: '元素',
      shapePanel: '元素', grow: '放大', shrink: '缩小', cut: '删除',
      fade: '透明度', crumple: '变形', twin: '复制', toss: '移除',
      myBox: '素材库', stencils: '模板', assets: '素材',
      letters: '字母', fun: '探索', kidsGallery: '儿童画廊', startOver: '重置',
      trash: '删除', sitDown: '退出画布', standUp: '站起来',
      layers: '图层', tools: '工具',
      kidMode: '儿童模式', grannyMode: '奶奶模式',
      signIn: '登录', signOut: '退出登录', profile: '个人资料',
      startCreating: '开始创作', createDesign: '创作作品',
      letsMakeSomething: '开始你的第一件作品',
      startFirstPiece: '创作一个画框作品并保存，开始打造你的个人作品墙。',
    },
  },
  ja: {
    kids: {
      myRoom: 'マイルーム', showAndTell: 'みせっこ',
      save: 'とっておく！', colors: 'いろ', frame: 'がくぶち', shapes: 'かたち',
      shapePanel: 'かたち', grow: 'おおきく', shrink: 'ちいさく', cut: 'きる',
      fade: 'うすく', crumple: 'くしゃくしゃ', twin: 'ふたご', toss: 'すてる',
      myBox: 'たからばこ', stencils: 'ステンシル', assets: 'わたしのもの',
      letters: 'もじ', fun: 'たのしい', kidsGallery: 'ギャラリー', startOver: 'さいしょから',
      trash: 'ごみばこ', sitDown: 'すわる', standUp: 'たつ',
      layers: 'かさね', tools: 'まほうのどうぐ',
      kidMode: 'キッズモード', grannyMode: 'おばあちゃんモード',
      signIn: 'ログイン', signOut: 'バイバイ！', profile: 'わたし',
      startCreating: '🖍️ つくろう！', createDesign: 'さくひんをつくる',
      letsMakeSomething: 'なにかつくろう！',
      startFirstPiece: 'すてきなものをつくると、ここにでてくるよ！✨',
    },
    adult: {
      myRoom: 'スタジオ', showAndTell: 'ショーケース',
      save: '保存', colors: 'スウォッチ', frame: '展示', shapes: '要素',
      shapePanel: '要素', grow: '拡大', shrink: '縮小', cut: '削除',
      fade: '不透明度', crumple: '変形', twin: '複製', toss: '取り除く',
      myBox: 'ライブラリ', stencils: 'テンプレート', assets: '素材',
      letters: '文字', fun: '探す', kidsGallery: 'キッズギャラリー', startOver: 'リセット',
      trash: '削除', sitDown: 'キャンバスを出る', standUp: '立つ',
      layers: 'レイヤー', tools: 'ツール',
      kidMode: 'キッズモード', grannyMode: 'おばあちゃんモード',
      signIn: 'ログイン', signOut: 'ログアウト', profile: 'プロフィール',
      startCreating: '作品をつくる', createDesign: 'デザインを作成',
      letsMakeSomething: '最初の作品をはじめましょう',
      startFirstPiece: 'シャドーボックスのデザインを作って保存し、あなたの壁をつくりはじめましょう。',
    },
  },
};

// Back-compat export (English only) for any code reading LABELS directly.
export const LABELS = {
  kids: LABELS_BY_LANG.en.kids,
  adult: LABELS_BY_LANG.en.adult,
} as const;

export type ModeLabels = LabelDict;

export function getLabels(kidMode: boolean, lang?: Lang): ModeLabels {
  const l = lang ?? getLang();
  const bucket = LABELS_BY_LANG[l] ?? LABELS_BY_LANG.en;
  return kidMode ? bucket.kids : bucket.adult;
}
