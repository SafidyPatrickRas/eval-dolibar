-- =========================
-- JOBS
-- =========================

INSERT INTO job (code, label) VALUES ('DIRECTOR', 'Directeur général');
INSERT INTO job (code, label) VALUES ('MANAGER', 'Manager');
INSERT INTO job (code, label) VALUES ('HR', 'Responsable RH');
INSERT INTO job (code, label) VALUES ('ACCOUNTANT', 'Comptable');
INSERT INTO job (code, label) VALUES ('FINANCE', 'Responsable financier');
INSERT INTO job (code, label) VALUES ('SALES', 'Commercial');
INSERT INTO job (code, label) VALUES ('SALES_MANAGER', 'Responsable commercial');
INSERT INTO job (code, label) VALUES ('PURCHASING', 'Acheteur');
INSERT INTO job (code, label) VALUES ('LOGISTICS', 'Responsable logistique');
INSERT INTO job (code, label) VALUES ( 'WAREHOUSE', 'Magasinier');
INSERT INTO job (code, label) VALUES ( 'SECRETARY', 'Secrétaire');
INSERT INTO job (code, label) VALUES ( 'ASSISTANT', 'Assistant administratif');
INSERT INTO job (code, label) VALUES ( 'IT', 'Technicien informatique');
INSERT INTO job (code, label) VALUES ( 'DEVELOPER', 'Développeur');
INSERT INTO job (code, label) VALUES ( 'SUPPORT', 'Support technique');

-- =========================
-- HOLIDAYS
-- =========================

INSERT INTO holiday (name, date, description) VALUES
('Nouvel An', '2026-01-01', 'Jour de l’an'),
('Fête du Travail', '2026-05-01', 'Journée des travailleurs'),
('Fête Nationale', '2026-06-26', 'Indépendance de Madagascar'),
('Assomption', '2026-08-15', 'Fête religieuse'),
('Noël', '2026-12-25', 'Fête de Noël'),
('Lundi de Pâques', '2026-04-06', 'Date variable selon calendrier chrétien');