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
};

const STORAGE_KEY_PALETTES = "contrats_sauvegardes";
const STORAGE_KEY_CHAUFFEURS = "contrats_chauffeurs";

// ── STYLES COMMUNS ────────────────────────────────────────────
const inputBase = (focus) => ({
  width: "100%", padding: "9px 13px", borderRadius: "8px",
  border: `1.5px solid ${focus ? "#b8860b" : "#ddd0bb"}`,
  background: focus ? "#fffdf7" : "#fdfaf5",
  fontFamily: "'Crimson Pro',serif", fontSize: "15px", color: "#1a1008",
  outline: "none", boxSizing: "border-box",
  boxShadow: focus ? "0 0 0 3px rgba(184,134,11,.12)" : "none",
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
        textTransform: "uppercase", color: focus ? "#b8860b" : "#6b5a3e",
        marginBottom: "5px", transition: "color .2s",
      }}>
        {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
      </label>
      {hint && <p style={{ fontSize: "11px", color: "#9a8a72", margin: "-2px 0 5px", fontStyle: "italic" }}>{hint}</p>}
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
        textTransform: "uppercase", color: focus ? "#b8860b" : "#6b5a3e",
        marginBottom: "5px", transition: "color .2s",
      }}>
        {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input type="number" min="1" max="360" value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...inputBase(focus), width: "90px", textAlign: "center", fontWeight: "600", fontSize: "17px" }} />
        <span style={{ color: "#7a6a52", fontFamily: "'Crimson Pro',serif", fontSize: "15px" }}>{suffix}</span>
      </div>
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
        textTransform: "uppercase", color: focus ? "#b8860b" : "#6b5a3e",
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
      border: "1px solid #e8ddc8", boxShadow: "0 3px 18px rgba(44,26,0,.07)",
      marginBottom: "18px",
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display',serif", fontSize: "15px", color: "#b8860b",
        margin: "0 0 22px", paddingBottom: "11px", borderBottom: "1px solid #f0e4cc",
        display: "flex", alignItems: "center", gap: "9px",
      }}>
        <span style={{
          background: "#b8860b", color: "#fff", borderRadius: "50%",
          width: "24px", height: "24px", display: "inline-flex",
          alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0,
        }}>{num}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ClientBox() {
  return (
    <div style={{
      background: "#f7f2e8", borderRadius: "10px", padding: "13px 18px",
      border: "1px dashed #c8b888", marginBottom: "26px",
      fontFamily: "'Crimson Pro',serif", fontSize: "14px", color: "#6b5a3e",
    }}>
      <strong style={{ fontFamily: "'Playfair Display',serif", fontSize: "11px", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>
        Client — inchangé dans ce modèle
      </strong>
      SAS OUEST PALETTES — Le Four Lutton, 85140 La Merlatière<br />
      RCS 339 804 684 — Représenté par M. JEAUD Patrice, gérant
    </div>
  );
}

function BtnGenerer({ ok, onClick }) {
  return (
    <button onClick={() => ok && onClick()} style={{
      width: "100%", padding: "15px",
      background: ok ? "#b8860b" : "#c8b888",
      color: "#fff", border: "none", borderRadius: "10px",
      fontFamily: "'Playfair Display',serif", fontSize: "16px", fontWeight: 700,
      cursor: ok ? "pointer" : "not-allowed", letterSpacing: ".04em",
      boxShadow: ok ? "0 4px 18px rgba(184,134,11,.35)" : "none",
      transition: "all .2s",
    }}>
      {ok ? "Générer et sauvegarder →" : "Complétez les champs obligatoires *"}
    </button>
  );
}

// ── LISTE CONTRATS (générique) ────────────────────────────────
function ListeContrats({ titre, badge, sousTitre, icon, contrats, onOuvrir, onSupprimer, onNouveau }) {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 16px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{
          display: "inline-block", background: "#b8860b", color: "#fff",
          fontFamily: "'Playfair Display',serif", fontSize: "10px", fontWeight: 700,
          letterSpacing: ".2em", textTransform: "uppercase",
          padding: "3px 14px", borderRadius: "20px", marginBottom: "14px",
        }}>{badge}</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "28px", fontWeight: 700, color: "#1a1008", margin: "0 0 7px" }}>{titre}</h1>
        <p style={{ color: "#7a6a52", fontSize: "15px", margin: 0, fontFamily: "'Crimson Pro',serif" }}>
          {contrats.length} contrat{contrats.length > 1 ? "s" : ""} sauvegardé{contrats.length > 1 ? "s" : ""}
        </p>
      </div>

      <button onClick={onNouveau} style={{
        width: "100%", padding: "14px",
        background: "#b8860b", color: "#fff", border: "none", borderRadius: "10px",
        fontFamily: "'Playfair Display',serif", fontSize: "15px", fontWeight: 700,
        cursor: "pointer", letterSpacing: ".04em", marginBottom: "24px",
        boxShadow: "0 4px 18px rgba(184,134,11,.35)",
      }}>+ Nouveau contrat</button>

      {contrats.length === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 24px",
          background: "#fff", borderRadius: "16px", border: "1px solid #e8ddc8",
          color: "#9a8a72", fontFamily: "'Crimson Pro',serif", fontSize: "16px",
        }}>Aucun contrat sauvegardé pour le moment.</div>
      )}

      {contrats.map(c => (
        <div key={c.id} style={{
          background: "#fff", borderRadius: "12px", padding: "18px 22px",
          border: "1px solid #e8ddc8", boxShadow: "0 2px 12px rgba(44,26,0,.06)",
          marginBottom: "12px", display: "flex", alignItems: "center", gap: "16px",
        }}>
          <div style={{
            background: "#f7f0e3", borderRadius: "50%", width: "44px", height: "44px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
          }}>{icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "15px", color: "#1a1008", marginBottom: "3px" }}>
              {c.nom || "Sans nom"}
            </div>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "13px", color: "#7a6a52" }}>
              Signé le {c.dateSig} · Début : {c.dateDebut}
            </div>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "12px", color: "#b8860b", marginTop: "2px" }}>
              Sauvegardé le {new Date(c.savedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={() => onOuvrir(c)} style={{
              padding: "7px 14px", background: "#b8860b", border: "none", color: "#fff",
              borderRadius: "7px", cursor: "pointer", fontSize: "13px",
              fontFamily: "'Playfair Display',serif", fontWeight: 700,
            }}>Ouvrir</button>
            <button onClick={() => onSupprimer(c.id)} style={{
              padding: "7px 10px", background: "transparent", border: "1px solid #e8ddc8",
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
        width, border: "1px solid #ddd0bb", borderRadius: "5px",
        padding: "4px 7px", fontFamily: "'Crimson Pro',serif",
        fontSize: "13px", background: "#fdfaf5", outline: "none",
        textAlign: align, boxSizing: "border-box",
      }} />
  );

  return (
    <Section num={num} title="Grille tarifaire">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f0e8d8" }}>
              {["Libellé de la prestation", "Prix HT (€)", "Unité", ""].map(h => (
                <th key={h} style={{
                  padding: "8px 10px", textAlign: "left",
                  fontFamily: "'Playfair Display',serif", fontSize: "11px",
                  fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                  color: "#6b5a3e", borderBottom: "2px solid #d1c4b0", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tarifs.map((t, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fdfaf5" : "#fff" }}>
                <td style={{ padding: "5px 8px" }}>{cellInput(t.libelle, v => update(i, "libelle", v), "100%")}</td>
                <td style={{ padding: "5px 8px", width: "110px" }}>{cellInput(t.prix, v => update(i, "prix", v), "90px", "right")}</td>
                <td style={{ padding: "5px 8px", width: "120px" }}>
                  <select value={t.unite} onChange={e => update(i, "unite", e.target.value)}
                    style={{
                      border: "1px solid #ddd0bb", borderRadius: "5px",
                      padding: "4px 7px", fontFamily: "'Crimson Pro',serif",
                      fontSize: "13px", background: "#fdfaf5", outline: "none", width: "100%",
                    }}>
                    <option value="pièce">/ pièce</option>
                    <option value="heure">/ heure</option>
                    <option value="forfait">forfait</option>
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
        background: "transparent", border: "1px solid #b8860b",
        color: "#b8860b", borderRadius: "6px", cursor: "pointer",
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
    at: { fontWeight: "bold", textDecoration: "underline", display: "block", marginTop: "7px", marginBottom: "2px" },
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

// ═══════════════════════════════════════════════════════════════
// MODULE CHAUFFEURS
// ═══════════════════════════════════════════════════════════════

function ContractViewChauffeur({ f, tarifs }) {
  const rep = `${f.ch_civilite} ${f.ch_nomFamille}${f.ch_prenom ? " " + f.ch_prenom : ""}`.trim();
  const half = Math.ceil(tarifs.length / 2);
  const L = tarifs.slice(0, half), R = tarifs.slice(half);

  const BG2 = "#f7f0e3", GOLD = "#b8860b", BORDER = "#d8c9a8";

  const c = {
    wrap: { fontFamily: "'Times New Roman',Times,serif", fontSize: "9.5pt", color: "#1a1008", lineHeight: 1.35, maxWidth: "800px", margin: "0 auto", background: "#fff", padding: "24px 36px", border: `1px solid ${BORDER}`, borderTop: `4px solid ${GOLD}` },
    h1: { fontSize: "12pt", fontWeight: "bold", textAlign: "center", marginBottom: "4px", textDecoration: "underline", letterSpacing: ".05em" },
    divider: { height: "2px", background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, margin: "8px 0 10px", border: "none" },
    partiesBox: { display: "grid", gridTemplateColumns: "1fr 1fr", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "4px", marginBottom: "8px", overflow: "hidden" },
    partyLeft: { padding: "7px 10px", borderRight: `1px solid ${BORDER}` },
    partyRight: { padding: "7px 10px" },
    partyLabel: { fontWeight: "bold", fontSize: "8pt", color: GOLD, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px", display: "block" },
    two: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "4px" },
    at: { fontWeight: "bold", textDecoration: "underline", display: "block", marginTop: "7px", marginBottom: "2px" },
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
          <th style={{ ...c.th, textAlign: "right", width: "80px" }}>Tarif HT</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t, i) => (
          <tr key={i}>
            <td style={i % 2 === 0 ? c.td : c.tdAlt}>{t.libelle}</td>
            <td style={{ ...(i % 2 === 0 ? c.td : c.tdAlt), textAlign: "right", fontWeight: 600 }}>
              {t.prix} €/{t.unite === "heure" ? "h" : t.unite === "pièce" ? "pce" : "forfait"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div id="contrat-print" style={c.wrap}>
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
          <p>Le présent contrat est conclu pour une durée de <strong>{f.ch_duree} mois</strong> à compter du {f.ch_dateDebut}. Il sera renouvelé par tacite reconduction pour des périodes successives de <strong>{f.ch_recon} mois</strong>, sauf dénonciation par e-mail avec accusé de réception, avec un préavis de <strong>{f.ch_preavis} jours</strong> avant l'échéance.</p>
          <span style={c.at}>Article 7 : Facturation et paiement</span>
          <p>Le Prestataire adressera une facture mensuelle sur la base du relevé d'heures quotidien validé, comportant : date et lieu, références du Prestataire, décompte détaillé des heures par type de prestation, montant HT et TTC. Le règlement s'effectuera par virement bancaire dans un délai de 15 jours à compter de la réception de la facture.</p>
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
      <p style={{ fontStyle: "italic", textAlign: "right", margin: "0 0 6px", fontSize: "10.5pt", color: "#3a2a00" }}>
        Fait à La Merlatière, le {f.ch_dateSig}, en deux originaux dont un remis au Prestataire.
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
  const [f, setF] = useState(EMPTY_PALETTES);
  const [tarifs, setTarifs] = useState(TARIFS_DEFAUT);
  const [contratsPalettes, setContratsPalettes] = useState([]);
  const [contratPaletteActif, setContratPaletteActif] = useState(null);
  const setFP = k => v => setF(s => ({ ...s, [k]: v }));

  // ── STATE CHAUFFEURS ──
  const [vueChauffeurs, setVueChauffeurs] = useState("liste");
  const [fc, setFc] = useState(EMPTY_CHAUFFEUR);
  const [tarifsCh, setTarifsCh] = useState(TARIFS_CHAUFFEUR_DEFAUT);
  const [contratsChauffeurs, setContratsChauffeurs] = useState([]);
  const [contratChauffeurActif, setContratChauffeurActif] = useState(null);
  const setFC = k => v => setFc(s => ({ ...s, [k]: v }));

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
  const okPalettes = f.prestNom && f.prestAdresse && f.prestCpVille &&
    f.prestSiret && f.prestNomFamille && f.dateDebut && f.tribunal && f.dateSig;

  const sauvegarderPalette = () => {
    const c = {
      id: Date.now().toString(), savedAt: new Date().toISOString(),
      nom: f.prestNom, dateSig: f.dateSig, dateDebut: f.dateDebut,
      f, tarifs,
    };
    const updated = [c, ...contratsPalettes];
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
    setContratPaletteActif(saved);
    setVuePalettes("contrat");
  };

  // ── HELPERS CHAUFFEURS ──
  const okChauffeur = fc.ch_nom && fc.ch_adresse && fc.ch_cpVille && fc.ch_siret &&
    fc.ch_nomFamille && fc.ch_permis && fc.ch_carte && fc.ch_assurance &&
    fc.ch_dateDebut && fc.ch_tribunal && fc.ch_dateSig;

  const sauvegarderChauffeur = () => {
    const c = {
      id: Date.now().toString(), savedAt: new Date().toISOString(),
      nom: fc.ch_nom, dateSig: fc.ch_dateSig, dateDebut: fc.ch_dateDebut,
      f: fc, tarifs: tarifsCh,
    };
    const updated = [c, ...contratsChauffeurs];
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
    setContratChauffeurActif(saved);
    setVueChauffeurs("contrat");
  };

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
    position: "sticky", top: 0, zIndex: 100, background: "#1a1008",
    padding: "10px 24px", display: "flex", alignItems: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,.35)",
  };
  const btnBarreStyle = {
    padding: "6px 14px", background: "transparent", border: "1px solid #b8860b55",
    color: "#b8860b", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui",
  };

  return (
    <div style={{ minHeight: "100vh", background: isContratView ? "#ede6d8" : "linear-gradient(145deg,#faf6ef,#f0e6d0)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      {/* ── ONGLETS PRINCIPAUX ── */}
      {!isContratView && !isFormulaireView && (
        <div id="no-print" style={{
          display: "flex", background: "#1a1008", padding: "0 24px",
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
              background: onglet === tab.key ? "#f0e6d0" : "transparent",
              color: onglet === tab.key ? "#1a1008" : "#b8860b",
            }}>{tab.label}</button>
          ))}
        </div>
      )}

      {/* ── BARRE CONTRAT ── */}
      {isContratView && (
        <div id="no-print" style={{ ...barreStyle, justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", color: "#b8860b", fontSize: "16px", fontWeight: 700 }}>
            {nomContratActif || "Contrat"}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => {
              if (onglet === "palettes") setVuePalettes("liste");
              else setVueChauffeurs("liste");
            }} style={btnBarreStyle}>← Mes contrats</button>
            <button onClick={() => window.print()} style={{
              padding: "7px 18px", background: "#b8860b", border: "none", color: "#fff",
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
          <span style={{ fontFamily: "'Playfair Display',serif", color: "#b8860b", fontSize: "15px", fontWeight: 700 }}>
            {onglet === "palettes" ? "Nouveau contrat prestataire" : "Nouveau contrat chauffeur"}
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
              onNouveau={() => { setF(EMPTY_PALETTES); setTarifs(TARIFS_DEFAUT); setVuePalettes("formulaire"); }}
            />
          )}

          {vuePalettes === "formulaire" && (
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 16px 80px" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ display: "inline-block", background: "#b8860b", color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: "10px", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "3px 14px", borderRadius: "20px", marginBottom: "14px" }}>Générateur de contrat</div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "30px", fontWeight: 700, color: "#1a1008", margin: "0 0 7px" }}>Prestation de services</h1>
                <p style={{ color: "#7a6a52", fontSize: "15px", margin: 0, fontFamily: "'Crimson Pro',serif" }}>Remplissez les informations puis ajustez les tarifs si besoin</p>
              </div>

              <Section num="1" title="Le Prestataire">
                <Field label="Nom / Raison sociale" value={f.prestNom} onChange={setFP("prestNom")} placeholder="ex : EURL KM PALETTES" required />
                <Field label="Adresse (rue)" value={f.prestAdresse} onChange={setFP("prestAdresse")} placeholder="ex : 3 rue Eric Tabarly" required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Code postal et ville" value={f.prestCpVille} onChange={setFP("prestCpVille")} placeholder="ex : 85430 Nieul-le-Dolent" required />
                  <Field label="Numéro SIRET" value={f.prestSiret} onChange={setFP("prestSiret")} placeholder="ex : 931 539 399 00028" hint="14 chiffres — vérifiez sur annuaire-entreprises.data.gouv.fr" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: "12px" }}>
                  <SelectField label="Civilité" value={f.prestCivilite} onChange={setFP("prestCivilite")} options={["M.", "Mme"]} />
                  <Field label="Nom de famille" value={f.prestNomFamille} onChange={setFP("prestNomFamille")} placeholder="ex : DABO" required />
                  <Field label="Prénom" value={f.prestPrenom} onChange={setFP("prestPrenom")} placeholder="ex : Karfa" />
                </div>
              </Section>

              <Section num="2" title="Conditions du contrat">
                <Field label="Objet de la prestation" value={f.objet} onChange={setFP("objet")} placeholder="ex : le tri et la réparation de palettes" required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <NumField label="Durée initiale" value={f.duree} onChange={setFP("duree")} required />
                  <NumField label="Reconduction tacite" value={f.reconduction} onChange={setFP("reconduction")} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <Field label="Date de début" value={f.dateDebut} onChange={setFP("dateDebut")} placeholder="ex : 1er août 2024" required />
                  <Field label="Tribunal compétent" value={f.tribunal} onChange={setFP("tribunal")} placeholder="ex : La Roche-sur-Yon" required />
                  <Field label="Date de signature" value={f.dateSig} onChange={setFP("dateSig")} placeholder="ex : 1er août 2024" required />
                </div>
              </Section>

              <TarifsEditor num="3" tarifs={tarifs} setTarifs={setTarifs} />
              <ClientBox />
              <BtnGenerer ok={okPalettes} onClick={genererPalette} />
            </div>
          )}

          {vuePalettes === "contrat" && contratPaletteActif && (
            <div style={{ padding: "20px 16px 60px" }}>
              <ContractViewPalettes f={contratPaletteActif.f} tarifs={contratPaletteActif.tarifs} />
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
              onNouveau={() => { setFc(EMPTY_CHAUFFEUR); setTarifsCh(TARIFS_CHAUFFEUR_DEFAUT); setVueChauffeurs("formulaire"); }}
            />
          )}

          {vueChauffeurs === "formulaire" && (
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 16px 80px" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ display: "inline-block", background: "#b8860b", color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: "10px", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "3px 14px", borderRadius: "20px", marginBottom: "14px" }}>Générateur de contrat</div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "30px", fontWeight: 700, color: "#1a1008", margin: "0 0 7px" }}>Prestation de transport</h1>
                <p style={{ color: "#7a6a52", fontSize: "15px", margin: 0, fontFamily: "'Crimson Pro',serif" }}>Remplissez les informations puis ajustez les tarifs si besoin</p>
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
                  <Field label="Date de début" value={fc.ch_dateDebut} onChange={setFC("ch_dateDebut")} placeholder="ex : 1er août 2025" required />
                  <Field label="Tribunal compétent" value={fc.ch_tribunal} onChange={setFC("ch_tribunal")} placeholder="ex : La Roche-sur-Yon" required />
                  <Field label="Date de signature" value={fc.ch_dateSig} onChange={setFC("ch_dateSig")} placeholder="ex : 1er août 2025" required />
                </div>
              </Section>

              <TarifsEditor num="3" tarifs={tarifsCh} setTarifs={setTarifsCh} />
              <ClientBox />
              <BtnGenerer ok={okChauffeur} onClick={genererChauffeur} />
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
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #bbb; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>
    </div>
  );
}
