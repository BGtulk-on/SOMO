'use client';

import { useState, useRef } from 'react';
import {
  SlidersHorizontal,
  Instagram,
  Youtube,
  Mail,
  Pen,
  Github,
  Linkedin,
  Atom,
  Plus,
  Trash2,
  X,
  Globe,
  Code,
  Sparkles,
  Heart,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import styles from './ProjectCanvas.module.scss';

export interface ProjectData {
  sharpLines?: boolean;
  fonts?: { id: string; name: string; sample: string }[];
  palette?: string[];
  signatureElements?: { id: string; text: string }[];
  identity?: {
    logoText?: string;
    iconText?: string;
    nameText?: string;
  };
  icons?: { id: string; iconKey: string }[];
  pictures?: { id: string; url: string }[];
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  data?: ProjectData;
}

interface ProjectCanvasProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onOpenSettings?: () => void;
}

const DEFAULT_FONTS = [
  { id: 'f1', name: 'Open Sans', sample: 'Aa Z-z Word 123' },
  { id: 'f2', name: 'Crafty Girls', sample: 'A-a Z-2 Word 123' },
];

const DEFAULT_PALETTE = [
  '#ff9494',
  '#86efac',
  '#93c5fd',
  '#fde047',
  '#fef08a',
  '#fdfbe8',
];

const DEFAULT_SIGNATURE = [
  { id: 's1', text: 'EL' },
  { id: 's2', text: 'E' },
  { id: 's3', text: 'ME' },
  { id: 's4', text: 'NTS' },
];

const DEFAULT_IDENTITY = {
  logoText: 'LOGO',
  iconText: 'ICON',
  nameText: 'NAME',
};

const DEFAULT_ICONS_3X3 = [
  { id: 'i1', iconKey: 'settings' },
  { id: 'i2', iconKey: 'instagram' },
  { id: 'i3', iconKey: 'youtube' },
  { id: 'i4', iconKey: 'mail' },
  { id: 'i5', iconKey: 'pen' },
  { id: 'i6', iconKey: 'github' },
  { id: 'i7', iconKey: 'linkedin' },
  { id: 'i8', iconKey: 'atom' },
];

const SAMPLE_PICTURES = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="%231a2332"/><path d="M40 180 L100 90 L150 150 L180 110 L210 180 Z" fill="%23f16b24"/><circle cx="80" cy="70" r="24" fill="%23439b38"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="%23141b26"/><path d="M30 190 L90 110 L140 160 L180 120 L210 190 Z" fill="%233b82f6"/><circle cx="160" cy="70" r="22" fill="%23facc15"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="%231f1826"/><path d="M40 185 L110 95 L160 155 L190 125 L215 185 Z" fill="%23ec4899"/><circle cx="75" cy="65" r="25" fill="%23a855f7"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="%2316221d"/><path d="M35 180 L105 100 L145 145 L180 115 L210 180 Z" fill="%2310b981"/><circle cx="150" cy="65" r="20" fill="%236ee7b7"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="%23241d1a"/><path d="M40 185 L95 105 L150 160 L185 120 L210 185 Z" fill="%23f97316"/><circle cx="85" cy="65" r="22" fill="%23eab308"/></svg>',
];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  settings: SlidersHorizontal,
  instagram: Instagram,
  youtube: Youtube,
  mail: Mail,
  pen: Pen,
  github: Github,
  linkedin: Linkedin,
  atom: Atom,
  globe: Globe,
  code: Code,
  sparkles: Sparkles,
  heart: Heart,
  camera: Camera,
};

