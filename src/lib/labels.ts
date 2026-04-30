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
      fun: 'Fun', kidsGallery: 'Gallery', startOver: 'Start Over',
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
      fun: 'Explore', kidsGallery: 'Kids Gallery', startOver: 'Reset',
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
      fun: 'Eğlence', kidsGallery: 'Galeri', startOver: 'Baştan Başla',
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
      fun: 'Keşfet', kidsGallery: 'Çocuk Galerisi', startOver: 'Sıfırla',
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
      fun: 'Fun', kidsGallery: 'Galerie', startOver: 'Recommencer',
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
      fun: 'Explorer', kidsGallery: 'Galerie Enfants', startOver: 'Réinitialiser',
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
      fun: 'Spaß', kidsGallery: 'Galerie', startOver: 'Neu Anfangen',
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
      fun: 'Entdecken', kidsGallery: 'Kindergalerie', startOver: 'Zurücksetzen',
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
      fun: 'Diversión', kidsGallery: 'Galería', startOver: 'Empezar de Nuevo',
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
      fun: 'Explorar', kidsGallery: 'Galería Infantil', startOver: 'Reiniciar',
      trash: 'Eliminar', sitDown: 'Salir del Lienzo', standUp: 'Levantarse',
      layers: 'Capas', tools: 'Herramientas',
      kidMode: 'Modo Niño', grannyMode: 'Modo Abuela',
      signIn: 'Iniciar Sesión', signOut: 'Cerrar Sesión', profile: 'Perfil',
      startCreating: 'Empezar a Crear', createDesign: 'Crear Diseño',
      letsMakeSomething: 'Comienza tu primera obra',
      startFirstPiece: 'Crea un diseño de caja de sombras y guárdalo para empezar tu pared personal.',
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
