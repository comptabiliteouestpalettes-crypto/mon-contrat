import { useState, useEffect } from "react";

// ── DONNÉES PALETTES ──────────────────────────────────────────
const TARIFS_DEFAUT = [
  { libelle: "Palette 080x120 Europe", prix: "1,20", unite: "pièce" },
  { libelle: "Coupe planches", prix: "0,30", unite: "pièce" },
  { libelle: "Démontage palettes", prix: "0,30", unite: "pièce" },
  { libelle: "Modification palettes (et réduction)", prix: "2,00", unite: "pièce" },
  { libelle: "Montage palettes", prix: "0,70", unite: "pièce" },
  { libelle: "Autres réparations", prix: "0,80", unite: "pièce" },
  { libelle: "Palette 080x120 Lourde", prix: "1,00", unite: "pièce" },
  { libelle: "Palette 080x120 Mi-Lourde", prix: "0,80", unite: "pièce" },
  { libelle: "Palette 080x120 Légère", prix: "0,80", unite: "pièce" },
  { libelle: "Montage palettes 65x92", prix: "1,00", unite: "pièce" },
  { libelle: "Fabrication", prix: "21,00", unite: "heure" },
  { libelle: "Tri Palette", prix: "24,00", unite: "heure" },
  { libelle: "Tri Palette Faty", prix: "30,00", unite: "heure" },
  { libelle: "Modification 80x200", prix: "5,00", unite: "pièce" },
  { libelle: "Modification 80x140", prix: "2,50", unite: "pièce" },
  { libelle: "Palette 060x080 à plot", prix: "1,40", unite: "pièce" },
  { libelle: "Palette 060x080 chevron", prix: "0,80", unite: "pièce" },
  { libelle: "Palette 060x080 débordante", prix: "0,80", unite: "pièce" },
  { libelle: "Modification 100x200", prix: "5,00", unite: "pièce" },
  { libelle: "Modification 80x80", prix: "1,00", unite: "pièce" },
  { libelle: "Fabrication 120x200", prix: "1,50", unite: "pièce" },
  { libelle: "Modification moy. palettes (et réduction)", prix: "3,00", unite: "pièce" },
  { libelle: "Palette 100x120 Lourde", prix: "1,10", unite: "pièce" },
  { libelle: "Palette 100x120 Mi-Lourde", prix: "0,90", unite: "pièce" },
  { libelle: "Palette 100x120 Légère", prix: "0,90", unite: "pièce" },
  { libelle: "Palette 076x115 ARMOR", prix: "1,50", unite: "pièce" },
  { libelle: "Modification 116x120", prix: "1,50", unite: "pièce" },
];

const EMPTY_PALETTES = {
  prestNom: "", prestAdresse: "", prestCpVille: "", prestSiret: "",
  prestCivilite: "M.", prestPrenom: "", prestNomFamille: "",
  objet: "le tri et la réparation de palettes",
  duree: "6", reconduction: "6",
  dateDebut: "", tribunal: "", dateSig: "",
};

// ── DONNÉES PALETTES — NOUVEAU MODÈLE (contrat-cadre à façon) ──
// L'ancien modèle ci-dessus est conservé pour réafficher les contrats déjà signés.
const TARIFS_DEFAUT_V2 = [
  { libelle: "Réparation / reconditionnement palette Europe (80×120)", prix: "1,00", unite: "pièce" },
  { libelle: "Réparation / reconditionnement palette Lourde (100×120)", prix: "0,80", unite: "pièce" },
  { libelle: "Réparation / reconditionnement palette Demi-lourde", prix: "0,75", unite: "pièce" },
  { libelle: "Réparation / reconditionnement palette Légère", prix: "0,70", unite: "pièce" },
  { libelle: "Fabrication palette (démontage + sciage planches + assemblage)", prix: "1,40", unite: "pièce" },
  { libelle: "Tri de palettes", prix: "140,00", unite: "jour" },
];

const EMPTY_PALETTES_V2 = {
  prestNom: "", prestForme: "Société par Actions Simplifiée à associé unique (SASU)", prestCapital: "",
  prestAdresse: "", prestCpVille: "", prestRcsVille: "", prestRcsNum: "", prestEuid: "",
  prestCivilite: "M.", prestPrenom: "", prestNomFamille: "", prestQualite: "Président",
  duree: "12", reconduction: "12", preavisRecon: "2", preavisBaisse: "1", delaiPaiement: "30",
  tribunal: "La Roche-sur-Yon", site: "", dateDebut: "", dateSig: "",
};

const FORMES_JURIDIQUES = [
  "Société par Actions Simplifiée à associé unique (SASU)",
  "Société par Actions Simplifiée (SAS)",
  "Entreprise Unipersonnelle à Responsabilité Limitée (EURL)",
  "Société à Responsabilité Limitée (SARL)",
  "Entreprise individuelle",
];

const UNITE_LABELS = { "pièce": "Palette", heure: "Heure", forfait: "Forfait", jour: "Forfait journalier", m3: "m³" };

const LETTRES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze",
  "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt", "vingt et un", "vingt-deux", "vingt-trois", "vingt-quatre"];
// "2" → "deux (2)"
const enLettres = (n) => {
  const i = parseInt(n, 10);
  return LETTRES[i] ? `${LETTRES[i]} (${i})` : `${n}`;
};

// ── DONNÉES CHAUFFEURS ────────────────────────────────────────
const TARIFS_CHAUFFEUR_DEFAUT = [
  { libelle: "Conduite véhicule PL/SPL", prix: "25,00", unite: "heure" },
  { libelle: "Chargement / déchargement palettes", prix: "22,00", unite: "heure" },
  { libelle: "Attente sur site", prix: "18,00", unite: "heure" },
  { libelle: "Livraison palettes", prix: "24,00", unite: "heure" },
  { libelle: "Collecte / ramassage palettes", prix: "24,00", unite: "heure" },
  { libelle: "Tournée mixte (livraison + collecte)", prix: "26,00", unite: "heure" },
];

const EMPTY_CHAUFFEUR = {
  ch_nom: "", ch_adresse: "", ch_cpVille: "", ch_siret: "",
  ch_civilite: "M.", ch_prenom: "", ch_nomFamille: "",
  ch_permis: "", ch_carte: "", ch_fco: "", ch_assurance: "",
  ch_objet: "la livraison et la collecte de palettes",
  ch_duree: "6", ch_recon: "6", ch_preavis: "30",
  ch_dateDebut: "", ch_tribunal: "", ch_dateSig: "",
  ch_freqFacturation: "mensuelle", ch_delaiPaiement: "15",
  ch_delaiValidationComptant: "",
  ch_probatoire: "oui", ch_probatoireJours: "15", ch_probatoirePreavis: "48",
  ch_joursTravailles: [],
};

const FACTURATION_LABELS = {
  mensuelle: "mensuelle",
  hebdomadaire: "hebdomadaire",
  quinzaine: "à la quinzaine",
  annuelle: "annuelle",
};

const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Formate une date ISO (YYYY-MM-DD) en "1er août 2025" ; ajoute un nombre de jours si fourni.
function formatDateFR(isoDate, addDays = 0) {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d)) return "";
  if (addDays) d.setDate(d.getDate() + addDays);
  const jour = d.getDate();
  const moisLabel = MOIS_FR[d.getMonth()];
  const jourLabel = jour === 1 ? "1er" : jour;
  return `${jourLabel} ${moisLabel} ${d.getFullYear()}`;
}

const STORAGE_KEY_PALETTES = "contrats_sauvegardes";
const STORAGE_KEY_CHAUFFEURS = "contrats_chauffeurs";

// ── STYLES COMMUNS ────────────────────────────────────────────
const inputBase = (focus) => ({
  width: "100%", padding: "9px 13px", borderRadius: "8px",
  border: `1.5px solid ${focus ? "#2A84C1" : "#CBD4DD"}`,
  background: focus ? "#FFFFFF" : "#F7F9FB",
  fontFamily: "'Crimson Pro',serif", fontSize: "15px", color: "#1B2430",
  outline: "none", boxSizing: "border-box",
  boxShadow: focus ? "0 0 0 3px rgba(42,132,193,.12)" : "none",
  transition: "border-color .2s, box-shadow .2s",
});

// ── COMPOSANTS COMMUNS ────────────────────────────────────────
function Field({ label, value, onChange, placeholder, hint, required, type = "text" }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block", fontFamily: "'Playfair Display',serif",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em",
        textTransform: "uppercase", color: focus ? "#2A84C1" : "#4A5563",
        marginBottom: "5px", transition: "color .2s",
      }}>
        {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
      </label>
      {hint && <p style={{ fontSize: "11px", color: "#8A94A2", margin: "-2px 0 5px", fontStyle: "italic" }}>{hint}</p>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={inputBase(focus)} />
    </div>
  );
}

function NumField({ label, value, onChange, required, suffix = "mois" }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block", fontFamily: "'Playfair Display',serif",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em",
        textTransform: "uppercase", color: focus ? "#2A84C1" : "#4A5563",
        marginBottom: "5px", transition: "color .2s",
      }}>
        {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input type="number" min="1" max="360" value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...inputBase(focus), width: "90px", textAlign: "center", fontWeight: "600", fontSize: "17px" }} />
        <span style={{ color: "#5D6877", fontFamily: "'Crimson Pro',serif", fontSize: "15px" }}>{suffix}</span>
      </div>
    </div>
  );
}

function DateField({ label, value, onChange, hint, required }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block", fontFamily: "'Playfair Display',serif",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em",
        textTransform: "uppercase", color: focus ? "#2A84C1" : "#4A5563",
        marginBottom: "5px", transition: "color .2s",
      }}>
        {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
      </label>
      {hint && <p style={{ fontSize: "11px", color: "#8A94A2", margin: "-2px 0 5px", fontStyle: "italic" }}>{hint}</p>}
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={inputBase(focus)} />
    </div>
  );
}