export function ProjectCanvas({ project, onUpdateProject }: ProjectCanvasProps) {
  const data = project.data || {};
  const isSharp = !!data.sharpLines;

  const fonts = data.fonts || [];
  const palette = data.palette || [];
  const signature = data.signatureElements || [];
  const identity = data.identity || null;
  const icons = data.icons || [];
  const pictures = data.pictures || [];

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [activeColorIdx, setActiveColorIdx] = useState<number | null>(null);

  const saveUpdates = (partial: Partial<ProjectData>) => {
    onUpdateProject({
      ...project,
      data: {
        ...data,
        ...partial,
      },
    });
  };

  const handleToggleFonts = () => {
    if (fonts.length === 0) {
      saveUpdates({ fonts: DEFAULT_FONTS });
    }
  };

  const handleAddFont = () => {
    const next = [
      ...fonts,
      { id: String(Date.now()), name: 'Inter', sample: 'Aa Z-z Word 123' },
    ];
    saveUpdates({ fonts: next });
  };

  const handleTogglePalette = () => {
    if (palette.length === 0) {
      saveUpdates({ palette: DEFAULT_PALETTE });
    }
  };

  const handleOpenColorPicker = (index: number) => {
    setActiveColorIdx(index);
    if (colorInputRef.current) {
      colorInputRef.current.value = palette[index] || '#f16b24';
      colorInputRef.current.click();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeColorIdx === null) return;
    const next = [...palette];
    next[activeColorIdx] = e.target.value;
    saveUpdates({ palette: next });
  };

  const handleRemoveColor = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    saveUpdates({ palette: palette.filter((_, i) => i !== index) });
  };

  const handleToggleSignature = () => {
    if (signature.length === 0) {
      saveUpdates({ signatureElements: DEFAULT_SIGNATURE });
    }
  };

  const handleToggleIdentity = () => {
    if (!identity) {
      saveUpdates({ identity: DEFAULT_IDENTITY });
    }
  };

  const handleToggleIcons = () => {
    if (icons.length === 0) {
      saveUpdates({ icons: DEFAULT_ICONS_3X3 });
    }
  };

  const handleSelectIcon = (key: string) => {
    const next = [...icons, { id: String(Date.now()), iconKey: key }];
    saveUpdates({ icons: next });
    setIsPickerOpen(false);
  };

  const handleRemoveIcon = (id: string) => {
    saveUpdates({ icons: icons.filter((i) => i.id !== id) });
  };

  const handleTogglePictures = () => {
    if (pictures.length === 0) {
      const initial = SAMPLE_PICTURES.map((url, i) => ({ id: `pic_${i}`, url }));
      saveUpdates({ pictures: initial });
    }
  };

  const handleUploadPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const next = [...pictures, { id: String(Date.now()), url: reader.result }];
        saveUpdates({ pictures: next });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePicture = (id: string) => {
    saveUpdates({ pictures: pictures.filter((p) => p.id !== id) });
  };

  return (
    <div className={styles.canvasWrapper}>
      <input
        ref={colorInputRef}
        type="color"
        style={{ display: 'none' }}
        onChange={handleColorChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleUploadPicture}
      />

      <div className={styles.canvasBoard}>
        <div className={styles.leftColumn}>
          <div className={`${styles.canvasCard} ${styles.fontsCard} ${isSharp ? styles.sharp : ''}`}>
            {fonts.length === 0 ? (
              <div
                className={`${styles.fontsBlank} ${isSharp ? styles.sharp : ''}`}
                onClick={handleToggleFonts}
              >
                <div className={styles.blankTitle}>
                  <div>ADD</div>
                  <div>FONTS</div>
                </div>
              </div>
            ) : (
              <div className={styles.fontsContent}>
                <div className={styles.fontRow}>
                  <span className={styles.fontTitle}>{fonts[0]?.name || 'Open Sans'}</span>
                  <span className={styles.fontSample}>{fonts[0]?.sample || 'Aa Z-z Word 123'}</span>
                </div>
                <div className={styles.fontDivider} />
                <div className={styles.fontRow}>
                  <span className={styles.fontTitle}>{fonts[1]?.name || 'Crafty Girls'}</span>
                  <span className={styles.fontSample}>{fonts[1]?.sample || 'A-a Z-2 Word 123'}</span>
                </div>
                <div className={styles.fontDotsRow}>
                  <span className={styles.dotsIcon}>• • •</span>
                  <button
                    type="button"
                    className={styles.addFontSmallBtn}
                    onClick={handleAddFont}
                  >
                    + Add
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={`${styles.canvasCard} ${styles.elementsCard} ${isSharp ? styles.sharp : ''}`}>
            {signature.length === 0 ? (
              <div
                className={`${styles.elementsBlank} ${isSharp ? styles.sharp : ''}`}
                onClick={handleToggleSignature}
              >
                <div className={styles.blankTitle}>
                  <div>ADD</div>
                  <div>SIGNATURE</div>
                  <div>ELEMENTS</div>
                  <div style={{ marginTop: '4px' }}>+</div>
                </div>
              </div>
            ) : (
              <div className={`${styles.elementsQuadrantGrid} ${isSharp ? styles.sharp : ''}`}>
                <div className={styles.quadrantDividerH} />
                <div className={styles.quadrantDividerV} />

                <div className={styles.quadrantCell}>
                  <span className={styles.quadrantLabel}>{signature[0]?.text || 'EL'}</span>
                </div>
                <div className={styles.quadrantCell}>
                  <span className={styles.quadrantLabel}>{signature[1]?.text || 'E'}</span>
                </div>
                <div className={styles.quadrantCell}>
                  <span className={styles.quadrantLabel}>{signature[2]?.text || 'ME'}</span>
                </div>
                <div className={styles.quadrantCell}>
                  <span className={styles.quadrantLabel}>{signature[3]?.text || 'NTS'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.canvasCard} ${styles.paletteCard} ${isSharp ? styles.sharp : ''}`}>
          {palette.length === 0 ? (
            <div
              className={`${styles.paletteBlank} ${isSharp ? styles.sharp : ''}`}
              onClick={handleTogglePalette}
            >
              <div className={styles.blankTitle}>ADD COLOR PALETE</div>
            </div>
          ) : (
            <div className={styles.paletteStripsContainer}>
              {palette.map((color, idx) => (
                <div
                  key={idx}
                  className={styles.paletteStrip}
                  style={{ backgroundColor: color }}
                  onClick={() => handleOpenColorPicker(idx)}
                >
                  <span className={styles.stripHex}>{color}</span>
                  <button
                    type="button"
                    className={styles.stripRemove}
                    onClick={(e) => handleRemoveColor(e, idx)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`${styles.canvasCard} ${styles.logoBox} ${isSharp ? styles.sharp : ''}`}
          onClick={handleToggleIdentity}
        >
          {!identity ? (
            <div className={`${styles.logoBlank} ${isSharp ? styles.sharp : ''}`}>
              <div className={styles.logoBlankTitle}>
                <div>ADD:</div>
                <div>ICON</div>
                <div>LOGO</div>
                <div>NAME</div>
              </div>
            </div>
          ) : (
            <div className={styles.logoBadgeStack}>
              <span className={styles.logoBadgeName}>{identity.logoText || 'LOGO'}</span>
              <div className={styles.logoBadgeSlashes} />
              <span className={styles.logoBadgeSubtitle}>{identity.iconText || 'ICON'}</span>
              <span className={styles.logoBadgeSubtitle}>{identity.nameText || 'NAME'}</span>
            </div>
          )}
        </div>

        <div className={`${styles.canvasCard} ${styles.iconsCard} ${isSharp ? styles.sharp : ''}`}>
          {icons.length === 0 ? (
            <div
              className={styles.iconsGrid3x3}
              onClick={handleToggleIcons}
            >
              <div className={`${styles.iconSlotSquare} ${styles.addTile} ${isSharp ? styles.sharp : ''}`}>
                <Plus size={16} />
              </div>
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className={`${styles.iconSlotSquare} ${styles.blankSlashed} ${isSharp ? styles.sharp : ''}`}
                />
              ))}
            </div>
          ) : (
            <div className={styles.iconsGrid3x3}>
              {icons.slice(0, 8).map((item) => {
                const Comp = ICON_MAP[item.iconKey] || Atom;
                return (
                  <div
                    key={item.id}
                    className={`${styles.iconSlotSquare} ${isSharp ? styles.sharp : ''}`}
                    onClick={() => handleRemoveIcon(item.id)}
                  >
                    <Comp size={18} />
                  </div>
                );
              })}
              <div
                className={`${styles.iconSlotSquare} ${styles.addTile} ${isSharp ? styles.sharp : ''}`}
                onClick={() => setIsPickerOpen(true)}
              >
                <Plus size={18} />
              </div>
            </div>
          )}
        </div>

        <div className={`${styles.canvasCard} ${styles.picturesCard} ${isSharp ? styles.sharp : ''}`}>
          {pictures.length === 0 ? (
            <div
              className={`${styles.picturesBlank} ${isSharp ? styles.sharp : ''}`}
              onClick={handleTogglePictures}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={36} className={styles.pictureBlankPlus} />
                <ImageIcon size={52} className={styles.pictureBlankPlus} />
              </div>
            </div>
          ) : (
            <div className={styles.picturesGrid3x2}>
              {pictures.slice(0, 5).map((pic) => (
                <div key={pic.id} className={`${styles.pictureSlot} ${isSharp ? styles.sharp : ''}`}>
                  <img src={pic.url} alt="Project asset" className={styles.pictureImage} />
                  <div className={styles.pictureOverlay}>
                    <button
                      type="button"
                      className={styles.pictureDeleteBtn}
                      onClick={() => handleRemovePicture(pic.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div
                className={`${styles.pictureSlot} ${styles.addTile} ${isSharp ? styles.sharp : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={26} />
              </div>
            </div>
          )}
        </div>
      </div>

      {isPickerOpen && (
        <div className={styles.pickerBackdrop} onClick={() => setIsPickerOpen(false)}>
          <div
            className={`${styles.pickerModal} ${isSharp ? styles.sharp : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className={styles.pickerTitle}>
              Select Icon
              <button
                type="button"
                className={styles.pickerCloseBtn}
                onClick={() => setIsPickerOpen(false)}
              >
                <X size={18} />
              </button>
            </h4>
            <div className={styles.iconSelectionGrid}>
              {Object.entries(ICON_MAP).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.iconOptionBtn} ${isSharp ? styles.sharp : ''}`}
                  onClick={() => handleSelectIcon(key)}
                >
                  <Icon size={22} />
                  <span>{key}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
