import { useState } from "react";

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

const EMPTY = {
  prestNom: "", prestAdresse: "", prestCpVille: "", prestSiret: "",
  prestCivilite: "M.", prestPrenom: "", prestNomFamille: "",
  objet: "le tri et la réparation de palettes",
  duree: "6", reconduction: "6",
  dateDebut: "", tribunal: "", dateSig: "",
};

// ── Shared input style ────────────────────────────────────
const inputBase = (focus) => ({
  width: "100%", padding: "9px 13px", borderRadius: "8px",
  border: `1.5px solid ${focus ? "#b8860b" : "#ddd0bb"}`,
  background: focus ? "#fffdf7" : "#fdfaf5",
  fontFamily: "'Crimson Pro',serif", fontSize: "15px", color: "#1a1008",
  outline: "none", boxSizing: "border-box",
  boxShadow: focus ? "0 0 0 3px rgba(184,134,11,.12)" : "none",
  transition: "border-color .2s, box-shadow .2s",
});

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

function NumField({ label, value, onChange, required }) {
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
        <input type="number" min="1" max="36" value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...inputBase(focus), width: "90px", textAlign: "center", fontWeight: "600", fontSize: "17px" }} />
        <span style={{ color: "#7a6a52", fontFamily: "'Crimson Pro',serif", fontSize: "15px" }}>mois</span>
      </div>
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