function SelectField({ label, value, onChange, options, required }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block", fontFamily: "'Playfair Display',serif",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em",
        textTransform: "uppercase", color: focus ? "#2A84C1" : "#4A5563",
        marginBottom: "5px", transition: "color .2s",
      }}>
        {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...inputBase(focus) }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "28px 32px",
      border: "1px solid #DCE3EA", boxShadow: "0 3px 18px rgba(27,36,48,.07)",
      marginBottom: "18px",
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display',serif", fontSize: "15px", color: "#2A84C1",
        margin: "0 0 22px", paddingBottom: "11px", borderBottom: "1px solid #E3EFF8",
        display: "flex", alignItems: "center", gap: "9px",
      }}>
        <span style={{
          background: "#2A84C1", color: "#fff", borderRadius: "50%",
          width: "24px", height: "24px", display: "inline-flex",
          alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0,
        }}>{num}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ClientBox({ qualite = "gérant" }) {
  return (
    <div style={{
      background: "#F1F5F9", borderRadius: "10px", padding: "13px 18px",
      border: "1px dashed #A9BFD3", marginBottom: "26px",
      fontFamily: "'Crimson Pro',serif", fontSize: "14px", color: "#4A5563",
    }}>
      <strong style={{ fontFamily: "'Playfair Display',serif", fontSize: "11px", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>
        Client — inchangé dans ce modèle
      </strong>
      SAS OUEST PALETTES — Le Four Lutton, 85140 La Merlatière<br />
      RCS 339 804 684 — Représenté par M. JEAUD Patrice, {qualite}
    </div>
  );
}

function BtnGenerer({ ok, onClick, enModification }) {
  return (
    <button onClick={() => ok && onClick()} style={{
      width: "100%", padding: "15px",
      background: ok ? "#2A84C1" : "#A9BFD3",
      color: "#fff", border: "none", borderRadius: "10px",
      fontFamily: "'Playfair Display',serif", fontSize: "16px", fontWeight: 700,
      cursor: ok ? "pointer" : "not-allowed", letterSpacing: ".04em",
      boxShadow: ok ? "0 4px 18px rgba(42,132,193,.35)" : "none",
      transition: "all .2s",
    }}>
      {!ok ? "Complétez les champs obligatoires *" : enModification ? "Enregistrer les modifications →" : "Générer et sauvegarder →"}
    </button>
  );
}

// ── LISTE CONTRATS (générique) ────────────────────────────────
function ListeContrats({ titre, badge, sousTitre, icon, contrats, onOuvrir, onSupprimer, onNouveau, etiquette, onModifier }) {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 16px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{
          display: "inline-block", background: "#2A84C1", color: "#fff",
          fontFamily: "'Playfair Display',serif", fontSize: "10px", fontWeight: 700,
          letterSpacing: ".2em", textTransform: "uppercase",
          padding: "3px 14px", borderRadius: "20px", marginBottom: "14px",
        }}>{badge}</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "28px", fontWeight: 700, color: "#1B2430", margin: "0 0 7px" }}>{titre}</h1>
        <p style={{ color: "#5D6877", fontSize: "15px", margin: 0, fontFamily: "'Crimson Pro',serif" }}>
          {contrats.length} contrat{contrats.length > 1 ? "s" : ""} sauvegardé{contrats.length > 1 ? "s" : ""}
        </p>
      </div>

      <button onClick={onNouveau} style={{
        width: "100%", padding: "14px",
        background: "#2A84C1", color: "#fff", border: "none", borderRadius: "10px",
        fontFamily: "'Playfair Display',serif", fontSize: "15px", fontWeight: 700,
        cursor: "pointer", letterSpacing: ".04em", marginBottom: "24px",
        boxShadow: "0 4px 18px rgba(42,132,193,.35)",
      }}>+ Nouveau contrat</button>

      {contrats.length === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 24px",
          background: "#fff", borderRadius: "16px", border: "1px solid #DCE3EA",
          color: "#8A94A2", fontFamily: "'Crimson Pro',serif", fontSize: "16px",
        }}>Aucun contrat sauvegardé pour le moment.</div>
      )}

      {contrats.map(c => (
        <div key={c.id} style={{
          background: "#fff", borderRadius: "12px", padding: "18px 22px",
          border: "1px solid #DCE3EA", boxShadow: "0 2px 12px rgba(27,36,48,.06)",
          marginBottom: "12px", display: "flex", alignItems: "center", gap: "16px",
        }}>
          <div style={{
            background: "#EAF3FA", borderRadius: "50%", width: "44px", height: "44px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
          }}>{icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "15px", color: "#1B2430", marginBottom: "3px" }}>
              {c.nom || "Sans nom"}
              {etiquette && etiquette(c) && (
                <span style={{
                  marginLeft: "8px", padding: "1px 8px", borderRadius: "10px",
                  background: "#E3EFF8", color: "#5D6877", fontFamily: "'Crimson Pro',serif",
                  fontSize: "12px", fontWeight: 400, verticalAlign: "middle",
                }}>{etiquette(c)}</span>
              )}
            </div>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "13px", color: "#5D6877" }}>
              Signé le {c.dateSig} · Début : {c.dateDebut}
            </div>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "12px", color: "#2A84C1", marginTop: "2px" }}>
              Sauvegardé le {new Date(c.savedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={() => onOuvrir(c)} style={{
              padding: "7px 14px", background: "#2A84C1", border: "none", color: "#fff",
              borderRadius: "7px", cursor: "pointer", fontSize: "13px",
              fontFamily: "'Playfair Display',serif", fontWeight: 700,
            }}>Ouvrir</button>
            {onModifier && onModifier(c) && (
              <button onClick={onModifier(c)} title="Modifier les informations de ce contrat" style={{
                padding: "7px 12px", background: "transparent", border: "1px solid #2A84C1",
                color: "#2A84C1", borderRadius: "7px", cursor: "pointer", fontSize: "13px",
                fontFamily: "'Playfair Display',serif", fontWeight: 700,
              }}>Modifier</button>
            )}
            <button onClick={() => onSupprimer(c.id)} style={{
              padding: "7px 10px", background: "transparent", border: "1px solid #DCE3EA",
              color: "#c0392b", borderRadius: "7px", cursor: "pointer", fontSize: "16px",
            }}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ÉDITEUR TARIFS (générique) ────────────────────────────────
function TarifsEditor({ num, tarifs, setTarifs }) {
  const update = (i, field, val) =>
    setTarifs(t => t.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const add = () => setTarifs(t => [...t, { libelle: "", prix: "", unite: "pièce" }]);
  const remove = (i) => setTarifs(t => t.filter((_, idx) => idx !== i));

  const cellInput = (val, onChange, width, align = "left") => (
    <input value={val} onChange={e => onChange(e.target.value)}
      style={{
        width, border: "1px solid #CBD4DD", borderRadius: "5px",
        padding: "4px 7px", fontFamily: "'Crimson Pro',serif",
        fontSize: "13px", background: "#F7F9FB", outline: "none",
        textAlign: align, boxSizing: "border-box",
      }} />
  );

  return (
    <Section num={num} title="Grille tarifaire">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#E3EFF8" }}>
              {["Libellé de la prestation", "Prix HT (€)", "Unité", ""].map(h => (
                <th key={h} style={{
                  padding: "8px 10px", textAlign: "left",
                  fontFamily: "'Playfair Display',serif", fontSize: "11px",
                  fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                  color: "#4A5563", borderBottom: "2px solid #C5D3E0", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tarifs.map((t, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#F7F9FB" : "#fff" }}>
                <td style={{ padding: "5px 8px" }}>{cellInput(t.libelle, v => update(i, "libelle", v), "100%")}</td>
                <td style={{ padding: "5px 8px", width: "110px" }}>{cellInput(t.prix, v => update(i, "prix", v), "90px", "right")}</td>
                <td style={{ padding: "5px 8px", width: "120px" }}>
                  <select value={t.unite} onChange={e => update(i, "unite", e.target.value)}
                    style={{
                      border: "1px solid #CBD4DD", borderRadius: "5px",
                      padding: "4px 7px", fontFamily: "'Crimson Pro',serif",
                      fontSize: "13px", background: "#F7F9FB", outline: "none", width: "100%",
                    }}>
                    <option value="pièce">/ pièce</option>
                    <option value="heure">/ heure</option>
                    <option value="forfait">forfait</option>
                    <option value="jour">forfait / jour</option>
                    <option value="m3">/ m³</option>
                  </select>
                </td>
                <td style={{ padding: "5px 8px", width: "36px", textAlign: "center" }}>
                  <button onClick={() => remove(i)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#c0392b", fontSize: "16px", lineHeight: 1, padding: "2px 4px",
                  }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={add} style={{
        marginTop: "12px", padding: "7px 16px",
        background: "transparent", border: "1px solid #2A84C1",
        color: "#2A84C1", borderRadius: "6px", cursor: "pointer",
        fontFamily: "'Playfair Display',serif", fontSize: "12px",
        fontWeight: 700, letterSpacing: "0.06em",
      }}>+ Ajouter une ligne</button>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE PALETTES
// ═══════════════════════════════════════════════════════════════

function ContractViewPalettes({ f, tarifs }) {
  const rep = `${f.prestCivilite} ${f.prestNomFamille}${f.prestPrenom ? " " + f.prestPrenom : ""}`.trim();
  const half = Math.ceil(tarifs.length / 2);
  const L = tarifs.slice(0, half), R = tarifs.slice(half);

  const BG2 = "#f7f0e3", GOLD = "#b8860b", BORDER = "#d8c9a8";

  const c = {
    wrap: { fontFamily: "'Times New Roman',Times,serif", fontSize: "9.5pt", color: "#1a1008", lineHeight: 1.35, maxWidth: "800px", margin: "0 auto", background: "#fff", padding: "24px 36px", border: `1px solid ${BORDER}`, borderTop: `4px solid ${GOLD}` },
    h1: { fontSize: "12pt", fontWeight: "bold", textAlign: "center", marginBottom: "4px", textDecoration: "underline", letterSpacing: ".05em" },
    divider: { height: "2px", background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, margin: "8px 0 10px", border: "none" },
    partiesBox: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "4px", marginBottom: "8px", overflow: "hidden" },
    partyLeft: { padding: "7px 10px", borderRight: `1px solid ${BORDER}` },
    partyRight: { padding: "7px 10px" },
    partyLabel: { fontWeight: "bold", fontSize: "8pt", color: GOLD, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px", display: "block" },
    two: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "4px" },
    at: { fontWeight: "bold", textDecoration: "underline", display: "block", marginTop: "7px", marginBottom: "2px", breakAfter: "avoid", pageBreakAfter: "avoid" },
    tt: { width: "100%", borderCollapse: "collapse", fontSize: "8.5pt" },
    th: { border: `1px solid ${BORDER}`, padding: "2px 5px", background: BG2, fontWeight: "bold", textAlign: "left", color: "#3a2a00" },
    td: { border: `1px solid ${BORDER}`, padding: "1px 5px" },
    tdAlt: { border: `1px solid ${BORDER}`, padding: "1px 5px", background: "#fff" },
    sigRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "10px" },
    sigBox: { background: BG2, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "7px 10px" },
    sigLine: { borderTop: `1px solid ${GOLD}`, paddingTop: "4px", marginTop: "26px", fontSize: "9pt", color: "#7a6a52" },
  };

  const TarifTable = ({ rows }) => (
    <table style={c.tt}>
      <thead>
        <tr>
          <th style={c.th}>Libellé</th>
          <th style={{ ...c.th, textAlign: "right", width: "72px" }}>HT</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t, i) => (
          <tr key={i}>
            <td style={i % 2 === 0 ? c.td : c.tdAlt}>{t.libelle}</td>
            <td style={{ ...(i % 2 === 0 ? c.td : c.tdAlt), textAlign: "right", fontWeight: 600 }}>
              {t.prix} €{t.unite === "heure" ? "/h" : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div id="contrat-print" style={c.wrap}>
      <div style={c.h1}>CONTRAT DE PRESTATION DE SERVICE</div>
      <hr style={c.divider} />
      <div style={c.partiesBox}>
        <div style={{ ...c.partyLeft, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <span style={c.partyLabel}>Entre — Le Prestataire</span>
          <p style={{ margin: 0 }}>
            <strong>{f.prestNom}</strong>, domicilié au {f.prestAdresse}, {f.prestCpVille},
            immatriculé sous le numéro SIRET {f.prestSiret}, représenté par {rep},<br />
            <strong>Ci-après désigné : le Prestataire.</strong>
          </p>
        </div>
        <div style={{ ...c.partyRight, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <span style={c.partyLabel}>Et — Le Client</span>
          <p style={{ margin: 0 }}>
            <strong>SAS OUEST PALETTES</strong>, dont le siège social est situé au Le Four Lutton,
            85140 La Merlatière, immatriculée au 339 804 684 R.C.S La Roche-sur-Yon,
            représentée par M. JEAUD Patrice en sa qualité de gérant,<br />
            <strong>Ci-après désigné : le Client.</strong>
          </p>
        </div>
      </div>

      <div style={c.two}>
        <div>
          <span style={c.at}>Article 1 : Objet du contrat</span>
          <p>Le présent contrat a pour objet {f.objet} dans les locaux du client.</p>
          <span style={c.at}>Article 2 : Lieu d'exécution</span>
          <p>La prestation s'effectuera dans les locaux du client au Le Four Lutton, 85140 La Merlatière. Toute intervention sur un autre site devra faire l'objet d'un accord préalable écrit. Le client s'engage à faciliter l'accès du prestataire à ses locaux.</p>
          <span style={c.at}>Article 3 : Obligations du Prestataire</span>
          <p>Le prestataire s'engage à :</p>
          <ul style={{ paddingLeft: "17px", margin: "3px 0" }}>
            <li>Exécuter la prestation avec diligence et dans le respect des usages professionnels ;</li>
            <li>Respecter les règles de sécurité du client ;</li>
            <li>Tenir un relevé quotidien en double exemplaire des prestations (date, type, quantité, prix), validé chaque jour par les deux parties ;</li>
            <li>Joindre en annexe une copie à jour de son assurance RC professionnelle, une copie de son attestation de fourniture des déclarations sociales et de paiement des cotisations et contributions, une copie de son attestation de régularité fiscale, une copie de son KBIS, une copie des CNI et DPAE des salariés.</li>
          </ul>
        </div>
        <div>
          <span style={c.at}>Article 4 : Obligations du Client</span>
          <p>Le client s'engage à fournir au prestataire toutes les informations et le matériel utiles à la bonne exécution de la prestation, et à collaborer pleinement pour le bon déroulement des opérations.</p>
          <span style={c.at}>Article 5 : Durée du contrat</span>
          <p>Le présent contrat est conclu pour une durée de <strong>{f.duree} mois</strong> à compter du {f.dateDebut}. Il sera renouvelé par tacite reconduction pour des périodes successives de <strong>{f.reconduction} mois</strong>, sauf dénonciation par l'une des parties par e-mail avec accusé de réception, avec un préavis d'un mois avant l'échéance.</p>
          <span style={c.at}>Article 6 : Facturation et paiement</span>
          <p>Le prestataire adressera une facture mensuelle au client, sur la base du relevé quotidien validé, comportant : date et lieu, références du prestataire, décompte détaillé, montant HT et TTC.</p>
          <p>Le règlement s'effectuera par virement bancaire dans un délai de 15 jours à compter de la réception de la facture.</p>
        </div>
      </div>

      <span style={c.at}>Article 7 : Prix de la prestation</span>
      <p>Les tarifs convenus entre les parties sont les suivants (prix en euros HT). Ces tarifs sont fermes et ne pourront être modifiés que par avenant écrit signé des deux parties.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "7px 0 14px" }}>
        <TarifTable rows={L} /><TarifTable rows={R} />
      </div>

      <div style={c.two}>
        <div>
          <span style={c.at}>Article 8 : Réception de la prestation</span>
          <p>À l'issue de chaque intervention, le client réceptionne les palettes traitées et approuve la prestation ou émet des réserves motivées. À défaut de réserve, la prestation est réputée approuvée et le transfert des risques s'opère immédiatement.</p>
          <span style={c.at}>Article 9 : Responsabilité</span>
          <p>La responsabilité du prestataire est limitée aux dommages matériels directs résultant d'une faute prouvée dans l'exécution de la prestation. Il ne saurait être tenu responsable des dommages liés à une utilisation non conforme des palettes ou à leur usure normale.</p>
          <span style={c.at}>Article 10 : Résiliation</span>
          <p>Chaque partie pourra résilier le contrat en cas d'inexécution par l'autre partie de ses obligations, après mise en demeure restée sans effet pendant 15 jours.</p>
          <p>Chaque partie peut également résilier de manière anticipée si l'activité ou les besoins du client diminuent significativement, rendant la prestation économiquement injustifiée. Notification par e-mail avec accusé de réception et justificatif, avec préavis d'un mois.</p>
        </div>
        <div>
          <span style={c.at}>Article 11 : Force majeure</span>
          <p>Aucune partie ne pourra être tenue responsable d'une inexécution résultant d'un cas de force majeure au sens de l'article 1218 du Code civil. La partie concernée en informera l'autre sans délai. Si l'événement perdure au-delà de 30 jours, les parties se rapprocheront pour convenir d'une modification du contrat.</p>
          <span style={c.at}>Article 12 : Droit applicable et litiges</span>
          <p>Le présent contrat est soumis au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera porté devant le Tribunal de {f.tribunal}.</p>
          <span style={c.at}>Article 13 : Modification du contrat</span>
          <p>Toute modification du présent contrat devra faire l'objet d'un avenant écrit signé par les deux parties.</p>
        </div>
      </div>

      <hr style={c.divider} />
      <p style={{ fontStyle: "italic", textAlign: "right", margin: "0 0 6px", fontSize: "10.5pt", color: "#3a2a00" }}>
        Fait à La Merlatière, le {f.dateSig}, en deux originaux dont un remis au client.
      </p>
      <p style={{ fontSize: "10.5pt", color: "#7a6a52", marginBottom: "12px" }}>
        (Faire précéder les signatures de la mention « Lu et approuvé. Bon pour accord »)
      </p>
      <div style={c.sigRow}>
        <div style={{ ...c.sigBox, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>Le Client :</p>
          <p style={{ margin: 0 }}>OUEST PALETTES — M. JEAUD Patrice</p>
          <div style={c.sigLine}>Signature</div>
        </div>
        <div style={{ ...c.sigBox, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>Le Prestataire :</p>
          <p style={{ margin: 0 }}>{f.prestNom} — {rep}</p>
          <div style={c.sigLine}>Signature</div>
        </div>
      </div>
    </div>
  );
}

// ── NOUVEAU MODÈLE : CONTRAT-CADRE À FAÇON (une colonne, plusieurs pages, 3 annexes) ──
function ContractViewPalettesV2({ f, tarifs }) {
  const rep = `${f.prestCivilite} ${f.prestPrenom ? f.prestPrenom + " " : ""}${(f.prestNomFamille || "").toUpperCase()}`.trim();
  const villePrest = (f.prestCpVille || "").replace(/^\d{5}\s*/, "");
  const immat = f.prestRcsVille
    ? <>Immatriculée au RCS de {f.prestRcsVille} sous le n° {f.prestRcsNum}</>
    : <>Immatriculée sous le n° SIRET {f.prestRcsNum}</>;
  const capital = f.prestCapital ? <> au capital de {f.prestCapital} €</> : null;
  const BLANC = "_____ / _____ / 20_____";
  // Entreprise individuelle : pas de "société", et pas de "Entrepreneur individuel de Faty MACALOU"
  const estEI = f.prestForme === "Entreprise individuelle" || /entrepreneur/i.test(f.prestQualite || "");
  const de = (q) => /^[aeiouyéèêâàîô]/i.test(q || "") ? `d'${q}` : `de ${q}`; // « d'Entrepreneur », « de Président »
  const qualiteDe = estEI ? f.prestQualite : `${f.prestQualite} de ${f.prestNom}`;

  const BG2 = "#EAF3FA", GOLD = "#2A84C1", BORDER = "#C5D3E0";
  const noBreak = { breakInside: "avoid", pageBreakInside: "avoid" };

  const c = {
    wrap: { fontFamily: "'Times New Roman',Times,serif", fontSize: "9.5pt", color: "#1B2430", lineHeight: 1.38, maxWidth: "800px", margin: "0 auto", background: "#fff", padding: "28px 44px", border: `1px solid ${BORDER}`, borderTop: `4px solid ${GOLD}` },
    h1: { fontSize: "13pt", fontWeight: "bold", textAlign: "center", margin: "0 0 2px", letterSpacing: ".05em" },
    h1b: { fontSize: "11pt", fontWeight: "bold", textAlign: "center", margin: "0 0 2px" },
    sous: { fontStyle: "italic", textAlign: "center", margin: "0 0 4px" },
    divider: { height: "2px", background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, margin: "8px 0 10px", border: "none" },
    partyBox: { background: BG2, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "8px 12px", margin: "4px 0 10px", ...noBreak },
    partyLabel: { fontWeight: "bold", fontSize: "8.5pt", color: GOLD, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px", display: "block" },
    titre: { fontWeight: "bold", textAlign: "center", margin: "12px 0 4px", letterSpacing: ".04em" },
    at: { fontWeight: "bold", textDecoration: "underline", display: "block", marginTop: "12px", marginBottom: "3px", breakAfter: "avoid", pageBreakAfter: "avoid" },
    sat: { fontWeight: "bold", display: "block", marginTop: "6px", marginBottom: "2px", breakAfter: "avoid", pageBreakAfter: "avoid" },
    p: { margin: "0 0 5px", textAlign: "justify" },
    ul: { paddingLeft: "18px", margin: "3px 0 6px" },
    tt: { width: "100%", borderCollapse: "collapse", fontSize: "9.5pt", margin: "6px 0 10px" },
    th: { border: `1px solid ${BORDER}`, padding: "4px 7px", background: BG2, fontWeight: "bold", textAlign: "left", color: "#1B4F73" },
    td: { border: `1px solid ${BORDER}`, padding: "3px 7px", verticalAlign: "top" },
    sigRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "10px", ...noBreak },
    sigBox: { background: BG2, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "8px 12px" },
    sigLine: { borderTop: `1px solid ${GOLD}`, paddingTop: "4px", marginTop: "40px", fontSize: "9pt", color: "#5D6877" },
    annexe: { marginTop: "28px", paddingTop: "18px", borderTop: `2px dashed ${BORDER}` },
  };

  const P = ({ children, style }) => <p style={{ ...c.p, ...style }}>{children}</p>;
  const Signatures = ({ client = "Pour le Client — SAS OUEST PALETTES", prest = `Pour le Prestataire — ${f.prestNom}` }) => (
    <div style={c.sigRow} className="sig-box-print">
      <div style={c.sigBox}>
        <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>{client}</p>
        <p style={{ margin: 0 }}>M. Patrice JEAUD, Président</p>
        <div style={c.sigLine}>Date et signature</div>
      </div>
      <div style={c.sigBox}>
        <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>{prest}</p>
        <p style={{ margin: 0 }}>{rep}, {f.prestQualite}</p>
        <div style={c.sigLine}>Date et signature</div>
      </div>
    </div>
  );

  return (
    <div id="contrat-print" className="cadre-pages" style={c.wrap}>
      <div style={c.h1}>CONTRAT-CADRE DE PRESTATION DE SERVICES</div>
      <div style={c.h1b}>SOUS-TRAITANCE À FAÇON</div>
      <p style={c.sous}>(Tri, réparation et fabrication de palettes en bois sur sites client)</p>
      <hr style={c.divider} />

      <P style={{ fontWeight: "bold" }}>ENTRE LES SOUSSIGNÉS :</P>

      <div style={c.partyBox}>
        <span style={c.partyLabel}>1. Le Client</span>
        <p style={{ margin: 0 }}>
          <strong>SAS OUEST PALETTES</strong><br />
          Société par Actions Simplifiée au capital de 50 000 €<br />
          Siège social : Le Four Lutton, 85140 La Merlatière<br />
          Immatriculée au RCS de La Roche-sur-Yon sous le n° 339 804 684<br />
          Représentée par M. Patrice JEAUD, en sa qualité de Président<br />
          <em>(Ci-après désignée « le Client » ou « OUEST PALETTES »)</em>
        </p>
      </div>

      <div style={c.partyBox}>
        <span style={c.partyLabel}>2. Le Prestataire</span>
        <p style={{ margin: 0 }}>
          <strong>{f.prestNom}</strong><br />
          {f.prestForme}{capital}<br />
          Siège social : {f.prestAdresse}, {f.prestCpVille}<br />
          {immat}<br />
          {f.prestEuid && <>EUID : {f.prestEuid}<br /></>}
          Représentée par {rep}, en sa qualité {de(f.prestQualite)}<br />
          <em>(Ci-après désignée « le Prestataire »)</em>
        </p>
      </div>

      <P style={{ fontStyle: "italic", textAlign: "center" }}>(Le Client et le Prestataire étant désignés ensemble « les Parties »)</P>

      <div style={c.titre}>PRÉAMBULE</div>
      <P>Le Client exploite plusieurs sites industriels spécialisés dans la fabrication, le tri, le reconditionnement et la gestion de palettes en bois, situés principalement en Vendée (85), Charente-Maritime (17) et Vienne (86).</P>
      <P>Le Prestataire dispose d'un savoir-faire reconnu dans les opérations de tri, de réparation et de fabrication de palettes en bois. Il intervient auprès de plusieurs clients et exerce son activité en toute indépendance commerciale.</P>
      <P>Le présent contrat est conclu dans le cadre d'un <strong>contrat d'entreprise à façon</strong> au sens de l'article L. 8241-2 du Code du travail : le Client fournit les matières premières (planches, plots, éléments de bois, clous et pointes) ainsi que les cloueurs pneumatiques mis à disposition via son fournisseur agréé ; le Prestataire apporte son savoir-faire, sa main-d'œuvre qualifiée, son organisation et ses scies sabres, pour transformer ces matières en palettes conformes aux spécifications du Client.</P>
      <P>Les Parties déclarent expressément que le présent contrat exclut tout lien de subordination juridique entre le Client et le personnel du Prestataire, et respecte strictement les dispositions relatives à l'interdiction du prêt illicite de main-d'œuvre (art. L. 8241-1 C. trav.) et du délit de marchandage (art. L. 8231-1 C. trav.).</P>

      <span style={c.at}>Article 1 : Objet du contrat et qualification juridique</span>
      <span style={c.sat}>1.1. Objet</span>
      <P>Le présent contrat-cadre définit les conditions juridiques, techniques et financières dans lesquelles le Prestataire s'engage à exécuter, pour le compte du Client, des prestations de :</P>
      <ul style={c.ul}>
        <li>Tri et contrôle qualité de palettes ;</li>
        <li>Réparation et reconditionnement de palettes ;</li>
        <li>Fabrication et assemblage de palettes (sciage des planches, clouage, montage).</li>
      </ul>
      <span style={c.sat}>1.2. Nature juridique — Contrat d'entreprise à façon</span>
      <P>Conformément à l'article L. 8241-2 du Code du travail, le présent contrat est un contrat d'entreprise à façon : le Client fournit les matières premières et les cloueurs pneumatiques ; le Prestataire réalise les opérations de transformation en conservant la pleine maîtrise de l'organisation du travail et de l'encadrement de son personnel. Cette qualification exclut expressément toute requalification en prêt de main-d'œuvre illicite.</P>
      <span style={c.sat}>1.3. Contrat-cadre et ordres de mission</span>
      <P>Le présent contrat constitue un contrat-cadre. Chaque intervention sur un site est formalisée par un Ordre de Mission / Bon de Commande précisant le site concerné, la nature des tâches et les objectifs quantitatifs prévisionnels.</P>

      <span style={c.at}>Article 2 : Fourniture des matières premières et des équipements</span>
      <span style={c.sat}>2.1. Matières premières fournies par le Client</span>
      <P>Dans le cadre du présent contrat à façon, le Client fournit à titre gratuit au Prestataire, sur chaque site d'intervention, l'ensemble des matières premières nécessaires à l'exécution des prestations, notamment :</P>
      <ul style={c.ul}>
        <li>Planches de bois (neuves ou de récupération) ;</li>
        <li>Plots en bois ;</li>
        <li>Clous et pointes de clouage ;</li>
        <li>Tout autre élément constitutif de la palette (lambourdes, traverses…).</li>
      </ul>
      <P style={{ fontStyle: "italic" }}>La fourniture de ces matières premières par le Client est constitutive de la qualification de contrat à façon et ne constitue en aucun cas un indice de subordination.</P>
      <span style={c.sat}>2.2. Cloueurs pneumatiques</span>
      <P>Les cloueurs pneumatiques utilisés sur les sites sont mis à disposition par le fournisseur agréé du Client (BEA / Bostitch ou équivalent). Cette mise à disposition est réalisée à titre accessoire et ne modifie pas la qualification du présent contrat. Le Prestataire est responsable de la bonne utilisation de ces équipements par son personnel et en assure la garde au sens de l'article 1242 du Code civil pendant toute la durée de l'intervention.</P>
      <span style={c.sat}>2.3. Équipements apportés par le Prestataire</span>
      <P>Le Prestataire apporte et utilise ses propres scies sabres pour les opérations de sciage et de découpe des composants. Il est seul responsable de leur entretien, de leur conformité aux normes de sécurité et de la formation de son personnel à leur utilisation.</P>

      <span style={c.at}>Article 3 : Sites d'exécution et organisation</span>
      <span style={c.sat}>3.1. Sites d'intervention</span>
      <P>Les prestations s'exécutent sur les différents dépôts et sites du Client situés notamment en Vendée (85), Charente-Maritime (17) et Vienne (86). Le site concerné par chaque intervention est précisé dans l'Ordre de Mission correspondant.</P>
      <span style={c.sat}>3.2. Autonomie organisationnelle du Prestataire</span>
      <P>Le Prestataire exécute ses prestations en toute indépendance et sans aucun lien de subordination avec le Client. Il détermine seul :</P>
      <ul style={c.ul}>
        <li>le nombre d'intervenants affectés à chaque mission ;</li>
        <li>l'organisation des équipes, la répartition des tâches et les méthodes de travail ;</li>
        <li>la gestion des pauses de son personnel.</li>
      </ul>
      <P><strong>Le Client n'exerce aucun pouvoir de direction, de surveillance ni de sanction sur le personnel du Prestataire.</strong></P>
      <span style={c.sat}>3.3. Référent du Prestataire sur site</span>
      <P>Le Prestataire désigne un référent parmi ses salariés, présent sur site lors de chaque intervention. Ce référent représente le Prestataire et est le seul interlocuteur opérationnel du Client sur site. Les décisions d'organisation, d'affectation et de discipline restent de la compétence exclusive de {rep}, {qualiteDe}.</P>
      <P>Le Client s'interdit formellement de donner des directives, ordres ou remontrances directement aux intervenants du Prestataire. Toute remarque qualitative ou demande de correction est adressée exclusivement au référent ou à {rep}.</P>
      <span style={c.sat}>3.4. Plages horaires d'accès aux sites</span>
      <P>Pour des impératifs de sécurité et d'organisation des sites, les interventions se déroulent dans les plages d'ouverture des sites, du lundi au samedi, entre 6h00 et 18h00. Aucune intervention n'est autorisée les dimanches, jours fériés ou périodes de fermeture annuelle. Ces plages horaires constituent des contraintes d'accès au site et non un contrôle du temps de travail du personnel du Prestataire.</P>

      <span style={c.at}>Article 4 : Sécurité et plan de prévention</span>
      <span style={c.sat}>4.1. Plan de prévention</span>
      <P>Préalablement à toute première intervention sur un site, un Plan de Prévention écrit est co-établi entre le Client (Entreprise Utilisatrice) et le Prestataire (Entreprise Intervenante), conformément aux articles R. 4511-1 et suivants du Code du travail. Le modèle figure en Annexe 2 du présent contrat.</P>
      <span style={c.sat}>4.2. Équipements de Protection Individuelle (EPI)</span>
      <P>Le Prestataire fournit obligatoirement à l'intégralité de ses intervenants les EPI adaptés aux risques du métier : chaussures de sécurité, gants anti-coupure, protections auditives, lunettes de protection, masque anti-poussière FFP2.</P>
      <span style={c.sat}>4.3. Badgeage de sécurité</span>
      <P>Un système de badgeage à l'entrée et à la sortie du site est utilisé par les intervenants du Prestataire, strictement et exclusivement à des fins de sécurité incendie et de décompte des présents en cas d'évacuation (art. L. 4121-1 C. trav.). Ces données ne servent en aucun cas à contrôler le temps de travail ni à calculer la rémunération du Prestataire.</P>
      <span style={c.sat}>4.4. Notification préalable des intervenants</span>
      <P>Le Prestataire s'engage à transmettre au Client, au moins 72 heures avant chaque intervention, la liste nominative des intervenants prévus, assortie d'une copie de leur pièce d'identité en cours de validité et, le cas échéant, de leur titre de séjour et autorisation de travail. Tout intervenant non déclaré préalablement se verra refuser l'accès au site.</P>

      <span style={c.at}>Article 5 : Obligations du Prestataire — Devoir de vigilance</span>
      <P>Conformément aux articles L. 8222-1 et R. 8222-1 du Code du travail, le Prestataire remet obligatoirement au Client, à la signature du présent contrat puis tous les six (6) mois jusqu'à son terme :</P>
      <ul style={c.ul}>
        {/* Sans RCS (entreprise individuelle non inscrite), pas de Kbis : extrait RNE ou avis de situation SIRENE */}
        {f.prestRcsVille
          ? <li>Un extrait Kbis datant de moins de 3 mois (délivré par le greffe du Tribunal de Commerce de {f.prestRcsVille}) ;</li>
          : <li>Un extrait d'immatriculation au Registre national des entreprises (RNE) ou un avis de situation au répertoire SIRENE datant de moins de 3 mois ;</li>}
        <li>Une attestation de vigilance URSSAF en cours de validité (délivrée via le portail urssaf.fr) ;</li>
        <li>Une attestation de régularité fiscale (délivrée par la DGFiP) ;</li>
        <li>Une attestation d'assurance Responsabilité Civile Professionnelle en cours de validité ;</li>
        <li>La liste nominative des salariés étrangers soumis à autorisation de travail, ou une attestation sur l'honneur certifiant leur absence (art. D. 8254-2 C. trav.) ;</li>
        <li>Une Déclaration Préalable À l'Embauche (DPAE) attestant de la régularité de la situation de chaque intervenant.</li>
      </ul>
      <P>À défaut de remise de ces documents dans les délais impartis, le Client se réserve le droit de suspendre les interventions et/ou de résilier le présent contrat pour faute, sans indemnité.</P>
      <P>Le Prestataire garantit que l'ensemble de ses intervenants est régulièrement déclaré et en situation légale au regard du droit du travail français. Il s'engage à respecter l'intégralité de ses obligations sociales, fiscales et en matière de droit du travail, notamment les dispositions relatives à la durée du travail, au SMIC et aux conventions collectives applicables.</P>

      <span style={c.at}>Article 6 : Tarification et facturation</span>
      <span style={c.sat}>6.1. Rémunération au résultat</span>
      <P>La prestation est rémunérée exclusivement sur la base de tarifs unitaires par palette traitée ou d'un forfait journalier, conformément au barème figurant en Annexe 1 du présent contrat. La rémunération est liée au résultat produit et non au temps passé.</P>
      <P>Ces tarifs sont fermes pour la durée initiale du contrat. Ils pourront être révisés annuellement par avenant signé des deux Parties, sur demande écrite formulée au moins 2 mois avant l'échéance annuelle.</P>
      <span style={c.sat}>6.2. Relevé quotidien contradictoire</span>
      <P>À la fin de chaque journée de travail, un relevé quotidien indiquant le nombre et le type de palettes traitées est établi en double exemplaire et signé contradictoirement par le référent du Prestataire et le responsable de site du Client. Ce relevé constitue la pièce justificative de la facturation.</P>
      <span style={c.sat}>6.3. Contrôle qualité et non-conformités</span>
      <P>Les palettes réparées ou fabriquées doivent être conformes aux standards du Client. Les pièces non conformes sont rejetées, déduites du relevé du jour et remises en conformité par le Prestataire à ses frais, sans supplément de prix.</P>
      <span style={c.sat}>6.4. Facturation et conditions de règlement</span>
      <P>Le Prestataire adresse une facture mensuelle récapitulative basée sur les relevés quotidiens validés. Le règlement s'effectue par virement bancaire dans un délai de {f.delaiPaiement} jours à compter de la date de réception de la facture. Tout retard de paiement entraîne de plein droit l'application d'intérêts de retard au taux légal majoré de 5 points, ainsi qu'une indemnité forfaitaire de recouvrement de 40 € (art. L. 441-10 C. com.).</P>

      <span style={c.at}>Article 7 : Durée, tacite reconduction et résiliation</span>
      <span style={c.sat}>7.1. Durée</span>
      <P>Le présent contrat est conclu pour une durée initiale de {f.duree} mois à compter du {f.dateDebut}.</P>
      <span style={c.sat}>7.2. Tacite reconduction</span>
      <P>Il se renouvelle par tacite reconduction pour des périodes successives de {f.reconduction} mois, sauf dénonciation par lettre recommandée avec accusé de réception, moyennant un préavis de {enLettres(f.preavisRecon)} mois avant l'échéance.</P>
      <span style={c.sat}>7.3. Résiliation pour baisse d'activité</span>
      <P>Chaque Partie peut résilier le contrat par anticipation, sans indemnité, sous réserve d'un préavis de {enLettres(f.preavisBaisse)} mois notifié par LRAR, en cas de baisse significative et durable de l'activité du Client rendant l'exécution des prestations sans objet.</P>
      <span style={c.sat}>7.4. Résiliation pour faute</span>
      <P>En cas de manquement grave aux obligations contractuelles ou légales (défaut de vigilance, travail dissimulé, non-remise des documents obligatoires, défaut d'assurance), le contrat pourra être résilié de plein droit 15 jours après l'envoi d'une mise en demeure par LRAR restée sans effet.</P>

      <span style={c.at}>Article 8 : Responsabilité et assurance</span>
      <P>Le Prestataire est seul responsable des dommages matériels ou corporels causés par ses salariés ou son matériel lors de l'exécution des prestations. Il souscrit et maintient à ses frais une assurance Responsabilité Civile Professionnelle couvrant l'ensemble de ses risques, et en justifie auprès du Client à première demande.</P>
      <P>En cas d'accident du travail survenu à un salarié du Prestataire sur un site du Client, le Prestataire en informe immédiatement le Client et reste seul responsable des démarches auprès de la CPAM et de l'inspection du travail.</P>

      <span style={c.at}>Article 9 : Non-exclusivité et autonomie commerciale</span>
      <P>Le présent contrat ne confère aucune exclusivité au Prestataire. Le Client demeure libre de faire appel à d'autres prestataires. Réciproquement, le Prestataire est libre de travailler pour d'autres clients, ce qui est constitutif de son indépendance commerciale. Le Prestataire certifie, conformément à l'Annexe 3, que le chiffre d'affaires réalisé avec le Client ne dépasse pas 70 % de son chiffre d'affaires annuel total.</P>

      <span style={c.at}>Article 10 : Confidentialité</span>
      <P>Chaque Partie s'engage à garder strictement confidentielles toutes les informations techniques, commerciales et financières de l'autre Partie dont elle aurait eu connaissance dans le cadre de l'exécution du présent contrat. Cette obligation de confidentialité survit à l'expiration ou à la résiliation du contrat pendant une durée de trois (3) ans.</P>

      {/* L'article 11 reste sur la même page que les signatures : elles ne sont jamais seules sur une page */}
      <div style={noBreak} className="bloc-signatures">
      <span style={c.at}>Article 11 : Droit applicable et juridiction compétente</span>
      <P>Le présent contrat est soumis au droit français. Tout litige relatif à sa validité, son interprétation ou son exécution, non résolu à l'amiable dans un délai de 30 jours, sera porté devant le Tribunal de Commerce de {f.tribunal}.</P>

        <div style={c.titre}>SIGNATURES DES PARTIES</div>
        <hr style={c.divider} />
        <P style={{ fontStyle: "italic", textAlign: "left" }}>Fait à La Merlatière, le <strong>{f.dateSig}</strong>, en deux (2) exemplaires originaux.</P>
        <P style={{ color: "#5D6877", textAlign: "left" }}>(Faire précéder la signature de la mention manuscrite « Lu et approuvé. Bon pour accord »)</P>
        <Signatures />
      </div>

      {/* ── ANNEXE 1 ── */}
      <div className="saut-page" style={c.annexe}>
        <div style={c.h1}>ANNEXE 1</div>
        <div style={c.h1b}>GRILLE TARIFAIRE DES PRESTATIONS</div>
        <hr style={c.divider} />
        <P>La présente annexe fixe les tarifs unitaires applicables aux prestations réalisées par {f.prestNom} pour le compte de SAS OUEST PALETTES. La rémunération est liée au résultat produit (nombre de palettes traitées) et non au temps de présence sur site.</P>
        <table style={c.tt}>
          <thead>
            <tr>
              <th style={c.th}>Désignation de la prestation</th>
              <th style={{ ...c.th, width: "130px" }}>Unité</th>
              <th style={{ ...c.th, textAlign: "right", width: "90px" }}>Tarif HT (€)</th>
            </tr>
          </thead>
          <tbody>
            {tarifs.map((t, i) => (
              <tr key={i} style={{ background: i % 2 ? "#F7F9FB" : "#fff" }}>
                <td style={c.td}>{t.libelle}</td>
                <td style={c.td}>{UNITE_LABELS[t.unite] || t.unite}</td>
                <td style={{ ...c.td, textAlign: "right", fontWeight: "bold" }}>{t.prix} €</td>
              </tr>
            ))}
          </tbody>
        </table>
        <P><strong>Note :</strong> Les tarifs ci-dessus sont fermes pour la durée initiale du contrat ({f.duree} mois). Toute révision fait l'objet d'un avenant écrit signé des deux Parties.</P>
        <Signatures client="Pour OUEST PALETTES :" prest={`Pour ${f.prestNom} :`} />
      </div>

      {/* ── ANNEXE 2 ── */}
      <div className="saut-page" style={c.annexe}>
        <div style={c.h1}>ANNEXE 2</div>
        <div style={c.h1b}>PLAN DE PRÉVENTION</div>
        <p style={c.sous}>(Articles R. 4511-1 et suivants du Code du travail)</p>
        <hr style={c.divider} />
        <P style={{ textAlign: "left" }}><strong>Entreprise Utilisatrice :</strong> SAS OUEST PALETTES — Site de : {f.site || "_______________________________"}</P>
        <P style={{ textAlign: "left" }}><strong>Entreprise Intervenante :</strong> {f.prestNom} — {rep}, {f.prestQualite}</P>
        <table style={c.tt}>
          <thead>
            <tr>
              <th style={{ ...c.th, width: "26%" }}>Risque identifié</th>
              <th style={c.th}>Mesures de prévention obligatoires</th>
              <th style={{ ...c.th, width: "30%" }}>EPI requis</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Circulation chariots élévateurs", "Respect strict des voies piétons. Interdiction de circuler sous charge suspendue.", "Gilet haute visibilité, chaussures de sécurité"],
              ["Bruit (cloueurs, scies sabres)", "Limitation des expositions directes.", "Casque anti-bruit ou bouchons moulés"],
              ["Coupures & projections (bois, lames)", "Utilisation conforme des scies, carters en place.", "Gants anti-coupure, lunettes de protection"],
              ["Risque pneumatique (cloueurs)", "Vérification tuyaux d'air, interdiction de pointer les cloueurs vers des personnes.", "Lunettes de sécurité, chaussures renforcées"],
              ["Poussières de bois", "Aspiration aux postes si possible.", "Masque FFP2, gants de manutention"],
              ["Port de charges lourdes", "Postures ergonomiques, aide mécanique si disponible.", "Gants de manutention, chaussures de sécurité"],
            ].map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? "#F7F9FB" : "#fff" }}>
                <td style={{ ...c.td, fontWeight: "bold" }}>{r[0]}</td>
                <td style={c.td}>{r[1]}</td>
                <td style={c.td}>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span style={c.sat}>Consignes d'urgence et sécurité incendie :</span>
        <ul style={c.ul}>
          <li>Repérage obligatoire dès le premier jour de l'emplacement des extincteurs et déclencheurs d'alarme ;</li>
          <li>Identification des voies de dégagement et issues de secours, qui doivent rester libres de tout encombrement ;</li>
          <li>Prise de connaissance du point de rassemblement extérieur ;</li>
          <li>En cas d'accident ou d'incendie : prévenir immédiatement le responsable de site Ouest Palettes.</li>
        </ul>
        <span style={c.sat}>Signatures du Plan de Prévention :</span>
        <Signatures client="Pour OUEST PALETTES :" prest={`Pour ${f.prestNom} :`} />
      </div>

      {/* ── ANNEXE 3 ── */}
      <div className="saut-page" style={c.annexe}>
        <div style={c.h1}>ANNEXE 3</div>
        <div style={c.h1b}>ATTESTATION DE NON-DÉPENDANCE ÉCONOMIQUE</div>
        <p style={c.sous}>(Article L. 8241-2 du Code du travail — Indépendance commerciale du Prestataire)</p>
        <hr style={c.divider} />
        <P>Je soussigné,</P>
        <P><strong>{rep}</strong></P>
        <P style={{ textAlign: "left" }}>
          {estEI
            ? <>Agissant en qualité {de(f.prestQualite)}, exerçant sous le nom {f.prestNom}<br /></>
            : <>Agissant en qualité {de(f.prestQualite)} de la société {f.prestNom}<br /></>}
          {f.prestForme}{capital}<br />
          {immat}<br />
          Siège social : {f.prestAdresse}, {f.prestCpVille}
        </P>
        <P style={{ marginTop: "10px" }}><strong>ATTESTE SUR L'HONNEUR :</strong></P>
        <P>1°) Que l'activité de {f.prestNom} est exercée auprès de plusieurs clients distincts, en totale indépendance commerciale, et ne se limite pas exclusivement à SAS OUEST PALETTES.</P>
        <P>2°) Que le chiffre d'affaires réalisé avec SAS OUEST PALETTES ne dépasse pas, et n'a pas vocation à dépasser, <strong>70 % (soixante-dix pour cent)</strong> du chiffre d'affaires annuel total de {f.prestNom}, toutes activités confondues.</P>
        <P>3°) Que {f.prestNom} dispose d'une clientèle propre et intervient pour d'autres donneurs d'ordre dans le cadre de son activité de prestation de services.</P>
        <P>4°) Que la présente attestation sera actualisée et remise au Client chaque année à la date anniversaire du contrat, ou à toute demande expresse du Client.</P>
        <P style={{ fontStyle: "italic" }}>La présente attestation est établie en vue de satisfaire aux exigences légales en matière d'indépendance du sous-traitant et de prévention du risque de requalification du présent contrat en prêt illicite de main-d'œuvre ou en contrat de travail.</P>
        <P>Je certifie sur l'honneur l'exactitude des informations ci-dessus, étant informé que toute fausse déclaration m'exposerait aux sanctions prévues à l'article 441-1 du Code pénal.</P>
        <div style={noBreak}>
          <P style={{ marginTop: "10px", textAlign: "left" }}>Fait à {villePrest || "_______________"}, le {BLANC}</P>
          <P style={{ textAlign: "left" }}>Signature de {rep}, {qualiteDe} :</P>
          <P style={{ fontStyle: "italic", color: "#5D6877", textAlign: "left" }}>(Précédée de la mention manuscrite « Certifié sincère et véritable »)</P>
          <div style={{ ...c.sigBox, width: "50%", marginTop: "6px" }}>
            <div style={c.sigLine}>Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE CHAUFFEURS
// ═══════════════════════════════════════════════════════════════

function ContractViewChauffeur({ f, tarifs }) {
  const rep = `${f.ch_civilite} ${f.ch_nomFamille}${f.ch_prenom ? " " + f.ch_prenom : ""}`.trim();
  const half = Math.ceil(tarifs.length / 2);
  const L = tarifs.slice(0, half), R = tarifs.slice(half);

  const BG2 = "#EAF3FA", GOLD = "#2A84C1", BORDER = "#C5D3E0";

  const c = {
    wrap: { fontFamily: "'Times New Roman',Times,serif", fontSize: "9.5pt", color: "#1B2430", lineHeight: 1.35, maxWidth: "800px", margin: "0 auto", background: "#fff", padding: "24px 36px", border: `1px solid ${BORDER}`, borderTop: `4px solid ${GOLD}` },
    h1: { fontSize: "12pt", fontWeight: "bold", textAlign: "center", marginBottom: "4px", textDecoration: "underline", letterSpacing: ".05em" },
    divider: { height: "2px", background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, margin: "8px 0 10px", border: "none" },
    partiesBox: { display: "grid", gridTemplateColumns: "1fr 1fr", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "4px", marginBottom: "8px", overflow: "hidden" },
    partyLeft: { padding: "7px 10px", borderRight: `1px solid ${BORDER}` },
    partyRight: { padding: "7px 10px" },
    partyLabel: { fontWeight: "bold", fontSize: "8pt", color: GOLD, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px", display: "block" },
    two: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "4px" },
    at: { fontWeight: "bold", textDecoration: "underline", display: "block", marginTop: "7px", marginBottom: "2px", breakAfter: "avoid", pageBreakAfter: "avoid" },
    tt: { width: "100%", borderCollapse: "collapse", fontSize: "8.5pt" },
    th: { border: `1px solid ${BORDER}`, padding: "2px 5px", background: BG2, fontWeight: "bold", textAlign: "left", color: "#1B4F73" },
    td: { border: `1px solid ${BORDER}`, padding: "1px 5px" },
    tdAlt: { border: `1px solid ${BORDER}`, padding: "1px 5px", background: "#fff" },
    sigRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "10px" },
    sigBox: { background: BG2, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "7px 10px" },
    sigLine: { borderTop: `1px solid ${GOLD}`, paddingTop: "4px", marginTop: "26px", fontSize: "9pt", color: "#5D6877" },
  };

  const TarifTable = ({ rows }) => (
    <table style={c.tt}>
      <thead>
        <tr>
          <th style={c.th}>Libellé</th>
          <th style={{ ...c.th, textAlign: "right", width: "80px" }}>Tarif HT</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t, i) => (
          <tr key={i}>
            <td style={i % 2 === 0 ? c.td : c.tdAlt}>{t.libelle}</td>
            <td style={{ ...(i % 2 === 0 ? c.td : c.tdAlt), textAlign: "right", fontWeight: 600 }}>
              {t.prix} €/{({ heure: "h", "pièce": "pce", jour: "jour", m3: "m³" })[t.unite] || "forfait"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div id="contrat-print" className="cadre-pages" style={c.wrap}>
      <div style={c.h1}>CONTRAT DE PRESTATION DE SERVICE — TRANSPORT</div>
      <hr style={c.divider} />

      <div style={c.partiesBox}>
        <div style={{ ...c.partyLeft, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <span style={c.partyLabel}>Entre — Le Prestataire (Chauffeur)</span>
          <p style={{ margin: 0 }}>
            <strong>{f.ch_nom}</strong>, domicilié au {f.ch_adresse}, {f.ch_cpVille},
            immatriculé sous le numéro SIRET {f.ch_siret}, représenté par {rep},
            titulaire du permis PL/SPL n° <strong>{f.ch_permis}</strong>,
            carte conducteur n° <strong>{f.ch_carte}</strong>{f.ch_fco ? `, FCO valide jusqu'au ${f.ch_fco}` : ""},
            assuré en RC professionnelle : {f.ch_assurance}.<br />
            <strong>Ci-après désigné : le Prestataire.</strong>
          </p>
        </div>
        <div style={{ ...c.partyRight, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <span style={c.partyLabel}>Et — Le Client</span>
          <p style={{ margin: 0 }}>
            <strong>SAS OUEST PALETTES</strong>, dont le siège social est situé au Le Four Lutton,
            85140 La Merlatière, immatriculée au 339 804 684 R.C.S La Roche-sur-Yon,
            représentée par M. JEAUD Patrice en sa qualité de gérant.<br />
            <strong>Ci-après désigné : le Client.</strong>
          </p>
        </div>
      </div>

      <div style={c.two}>
        <div>
          <span style={c.at}>Article 1 : Objet du contrat</span>
          <p>Le présent contrat a pour objet {f.ch_objet} pour le compte du Client, depuis et vers ses sites d'exploitation.</p>
          <span style={c.at}>Article 2 : Lieu et périmètre d'exécution</span>
          <p>Les prestations s'effectuent au départ du dépôt du Client situé au Le Four Lutton, 85140 La Merlatière, selon les tournées définies par le Client. Toute extension géographique fera l'objet d'un accord préalable écrit.</p>
          <span style={c.at}>Article 2 bis : Jours habituels d'intervention</span>
          <p>
            {Array.isArray(f.ch_joursTravailles) && f.ch_joursTravailles.length > 0
              ? <>Les jours habituels d'intervention convenus entre les parties sont : <strong>{JOURS_SEMAINE.filter(jour => f.ch_joursTravailles.includes(jour)).join(", ")}</strong>. Toute adaptation de ces jours sera convenue entre les parties.</>
              : "Les jours d'intervention sont convenus entre les parties en fonction des prestations et des tournées à réaliser."}
          </p>
          <span style={c.at}>Article 3 : Obligations du Prestataire</span>
          <p>Le Prestataire s'engage à :</p>
          <ul style={{ paddingLeft: "17px", margin: "3px 0" }}>
            <li>Être titulaire et à jour d'un permis de conduire PL (C) ou SPL (CE) valide ;</li>
            <li>Utiliser une carte conducteur (chronotachygraphe numérique) valide et l'insérer systématiquement dans le véhicule mis à disposition ;</li>
            <li>Respecter les temps de conduite et de repos réglementaires (règlement CE n° 561/2006) ;</li>
            <li>Être titulaire de la FIMO ou FCO en cours de validité ;</li>
            <li>Exécuter les tournées de livraison et de collecte de palettes selon les instructions du Client ;</li>
            <li>Tenir un relevé quotidien des heures effectuées, validé en double exemplaire par les deux parties ;</li>
            <li>Respecter les règles de sécurité en vigueur et le Code de la route ;</li>
            <li>Joindre en annexe une copie à jour des pièces suivantes : copie du permis de conduire PL/SPL, copie de la carte conducteur (chronotachygraphe), attestation FIMO/FCO en cours de validité, copie de l'assurance RC professionnelle, attestation de fourniture des déclarations sociales et de paiement des cotisations, attestation de régularité fiscale, copie du KBIS.</li>
          </ul>
          <span style={c.at}>Article 4 : Véhicule mis à disposition</span>
          <p>Le Client met à la disposition du Prestataire un véhicule adapté aux prestations convenues. Le Prestataire s'engage à l'utiliser conformément à sa destination, à en prendre soin et à signaler immédiatement tout incident ou dommage. Le carburant, l'entretien courant et l'assurance du véhicule restent à la charge du Client. Le Prestataire est responsable des contraventions et infractions commises durant l'exécution de la prestation.</p>
          <span style={c.at}>Article 5 : Obligations du Client</span>
          <p>Le Client s'engage à fournir un véhicule en bon état de fonctionnement et conforme à la réglementation, équipé d'un chronotachygraphe numérique homologué. Il communique les tournées et instructions nécessaires à la bonne exécution des prestations.</p>
          <span style={c.at}>Article 6 : Durée du contrat</span>
          <p>Le présent contrat est conclu pour une durée de <strong>{f.ch_duree} mois</strong> à compter du {formatDateFR(f.ch_dateDebut)}. Il sera renouvelé par tacite reconduction pour des périodes successives de <strong>{f.ch_recon} mois</strong>, sauf dénonciation par e-mail avec accusé de réception, avec un préavis de <strong>{f.ch_preavis} jours</strong> avant l'échéance.</p>
          {f.ch_probatoire === "oui" && (
            <>
              <span style={c.at}>Article 6 bis : Période probatoire</span>
              <p>Les parties conviennent d'une période probatoire d'une durée de <strong>{f.ch_probatoireJours} jours</strong> calendaires, soit du {formatDateFR(f.ch_dateDebut)} au {formatDateFR(f.ch_dateDebut, Number(f.ch_probatoireJours) - 1)}.</p>
              <p>Au cours de cette période, chaque partie pourra mettre fin au contrat à tout moment, par écrit (e-mail avec accusé de réception ou lettre recommandée), moyennant un préavis de <strong>{f.ch_probatoirePreavis} heures</strong>, sans avoir à justifier de motif, et sans qu'aucune indemnité ne soit due de part et d'autre. Les prestations effectivement réalisées durant cette période resteront dues au Prestataire.</p>
            </>
          )}
          <span style={c.at}>Article 7 : Facturation et paiement</span>
          <p>Le Prestataire adressera une facture {FACTURATION_LABELS[f.ch_freqFacturation] || "mensuelle"} sur la base du relevé d'heures quotidien validé, comportant : date et lieu, références du Prestataire, décompte détaillé des heures par type de prestation, montant HT et TTC.{" "}
          {f.ch_delaiPaiement === "comptant" ? (
            <>Le règlement s'effectuera par virement bancaire au comptant, sous réserve d'un délai de validation de <strong>{f.ch_delaiValidationComptant}</strong> à compter de la réception de la facture, et sous réserve que la personne en charge des virements au sein du Client soit présente. À défaut, le virement sera effectué le jour ouvré suivant.</>
          ) : (
            <>Le règlement s'effectuera par virement bancaire dans un délai de <strong>{f.ch_delaiPaiement} jours</strong> à compter de la réception de la facture.</>
          )}</p>
        </div>
        <div>
          <span style={c.at}>Article 8 : Prix de la prestation</span>
          <p>Les tarifs convenus entre les parties sont les suivants (prix en euros HT). Ces tarifs sont fermes et ne pourront être modifiés que par avenant écrit signé des deux parties.</p>
          <div style={{ margin: "6px 0 8px" }}>
            <TarifTable rows={L} />
            {R.length > 0 && <div style={{ marginTop: "5px" }}><TarifTable rows={R} /></div>}
          </div>
          <span style={c.at}>Article 9 : Réglementation transport</span>
          <p>Le Prestataire est seul responsable du respect des réglementations applicables : temps de conduite et de repos (CE n° 561/2006), utilisation du chronotachygraphe (CE n° 165/2014), qualification initiale et continue (directive 2003/59/CE). En cas de contrôle, le Prestataire assume seul les conséquences des infractions qui lui seraient imputables.</p>
          <span style={c.at}>Article 10 : Confidentialité</span>
          <p>Le Prestataire s'engage à traiter comme strictement confidentielles toutes les informations auxquelles il aura accès dans le cadre du présent contrat, notamment : le fichier clients et destinataires, les tournées et itinéraires, les tarifs pratiqués, ainsi que toute information commerciale ou opérationnelle du Client. Cette obligation s'applique pendant toute la durée du contrat et durant <strong>1 an</strong> après son terme. Toute violation exposera le Prestataire à des dommages et intérêts.</p>
          <span style={c.at}>Article 11 : Responsabilité</span>
          <p>Le Prestataire est responsable des dommages causés aux marchandises ou à des tiers du fait de sa faute prouvée, couverts par son assurance RC professionnelle. Il ne saurait être tenu responsable des dommages résultant d'un vice propre des palettes ou d'instructions erronées du Client.</p>
          <span style={c.at}>Article 12 : Résiliation</span>
          <p>Chaque partie pourra résilier le contrat en cas d'inexécution, après mise en demeure restée sans effet pendant 15 jours. En cas de retrait ou suspension du permis ou de la carte conducteur du Prestataire, le contrat sera résilié de plein droit par le Client, sans préavis ni indemnité.</p>
          <span style={c.at}>Article 13 : Indépendance des parties</span>
          <p>Le Prestataire exerce son activité de manière totalement indépendante. Le présent contrat ne saurait être assimilé à un contrat de travail. Le Prestataire demeure seul responsable de ses obligations sociales et fiscales.</p>
          <span style={c.at}>Article 14 : Force majeure</span>
          <p>Aucune partie ne pourra être tenue responsable d'une inexécution résultant d'un cas de force majeure au sens de l'article 1218 du Code civil. Si l'événement perdure au-delà de 30 jours, les parties se rapprocheront pour convenir d'une modification ou résiliation du contrat.</p>
          <span style={c.at}>Article 15 : Droit applicable et litiges</span>
          <p>Le présent contrat est soumis au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera porté devant le Tribunal de {f.ch_tribunal}.</p>
          <span style={c.at}>Article 16 : Modification du contrat</span>
          <p>Toute modification du présent contrat devra faire l'objet d'un avenant écrit signé par les deux parties.</p>
        </div>
      </div>

      <hr style={c.divider} />
      <p style={{ fontStyle: "italic", textAlign: "right", margin: "0 0 6px", fontSize: "10.5pt", color: "#1B4F73" }}>
        Fait à La Merlatière, le {f.ch_dateSig}, en deux originaux dont un remis au Prestataire.
      </p>
      <p style={{ fontSize: "10.5pt", color: "#5D6877", marginBottom: "12px" }}>
        (Faire précéder les signatures de la mention « Lu et approuvé. Bon pour accord »)
      </p>
      <div style={c.sigRow}>
        <div style={{ ...c.sigBox, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>Le Client :</p>
          <p style={{ margin: 0 }}>OUEST PALETTES — M. JEAUD Patrice</p>
          <div style={c.sigLine}>Signature</div>
        </div>
        <div style={{ ...c.sigBox, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>Le Prestataire :</p>
          <p style={{ margin: 0 }}>{f.ch_nom} — {rep}</p>
          <div style={c.sigLine}>Signature</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════════════════
export default function App() {
  // ── ONGLET ACTIF ──
  const [onglet, setOnglet] = useState("palettes"); // "palettes" | "chauffeurs"

  // ── STATE PALETTES ──
  const [vuePalettes, setVuePalettes] = useState("liste");
  const [f, setF] = useState(EMPTY_PALETTES_V2);
  const [tarifs, setTarifs] = useState(TARIFS_DEFAUT_V2);
  const [contratsPalettes, setContratsPalettes] = useState([]);
  const [contratPaletteActif, setContratPaletteActif] = useState(null);
  const setFP = k => v => setF(s => ({ ...s, [k]: v }));
  const [editionPaletteId, setEditionPaletteId] = useState(null); // id du contrat en cours de modification

  // ── STATE CHAUFFEURS ──
  const [vueChauffeurs, setVueChauffeurs] = useState("liste");
  const [fc, setFc] = useState(EMPTY_CHAUFFEUR);
  const [tarifsCh, setTarifsCh] = useState(TARIFS_CHAUFFEUR_DEFAUT);
  const [contratsChauffeurs, setContratsChauffeurs] = useState([]);
  const [contratChauffeurActif, setContratChauffeurActif] = useState(null);
  const setFC = k => v => setFc(s => ({ ...s, [k]: v }));
  const [editionChauffeurId, setEditionChauffeurId] = useState(null);

  // ── CHARGEMENT INITIAL ──
  useEffect(() => {
    try {
      const sp = localStorage.getItem(STORAGE_KEY_PALETTES);
      if (sp) setContratsPalettes(JSON.parse(sp));
      const sc = localStorage.getItem(STORAGE_KEY_CHAUFFEURS);
      if (sc) setContratsChauffeurs(JSON.parse(sc));
    } catch (e) {}
  }, []);

  // ── HELPERS PALETTES ──
  const okPalettes = f.prestNom && f.prestForme && f.prestAdresse && f.prestCpVille &&
    f.prestRcsNum && f.prestNomFamille && f.prestQualite &&
    f.duree && f.reconduction && f.preavisRecon && f.preavisBaisse && f.delaiPaiement &&
    f.dateDebut && f.tribunal && f.dateSig;

  const sauvegarderPalette = () => {
    const c = {
      id: Date.now().toString(), savedAt: new Date().toISOString(),
      nom: f.prestNom, dateSig: f.dateSig, dateDebut: f.dateDebut,
      version: 2, // nouveau modèle ; les contrats sans "version" sont ceux de l'ancien modèle
      f, tarifs,
    };
    if (editionPaletteId) c.id = editionPaletteId;
    const updated = editionPaletteId
      ? contratsPalettes.map(x => x.id === editionPaletteId ? c : x)
      : [c, ...contratsPalettes];
    setContratsPalettes(updated);
    try { localStorage.setItem(STORAGE_KEY_PALETTES, JSON.stringify(updated)); } catch (e) {}
    return c;
  };

  const supprimerPalette = (id) => {
    if (!window.confirm("Supprimer ce contrat ?")) return;
    const updated = contratsPalettes.filter(c => c.id !== id);
    setContratsPalettes(updated);
    try { localStorage.setItem(STORAGE_KEY_PALETTES, JSON.stringify(updated)); } catch (e) {}
  };

  const genererPalette = () => {
    const saved = sauvegarderPalette();
    setEditionPaletteId(null);
    setContratPaletteActif(saved);
    setVuePalettes("contrat");
  };

  // ── HELPERS CHAUFFEURS ──
  const okChauffeur = fc.ch_nom && fc.ch_adresse && fc.ch_cpVille && fc.ch_siret &&
    fc.ch_nomFamille && fc.ch_permis && fc.ch_carte && fc.ch_assurance &&
    fc.ch_dateDebut && fc.ch_tribunal && fc.ch_dateSig &&
    (fc.ch_delaiPaiement !== "comptant" || fc.ch_delaiValidationComptant) &&
    (fc.ch_probatoire !== "oui" || (fc.ch_probatoireJours && fc.ch_probatoirePreavis));

  const sauvegarderChauffeur = () => {
    const c = {
      id: Date.now().toString(), savedAt: new Date().toISOString(),
      nom: fc.ch_nom, dateSig: fc.ch_dateSig, dateDebut: fc.ch_dateDebut,
      f: fc, tarifs: tarifsCh,
    };
    if (editionChauffeurId) c.id = editionChauffeurId;
    const updated = editionChauffeurId
      ? contratsChauffeurs.map(x => x.id === editionChauffeurId ? c : x)
      : [c, ...contratsChauffeurs];
    setContratsChauffeurs(updated);
    try { localStorage.setItem(STORAGE_KEY_CHAUFFEURS, JSON.stringify(updated)); } catch (e) {}
    return c;
  };

  const supprimerChauffeur = (id) => {
    if (!window.confirm("Supprimer ce contrat ?")) return;
    const updated = contratsChauffeurs.filter(c => c.id !== id);
    setContratsChauffeurs(updated);
    try { localStorage.setItem(STORAGE_KEY_CHAUFFEURS, JSON.stringify(updated)); } catch (e) {}
  };

  const genererChauffeur = () => {
    const saved = sauvegarderChauffeur();
    setEditionChauffeurId(null);
    setContratChauffeurActif(saved);
    setVueChauffeurs("contrat");
  };

  // ── MODIFIER UN CONTRAT EXISTANT (le formulaire est pré-rempli) ──
  // Les contrats palettes de l'ancien modèle ne sont pas modifiables : leur formulaire n'existe plus.
  const modifierPalette = (c) => {
    setF({ ...EMPTY_PALETTES_V2, ...c.f });
    setTarifs(c.tarifs);
    setEditionPaletteId(c.id);
    setVuePalettes("formulaire");
  };
  const modifierChauffeur = (c) => {
    setFc({ ...EMPTY_CHAUFFEUR, ...c.f });
    setTarifsCh(c.tarifs);
    setEditionChauffeurId(c.id);
    setVueChauffeurs("formulaire");
  };
  const contratActif = onglet === "palettes" ? contratPaletteActif : contratChauffeurActif;
  const peutModifier = onglet === "chauffeurs" || contratPaletteActif?.version === 2;
  const enModification = onglet === "palettes" ? !!editionPaletteId : !!editionChauffeurId;

  // ── VUE ACTIVE ──
  const isContratView = (onglet === "palettes" && vuePalettes === "contrat") ||
    (onglet === "chauffeurs" && vueChauffeurs === "contrat");
  const isFormulaireView = (onglet === "palettes" && vuePalettes === "formulaire") ||
    (onglet === "chauffeurs" && vueChauffeurs === "formulaire");

  const nomContratActif = onglet === "palettes"
    ? contratPaletteActif?.f?.prestNom
    : contratChauffeurActif?.f?.ch_nom;

  // ── STYLES BARRE ──
  const barreStyle = {
    position: "sticky", top: 0, zIndex: 100, background: "#1B2430",
    padding: "10px 24px", display: "flex", alignItems: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,.35)",
  };
  const btnBarreStyle = {
    padding: "6px 14px", background: "transparent", border: "1px solid #7FBDE855",
    color: "#7FBDE8", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui",
  };

  return (
    <div style={{ minHeight: "100vh", background: isContratView ? "#E6EAEF" : "linear-gradient(145deg,#F7F9FB,#EEF1F4)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      {/* ── ONGLETS PRINCIPAUX ── */}
      {!isContratView && !isFormulaireView && (
        <div id="no-print" style={{
          display: "flex", background: "#1B2430", padding: "0 24px",
          gap: "4px", alignItems: "flex-end",
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 2px 12px rgba(0,0,0,.35)",
        }}>
          {[
            { key: "palettes", label: "📦 Palettes" },
            { key: "chauffeurs", label: "🚛 Chauffeurs" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setOnglet(tab.key)} style={{
              padding: "12px 22px 10px", border: "none", cursor: "pointer",
              fontFamily: "'Playfair Display',serif", fontSize: "13px", fontWeight: 700,
              letterSpacing: ".04em", borderRadius: "8px 8px 0 0", transition: "all .2s",
              position: "relative", top: "1px",
              background: onglet === tab.key ? "#EEF1F4" : "transparent",
              color: onglet === tab.key ? "#1B2430" : "#7FBDE8",
            }}>{tab.label}</button>
          ))}
        </div>
      )}

      {/* ── BARRE CONTRAT ── */}
      {isContratView && (
        <div id="no-print" style={{ ...barreStyle, justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", color: "#7FBDE8", fontSize: "16px", fontWeight: 700 }}>
            {nomContratActif || "Contrat"}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => {
              if (onglet === "palettes") setVuePalettes("liste");
              else setVueChauffeurs("liste");
            }} style={btnBarreStyle}>← Mes contrats</button>
            {peutModifier && contratActif && (
              <button onClick={() => onglet === "palettes" ? modifierPalette(contratActif) : modifierChauffeur(contratActif)}
                style={btnBarreStyle}>✏️ Modifier</button>
            )}
            <button onClick={() => window.print()} style={{
              padding: "7px 18px", background: "#2A84C1", border: "none", color: "#fff",
              borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui", fontWeight: 600,
            }}>🖨️ Imprimer / PDF</button>
          </div>
        </div>
      )}

      {/* ── BARRE FORMULAIRE ── */}
      {isFormulaireView && (
        <div id="no-print" style={{ ...barreStyle, gap: "14px" }}>
          <button onClick={() => {
            if (onglet === "palettes") setVuePalettes("liste");
            else setVueChauffeurs("liste");
          }} style={btnBarreStyle}>← Mes contrats</button>
          <span style={{ fontFamily: "'Playfair Display',serif", color: "#7FBDE8", fontSize: "15px", fontWeight: 700 }}>
            {enModification
              ? `Modification du contrat ${onglet === "palettes" ? f.prestNom : fc.ch_nom}`
              : onglet === "palettes" ? "Nouveau contrat prestataire" : "Nouveau contrat chauffeur"}
          </span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ONGLET PALETTES                                       */}
      {/* ══════════════════════════════════════════════════════ */}
      {onglet === "palettes" && (
        <>
          {vuePalettes === "liste" && (
            <ListeContrats
              titre="Prestataires Palettes" badge="Contrats Palettes" icon="📦"
              contrats={contratsPalettes}
              onOuvrir={c => { setContratPaletteActif(c); setVuePalettes("contrat"); }}
              onSupprimer={supprimerPalette}
              onNouveau={() => { setEditionPaletteId(null); setF(EMPTY_PALETTES_V2); setTarifs(TARIFS_DEFAUT_V2); setVuePalettes("formulaire"); }}
              onModifier={c => c.version === 2 ? () => modifierPalette(c) : null}
              etiquette={c => c.version === 2 ? null : "Ancien modèle"}
            />
          )}

          {vuePalettes === "formulaire" && (
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 16px 80px" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ display: "inline-block", background: "#2A84C1", color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: "10px", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "3px 14px", borderRadius: "20px", marginBottom: "14px" }}>Générateur de contrat</div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "30px", fontWeight: 700, color: "#1B2430", margin: "0 0 7px" }}>Prestation de services</h1>
                <p style={{ color: "#5D6877", fontSize: "15px", margin: 0, fontFamily: "'Crimson Pro',serif" }}>Remplissez les informations puis ajustez les tarifs si besoin</p>
              </div>

              <Section num="1" title="Le Prestataire">
                <Field label="Nom / Raison sociale" value={f.prestNom} onChange={setFP("prestNom")} placeholder="ex : KENEM PALETTES" required />
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                  <SelectField label="Forme juridique" value={f.prestForme} onChange={setFP("prestForme")} options={FORMES_JURIDIQUES} required />
                  <Field label="Capital (€)" value={f.prestCapital} onChange={setFP("prestCapital")} placeholder="ex : 1 000" hint="Laisser vide pour une entreprise individuelle" />
                </div>
                <Field label="Adresse du siège (rue)" value={f.prestAdresse} onChange={setFP("prestAdresse")} placeholder="ex : 38 Allée des Sculpteurs" required />
                <Field label="Code postal et ville" value={f.prestCpVille} onChange={setFP("prestCpVille")} placeholder="ex : 93390 Clichy-sous-Bois" required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Ville du RCS" value={f.prestRcsVille} onChange={setFP("prestRcsVille")} placeholder="ex : Bobigny" hint="Vide = le numéro sera présenté comme un SIRET" />
                  <Field label="N° RCS (ou SIRET)" value={f.prestRcsNum} onChange={setFP("prestRcsNum")} placeholder="ex : 993 021 849" hint="Vérifiez sur annuaire-entreprises.data.gouv.fr" required />
                </div>
                <Field label="EUID" value={f.prestEuid} onChange={setFP("prestEuid")} placeholder="ex : FR9301.993021849" hint="Facultatif — figure sur le Kbis" />
                <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: "12px" }}>
                  <SelectField label="Civilité" value={f.prestCivilite} onChange={setFP("prestCivilite")} options={["M.", "Mme"]} />
                  <Field label="Prénom" value={f.prestPrenom} onChange={setFP("prestPrenom")} placeholder="ex : Mamadou" />
                  <Field label="Nom de famille" value={f.prestNomFamille} onChange={setFP("prestNomFamille")} placeholder="ex : TRAORE" required />
                </div>
                <SelectField label="Qualité du représentant" value={f.prestQualite} onChange={setFP("prestQualite")} options={["Président", "Présidente", "Gérant", "Gérante", "Entrepreneur individuel"]} required />
              </Section>

              <Section num="2" title="Conditions du contrat">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <NumField label="Durée initiale" value={f.duree} onChange={setFP("duree")} required />
                  <NumField label="Reconduction tacite" value={f.reconduction} onChange={setFP("reconduction")} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <NumField label="Préavis avant l'échéance" value={f.preavisRecon} onChange={setFP("preavisRecon")} required />
                  <NumField label="Préavis baisse d'activité" value={f.preavisBaisse} onChange={setFP("preavisBaisse")} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <NumField label="Délai de paiement" value={f.delaiPaiement} onChange={setFP("delaiPaiement")} suffix="jours" required />
                  <Field label="Tribunal de Commerce" value={f.tribunal} onChange={setFP("tribunal")} placeholder="ex : La Roche-sur-Yon" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Date de début" value={f.dateDebut} onChange={setFP("dateDebut")} placeholder="ex : 1er décembre 2026" required />
                  <Field label="Date de signature" value={f.dateSig} onChange={setFP("dateSig")} placeholder="ex : 20 novembre 2026" required />
                </div>
                <Field label="Site du plan de prévention (Annexe 2)" value={f.site} onChange={setFP("site")} placeholder="ex : Dissay" hint="Laisser vide pour obtenir une ligne à compléter à la main" />
              </Section>

              <TarifsEditor num="3" tarifs={tarifs} setTarifs={setTarifs} />
              <ClientBox qualite="Président" />
              <BtnGenerer ok={okPalettes} onClick={genererPalette} enModification={!!editionPaletteId} />
            </div>
          )}

          {vuePalettes === "contrat" && contratPaletteActif && (
            <div style={{ padding: "20px 16px 60px" }}>
              {contratPaletteActif.version === 2
                ? <ContractViewPalettesV2 f={contratPaletteActif.f} tarifs={contratPaletteActif.tarifs} />
                : <ContractViewPalettes f={contratPaletteActif.f} tarifs={contratPaletteActif.tarifs} />}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ONGLET CHAUFFEURS                                     */}
      {/* ══════════════════════════════════════════════════════ */}
      {onglet === "chauffeurs" && (
        <>
          {vueChauffeurs === "liste" && (
            <ListeContrats
              titre="Chauffeurs indépendants" badge="Contrats Chauffeurs" icon="🚛"
              contrats={contratsChauffeurs}
              onOuvrir={c => { setContratChauffeurActif(c); setVueChauffeurs("contrat"); }}
              onSupprimer={supprimerChauffeur}
              onNouveau={() => { setEditionChauffeurId(null); setFc(EMPTY_CHAUFFEUR); setTarifsCh(TARIFS_CHAUFFEUR_DEFAUT); setVueChauffeurs("formulaire"); }}
              onModifier={c => () => modifierChauffeur(c)}
            />
          )}

          {vueChauffeurs === "formulaire" && (
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 16px 80px" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ display: "inline-block", background: "#2A84C1", color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: "10px", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "3px 14px", borderRadius: "20px", marginBottom: "14px" }}>Générateur de contrat</div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "30px", fontWeight: 700, color: "#1B2430", margin: "0 0 7px" }}>Prestation de transport</h1>
                <p style={{ color: "#5D6877", fontSize: "15px", margin: 0, fontFamily: "'Crimson Pro',serif" }}>Remplissez les informations puis ajustez les tarifs si besoin</p>
              </div>

              <Section num="1" title="Le Chauffeur (Prestataire)">
                <Field label="Nom / Raison sociale" value={fc.ch_nom} onChange={setFC("ch_nom")} placeholder="ex : EURL DUPONT TRANSPORT" required />
                <Field label="Adresse (rue)" value={fc.ch_adresse} onChange={setFC("ch_adresse")} placeholder="ex : 12 rue des Acacias" required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Code postal et ville" value={fc.ch_cpVille} onChange={setFC("ch_cpVille")} placeholder="ex : 85000 La Roche-sur-Yon" required />
                  <Field label="Numéro SIRET" value={fc.ch_siret} onChange={setFC("ch_siret")} placeholder="ex : 123 456 789 00012" hint="14 chiffres — vérifiez sur annuaire-entreprises.data.gouv.fr" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: "12px" }}>
                  <SelectField label="Civilité" value={fc.ch_civilite} onChange={setFC("ch_civilite")} options={["M.", "Mme"]} />
                  <Field label="Nom de famille" value={fc.ch_nomFamille} onChange={setFC("ch_nomFamille")} placeholder="ex : DUPONT" required />
                  <Field label="Prénom" value={fc.ch_prenom} onChange={setFC("ch_prenom")} placeholder="ex : Jean" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="N° Permis PL/SPL" value={fc.ch_permis} onChange={setFC("ch_permis")} placeholder="ex : 123456789AA0BC" hint="Permis C ou CE obligatoire" required />
                  <Field label="N° Carte conducteur" value={fc.ch_carte} onChange={setFC("ch_carte")} placeholder="ex : FR123456789012" hint="Chronotachygraphe numérique" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Validité FIMO/FCO" value={fc.ch_fco} onChange={setFC("ch_fco")} placeholder="ex : 31/12/2026" />
                  <Field label="N° Assurance RC Pro" value={fc.ch_assurance} onChange={setFC("ch_assurance")} placeholder="ex : AXA — Contrat n°12345" required />
                </div>
              </Section>

              <Section num="2" title="Conditions du contrat">
                <Field label="Objet de la prestation" value={fc.ch_objet} onChange={setFC("ch_objet")} placeholder="ex : la livraison et la collecte de palettes" required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <NumField label="Durée initiale" value={fc.ch_duree} onChange={setFC("ch_duree")} required />
                  <NumField label="Reconduction tacite" value={fc.ch_recon} onChange={setFC("ch_recon")} />
                  <NumField label="Préavis résiliation" value={fc.ch_preavis} onChange={setFC("ch_preavis")} suffix="jours" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <DateField label="Date de début" value={fc.ch_dateDebut} onChange={setFC("ch_dateDebut")} required />
                  <Field label="Tribunal compétent" value={fc.ch_tribunal} onChange={setFC("ch_tribunal")} placeholder="ex : La Roche-sur-Yon" required />
                  <Field label="Date de signature" value={fc.ch_dateSig} onChange={setFC("ch_dateSig")} placeholder="ex : 1er août 2025" required />
                </div>

                <div style={{ margin: "4px 0 18px", padding: "16px", background: "#F7F9FB", border: "1px solid #DCE3EA", borderRadius: "10px" }}>
                  <label style={{
                    display: "block", fontFamily: "'Playfair Display',serif",
                    fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em",
                    textTransform: "uppercase", color: "#4A5563", marginBottom: "6px"
                  }}>
                    Jours travaillés — optionnel
                  </label>
                  <p style={{ fontSize: "13px", color: "#5D6877", margin: "0 0 12px", fontFamily: "'Crimson Pro',serif" }}>
                    Cochez les jours habituels prévus au contrat. Vous pouvez laisser toutes les cases décochées.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "9px" }}>
                    {JOURS_SEMAINE.map(jour => {
                      const joursSelectionnes = Array.isArray(fc.ch_joursTravailles) ? fc.ch_joursTravailles : [];
                      const coche = joursSelectionnes.includes(jour);
                      return (
                        <label key={jour} style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          padding: "9px 10px", borderRadius: "7px",
                          border: `1px solid ${coche ? "#2A84C1" : "#CBD4DD"}`,
                          background: coche ? "#EAF3FA" : "#fff",
                          cursor: "pointer", fontFamily: "'Crimson Pro',serif",
                          fontSize: "14px", color: "#1B2430"
                        }}>
                          <input
                            type="checkbox"
                            checked={coche}
                            onChange={() => setFC("ch_joursTravailles")(
                              coche
                                ? joursSelectionnes.filter(j => j !== jour)
                                : JOURS_SEMAINE.filter(j => joursSelectionnes.includes(j) || j === jour)
                            )}
                            style={{ accentColor: "#2A84C1" }}
                          />
                          {jour}
                        </label>
                      );
                    })}
                  </div>
                  {Array.isArray(fc.ch_joursTravailles) && fc.ch_joursTravailles.length > 0 && (
                    <p style={{ fontSize: "13px", color: "#4A5563", margin: "12px 0 0", fontFamily: "'Crimson Pro',serif" }}>
                      Sélection : <strong>{JOURS_SEMAINE.filter(jour => fc.ch_joursTravailles.includes(jour)).join(", ")}</strong>
                    </p>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <SelectField label="Fréquence de facturation" value={fc.ch_freqFacturation} onChange={setFC("ch_freqFacturation")}
                    options={["mensuelle", "hebdomadaire", "quinzaine", "annuelle"]} required />
                  <SelectField label="Délai de paiement" value={fc.ch_delaiPaiement} onChange={setFC("ch_delaiPaiement")}
                    options={["15", "30", "comptant"]} required />
                </div>
                {fc.ch_delaiPaiement === "comptant" && (
                  <Field label="Délai de validation (paiement comptant)" value={fc.ch_delaiValidationComptant}
                    onChange={setFC("ch_delaiValidationComptant")} placeholder="ex : 24 heures, 2 jours ouvrés..."
                    hint="Le virement sera effectué sous réserve de la présence de la personne en charge des virements" required />
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "4px" }}>
                  <SelectField label="Période probatoire" value={fc.ch_probatoire} onChange={setFC("ch_probatoire")}
                    options={["oui", "non"]} required />
                  {fc.ch_probatoire === "oui" && (
                    <>
                      <NumField label="Durée probatoire" value={fc.ch_probatoireJours} onChange={setFC("ch_probatoireJours")} suffix="jours" required />
                      <NumField label="Préavis de rupture" value={fc.ch_probatoirePreavis} onChange={setFC("ch_probatoirePreavis")} suffix="heures" required />
                    </>
                  )}
                </div>
                {fc.ch_probatoire === "oui" && fc.ch_dateDebut && (
                  <p style={{ fontSize: "13px", color: "#5D6877", fontFamily: "'Crimson Pro',serif", margin: "-10px 0 18px", fontStyle: "italic" }}>
                    Période probatoire : du {formatDateFR(fc.ch_dateDebut)} au {formatDateFR(fc.ch_dateDebut, Number(fc.ch_probatoireJours) - 1)}
                  </p>
                )}
              </Section>

              <TarifsEditor num="3" tarifs={tarifsCh} setTarifs={setTarifsCh} />
              <ClientBox />
              <BtnGenerer ok={okChauffeur} onClick={genererChauffeur} enModification={!!editionChauffeurId} />
            </div>
          )}

          {vueChauffeurs === "contrat" && contratChauffeurActif && (
            <div style={{ padding: "20px 16px 60px" }}>
              <ContractViewChauffeur f={contratChauffeurActif.f} tarifs={contratChauffeurActif.tarifs} />
            </div>
          )}
        </>
      )}

      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 8mm 10mm; size: A4; }
          html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
          #no-print { display: none !important; }
          body > div > div:last-child { padding: 0 !important; }
          body > div > div:last-child > div { box-shadow: none !important; border: none !important; }
          p { margin: 0 0 2px !important; orphans: 3; widows: 3; }
          ul { margin: 2px 0 !important; }
          li { margin-bottom: 1px !important; orphans: 2; widows: 2; }
          /* Seuls les petits blocs atomiques restent groupés : titres d'article avec leur 1er paragraphe, tableaux, signatures */
          #contrat-print table,
          #contrat-print tr,
          #contrat-print .sig-box-print {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          /* Empêche un titre d'article de se retrouver seul en bas de page, séparé de son contenu */
          #contrat-print span[style*="text-decoration: underline"] {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          #contrat-print span[style*="text-decoration: underline"] + p,
          #contrat-print span[style*="text-decoration: underline"] + ul {
            break-before: avoid !important;
            page-break-before: avoid !important;
          }
        }
        @media print {
          /* Nouveau modèle : chaque annexe commence sur une nouvelle page */
          /* Chaque page imprimée reçoit le même cadre : liseré bleu en haut, bordure en bas */
          #contrat-print.cadre-pages {
            -webkit-box-decoration-break: clone !important;
            box-decoration-break: clone !important;
            border: 1px solid #C5D3E0 !important;
            border-top: 4px solid #2A84C1 !important;
            padding: 22px 36px !important;
          }
          #contrat-print .bloc-signatures {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          #contrat-print .saut-page {
            break-before: page !important;
            page-break-before: always !important;
            border-top: none !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #bbb; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>
    </div>
  );
}