// ── Tarifs editor ────────────────────────────────────────
function TarifsEditor({ tarifs, setTarifs }) {
  const update = (i, field, val) =>
    setTarifs(t => t.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const add = () =>
    setTarifs(t => [...t, { libelle: "", prix: "", unite: "pièce" }]);
  const remove = (i) =>
    setTarifs(t => t.filter((_, idx) => idx !== i));

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
    <Section num="3" title="Grille tarifaire">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f0e8d8" }}>
              {["Libellé de la prestation", "Prix HT (€)", "Unité", ""].map(h => (
                <th key={h} style={{
                  padding: "8px 10px", textAlign: "left",
                  fontFamily: "'Playfair Display',serif", fontSize: "11px",
                  fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                  color: "#6b5a3e", borderBottom: "2px solid #d1c4b0",
                  whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tarifs.map((t, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fdfaf5" : "#fff" }}>
                <td style={{ padding: "5px 8px" }}>
                  {cellInput(t.libelle, v => update(i, "libelle", v), "100%")}
                </td>
                <td style={{ padding: "5px 8px", width: "110px" }}>
                  {cellInput(t.prix, v => update(i, "prix", v), "90px", "right")}
                </td>
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

// ── Contract display ─────────────────────────────────────
function Contract({ f, tarifs }) {
  const rep = `${f.prestCivilite} ${f.prestNomFamille}${f.prestPrenom ? " " + f.prestPrenom : ""}`.trim();
  const half = Math.ceil(tarifs.length / 2);
  const L = tarifs.slice(0, half), R = tarifs.slice(half);

  // Beige palette for the contract
  const BG = "#fdf8f0";
  const BG2 = "#f7f0e3";
  const GOLD = "#b8860b";
  const BORDER = "#d8c9a8";

  const c = {
    wrap: {
      fontFamily: "'Times New Roman',Times,serif",
      fontSize: "11pt", color: "#1a1008", lineHeight: 1.52,
      maxWidth: "800px", margin: "0 auto",
      background: "#fff",
      padding: "44px 48px",
      border: `1px solid ${BORDER}`,
      borderTop: `4px solid ${GOLD}`,
    },
    h1: {
      fontSize: "14pt", fontWeight: "bold", textAlign: "center",
      marginBottom: "6px", textDecoration: "underline", letterSpacing: ".05em",
      color: "#1a1008",
    },
    divider: {
      height: "2px",
      background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
      margin: "14px 0 18px", border: "none",
    },
    partiesBox: {
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0",
      background: BG2, border: `1px solid ${BORDER}`,
      borderRadius: "4px", marginBottom: "16px", overflow: "hidden",
    },
    partyLeft: { padding: "14px 16px", borderRight: `1px solid ${BORDER}` },
    partyRight: { padding: "14px 16px" },
    partyLabel: {
      fontWeight: "bold", fontSize: "10pt",
      color: GOLD, letterSpacing: ".06em",
      textTransform: "uppercase", marginBottom: "6px", display: "block",
    },
    two: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "8px" },
    at: {
      fontWeight: "bold", textDecoration: "underline",
      display: "block", marginTop: "12px", marginBottom: "3px", color: "#1a1008",
    },
    tt: { width: "100%", borderCollapse: "collapse", fontSize: "10pt" },
    th: {
      border: `1px solid ${BORDER}`, padding: "4px 7px",
      background: BG2, fontWeight: "bold", textAlign: "left", color: "#3a2a00",
    },
    td: { border: `1px solid ${BORDER}`, padding: "3px 7px" },
    tdAlt: { border: `1px solid ${BORDER}`, padding: "3px 7px", background: "#fff" },
    sigRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "22px" },
    sigBox: {
      background: BG2, border: `1px solid ${BORDER}`,
      borderRadius: "4px", padding: "12px 16px",
    },
    sigLine: {
      borderTop: `1px solid ${GOLD}`, paddingTop: "6px",
      marginTop: "40px", fontSize: "10pt", color: "#7a6a52",
    },
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
    <div style={c.wrap}>
      <div style={c.h1}>CONTRAT DE PRESTATION DE SERVICE</div>
      <hr style={c.divider} />

      {/* PARTIES */}
      <div style={c.partiesBox}>
        <div style={c.partyLeft}>
          <span style={c.partyLabel}>Entre — Le Prestataire</span>
          <p style={{ margin: 0 }}>
            <strong>{f.prestNom}</strong>, domicilié au {f.prestAdresse}, {f.prestCpVille},
            immatriculé sous le numéro SIRET {f.prestSiret}, représenté par {rep},<br />
            <strong>Ci-après désigné : le Prestataire.</strong>
          </p>
        </div>
        <div style={c.partyRight}>
          <span style={c.partyLabel}>Et — Le Client</span>
          <p style={{ margin: 0 }}>
            <strong>SAS OUEST PALETTES</strong>, dont le siège social est situé au Le Four Lutton,
            85140 La Merlatière, immatriculée au 339 804 684 R.C.S La Roche-sur-Yon,
            représentée par M. JEAUD Patrice en sa qualité de gérant,<br />
            <strong>Ci-après désigné : le Client.</strong>
          </p>
        </div>
      </div>

      {/* ART 1–6 */}
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

      {/* ART 7 TARIFS */}
      <span style={c.at}>Article 7 : Prix de la prestation</span>
      <p>Les tarifs convenus entre les parties sont les suivants (prix en euros HT). Ces tarifs sont fermes et ne pourront être modifiés que par avenant écrit signé des deux parties.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "7px 0 14px" }}>
        <TarifTable rows={L} /><TarifTable rows={R} />
      </div>

      {/* ART 8–13 */}
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

      {/* SIGNATURES */}
      <hr style={c.divider} />
      <p style={{ fontStyle: "italic", textAlign: "right", margin: "0 0 6px", fontSize: "10.5pt", color: "#3a2a00" }}>
        Fait à La Merlatière, le {f.dateSig}, en deux originaux dont un remis au client.
      </p>
      <p style={{ fontSize: "10.5pt", color: "#7a6a52", marginBottom: "12px" }}>
        (Faire précéder les signatures de la mention « Lu et approuvé. Bon pour accord »)
      </p>
      <div style={c.sigRow}>
        <div style={c.sigBox}>
          <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>Le Client :</p>
          <p style={{ margin: 0 }}>OUEST PALETTES — M. JEAUD Patrice</p>
          <div style={c.sigLine}>Signature</div>
        </div>
        <div style={c.sigBox}>
          <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>Le Prestataire :</p>
          <p style={{ margin: 0 }}>{f.prestNom} — {rep}</p>
          <div style={c.sigLine}>Signature</div>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [f, setF] = useState(EMPTY);
  const [tarifs, setTarifs] = useState(TARIFS_DEFAUT);
  const [show, setShow] = useState(false);
  const set = k => v => setF(s => ({ ...s, [k]: v }));

  const ok = f.prestNom && f.prestAdresse && f.prestCpVille &&
    f.prestSiret && f.prestNomFamille && f.dateDebut && f.tribunal && f.dateSig;

  return (
    <div style={{ minHeight: "100vh", background: show ? "#ede6d8" : "linear-gradient(145deg,#faf6ef,#f0e6d0)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      {/* Toolbar contrat */}
      {show && (
        <div style={{
          position: "sticky", top: 0, zIndex: 100, background: "#1a1008",
          padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,.35)",
        }}>
          <span style={{ fontFamily: "'Playfair Display',serif", color: "#b8860b", fontSize: "16px", fontWeight: 700 }}>
            Contrat — {f.prestNom}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShow(false)} style={{
              padding: "7px 16px", background: "transparent", border: "1px solid #b8860b55",
              color: "#b8860b", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui",
            }}>← Modifier</button>
            <button onClick={() => window.print()} style={{
              padding: "7px 18px", background: "#b8860b", border: "none", color: "#fff",
              borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui", fontWeight: 600,
            }}>🖨️ Imprimer / PDF</button>
          </div>
        </div>
      )}

      {/* FORMULAIRE */}
      {!show && (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 16px 80px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              display: "inline-block", background: "#b8860b", color: "#fff",
              fontFamily: "'Playfair Display',serif", fontSize: "10px", fontWeight: 700,
              letterSpacing: ".2em", textTransform: "uppercase",
              padding: "3px 14px", borderRadius: "20px", marginBottom: "14px",
            }}>Générateur de contrat</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "30px", fontWeight: 700, color: "#1a1008", margin: "0 0 7px" }}>
              Prestation de services
            </h1>
            <p style={{ color: "#7a6a52", fontSize: "15px", margin: 0, fontFamily: "'Crimson Pro',serif" }}>
              Remplissez les informations puis ajustez les tarifs si besoin
            </p>
          </div>

          {/* Section 1 — Prestataire */}
          <Section num="1" title="Le Prestataire">
            <Field label="Nom / Raison sociale" value={f.prestNom} onChange={set("prestNom")} placeholder="ex : EURL KM PALETTES" required />
            <Field label="Adresse (rue)" value={f.prestAdresse} onChange={set("prestAdresse")} placeholder="ex : 3 rue Eric Tabarly" required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Code postal et ville" value={f.prestCpVille} onChange={set("prestCpVille")} placeholder="ex : 85430 Nieul-le-Dolent" required />
              <Field label="Numéro SIRET" value={f.prestSiret} onChange={set("prestSiret")} placeholder="ex : 931 539 399 00028"
                hint="14 chiffres — vérifiez sur annuaire-entreprises.data.gouv.fr" required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: "12px" }}>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontFamily: "'Playfair Display',serif", fontSize: "11px", fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "#6b5a3e", marginBottom: "5px" }}>Civilité</label>
                <select value={f.prestCivilite} onChange={e => set("prestCivilite")(e.target.value)}
                  style={{ width: "100%", padding: "9px 10px", borderRadius: "8px", border: "1.5px solid #ddd0bb", background: "#fdfaf5", fontFamily: "'Crimson Pro',serif", fontSize: "15px", color: "#1a1008", outline: "none" }}>
                  <option>M.</option><option>Mme</option>
                </select>
              </div>
              <Field label="Nom de famille" value={f.prestNomFamille} onChange={set("prestNomFamille")} placeholder="ex : DABO" required />
              <Field label="Prénom" value={f.prestPrenom} onChange={set("prestPrenom")} placeholder="ex : Karfa" />
            </div>
          </Section>

          {/* Section 2 — Contrat */}
          <Section num="2" title="Conditions du contrat">
            <Field label="Objet de la prestation" value={f.objet} onChange={set("objet")} placeholder="ex : le tri et la réparation de palettes" required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <NumField label="Durée initiale" value={f.duree} onChange={set("duree")} required />
              <NumField label="Reconduction tacite" value={f.reconduction} onChange={set("reconduction")} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <Field label="Date de début" value={f.dateDebut} onChange={set("dateDebut")} placeholder="ex : 1er août 2024" required />
              <Field label="Tribunal compétent" value={f.tribunal} onChange={set("tribunal")} placeholder="ex : La Roche-sur-Yon" required />
              <Field label="Date de signature" value={f.dateSig} onChange={set("dateSig")} placeholder="ex : 1er août 2024" required />
            </div>
          </Section>

          {/* Section 3 — Tarifs */}
          <TarifsEditor tarifs={tarifs} setTarifs={setTarifs} />

          {/* Client fixe */}
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

          <button onClick={() => ok && setShow(true)} style={{
            width: "100%", padding: "15px",
            background: ok ? "#b8860b" : "#c8b888",
            color: "#fff", border: "none", borderRadius: "10px",
            fontFamily: "'Playfair Display',serif", fontSize: "16px", fontWeight: 700,
            cursor: ok ? "pointer" : "not-allowed", letterSpacing: ".04em",
            boxShadow: ok ? "0 4px 18px rgba(184,134,11,.35)" : "none",
            transition: "all .2s",
          }}>
            {ok ? "Générer le contrat →" : "Complétez les champs obligatoires *"}
          </button>
        </div>
      )}

      {/* CONTRAT */}
      {show && (
        <div style={{ padding: "20px 16px 60px" }}>
          <Contract f={f} tarifs={tarifs} />
        </div>
      )}

      <style>{`
        @media print {
  body > div > div:first-child { display: none !important; }
  body > div > div:nth-child(2) { display: none !important; }
  body { background: white !important; margin: 0 !important; padding: 0 !important; }
  body > div > div:last-child { display: block !important; padding: 0 !important; }
  body > div > div:last-child > div { box-shadow: none !important; border: none !important; }
}
        * { box-sizing: border-box; }
        input::placeholder { color: #bbb; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>
    </div>
  );
}
