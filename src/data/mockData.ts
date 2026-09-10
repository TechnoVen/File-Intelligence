import { 
  FileItem, 
  DuplicateGroup, 
  RuleItem, 
  OrganizationEntity, 
  HistoryTransaction, 
  RollbackBatch, 
  ScanReport, 
  SafetySettings,
  FolderNode,
  TaxonomyNode
} from '../types';

export const MASTER_ROOT_PATH = '/Users/alex/Documents';

// Stable Taxonomy IDs to Physical Paths mapping
export const STABLE_TAXONOMY_MAPPINGS: Record<string, string> = {
  'inbox.unclassified': '~/Documents/00_Inbox',
  'projects.business.the_den': '~/Documents/01_Projects/Business_Projects/THE_DEN',
  'projects.software.technoven': '~/Documents/01_Projects/Business_Projects/TechnoVen_Platform',
  'projects.software.apps': '~/Documents/01_Projects/Software_Apps',
  'personal.government.jobcenter': '~/Documents/02_Areas/01_Personal/Government_Admin/Jobcenter',
  'personal.finance.tax': '~/Documents/02_Areas/01_Personal/Finance_Tax',
  'personal.housing.herzogstrasse': '~/Documents/02_Areas/01_Personal/Housing_Herzogstrasse',
  'professional.employment.cosfair': '~/Documents/02_Areas/02_Professional/Employment/CosFair_GmbH',
  'professional.employment.amazon': '~/Documents/02_Areas/02_Professional/Employment/Amazon',
  'professional.employment.medicov': '~/Documents/02_Areas/02_Professional/Employment/Medicov_GmbH',
  'professional.career.resumes': '~/Documents/02_Areas/02_Professional/Career',
  'professional.businesses.general': '~/Documents/02_Areas/02_Professional/Businesses',
  'resource.books': '~/Documents/03_Resources/Books',
  'resource.reference': '~/Documents/03_Resources/Reference_Manuals',
  'archive.general': '~/Documents/04_Archive'
};

// Hierarchical Library Overview for Folder Intelligence
export const INITIAL_TAXONOMY_TREE: TaxonomyNode = {
  id: 'root.documents',
  name: 'Documents',
  path: '~/Documents',
  type: 'root',
  filesCount: 12482,
  sizeFormatted: '48.6 GB',
  duplicatesCount: 24,
  unclassifiedCount: 147,
  recentChangesCount: 42,
  targetedByRuleIds: ['rule-1', 'rule-2', 'rule-3', 'rule-4', 'rule-5'],
  associatedOrgNames: ['Jobcenter', 'THE DEN', 'CosFair GmbH', 'Amazon', 'Finanzamt'],
  children: [
    {
      id: 'inbox.unclassified',
      name: '00_Inbox',
      path: '~/Documents/00_Inbox',
      type: 'inbox',
      filesCount: 147,
      sizeFormatted: '840 MB',
      duplicatesCount: 8,
      unclassifiedCount: 147,
      recentChangesCount: 12,
      targetedByRuleIds: [],
      associatedOrgNames: ['Unsorted incoming downloads and scans']
    },
    {
      id: 'projects.root',
      name: '01_Projects',
      path: '~/Documents/01_Projects',
      type: 'project',
      filesCount: 3104,
      sizeFormatted: '14.2 GB',
      duplicatesCount: 5,
      unclassifiedCount: 0,
      recentChangesCount: 18,
      targetedByRuleIds: ['rule-2'],
      associatedOrgNames: ['THE DEN', 'TechnoVen UG', 'Software'],
      children: [
        {
          id: 'projects.business.the_den',
          name: 'THE_DEN',
          path: '~/Documents/01_Projects/Business_Projects/THE_DEN',
          type: 'project',
          filesCount: 486,
          sizeFormatted: '3.8 GB',
          duplicatesCount: 2,
          unclassifiedCount: 0,
          recentChangesCount: 6,
          targetedByRuleIds: ['rule-2'],
          associatedOrgNames: ['THE DEN']
        },
        {
          id: 'projects.software.general',
          name: 'Software_Projects',
          path: '~/Documents/01_Projects/Software_Apps',
          type: 'project',
          filesCount: 1284,
          sizeFormatted: '6.4 GB',
          duplicatesCount: 3,
          unclassifiedCount: 0,
          recentChangesCount: 8,
          targetedByRuleIds: [],
          associatedOrgNames: ['TechnoVen UG']
        },
        {
          id: 'projects.writing.general',
          name: 'Writing_Projects',
          path: '~/Documents/01_Projects/Writing_Projects',
          type: 'project',
          filesCount: 213,
          sizeFormatted: '410 MB',
          duplicatesCount: 0,
          unclassifiedCount: 0,
          recentChangesCount: 4,
          targetedByRuleIds: [],
          associatedOrgNames: []
        }
      ]
    },
    {
      id: 'areas.root',
      name: '02_Areas',
      path: '~/Documents/02_Areas',
      type: 'area',
      filesCount: 4821,
      sizeFormatted: '19.4 GB',
      duplicatesCount: 9,
      unclassifiedCount: 0,
      recentChangesCount: 16,
      targetedByRuleIds: ['rule-1', 'rule-3', 'rule-4', 'rule-5'],
      associatedOrgNames: ['Jobcenter', 'CosFair GmbH', 'Amazon', 'Stadt Düsseldorf'],
      children: [
        {
          id: 'personal.root',
          name: 'Personal',
          path: '~/Documents/02_Areas/01_Personal',
          type: 'area',
          filesCount: 2141,
          sizeFormatted: '7.8 GB',
          duplicatesCount: 4,
          unclassifiedCount: 0,
          recentChangesCount: 7,
          targetedByRuleIds: ['rule-1', 'rule-4', 'rule-5'],
          associatedOrgNames: ['Jobcenter', 'Finanzamt', 'Herzogstraße 90']
        },
        {
          id: 'professional.root',
          name: 'Professional',
          path: '~/Documents/02_Areas/02_Professional',
          type: 'area',
          filesCount: 1396,
          sizeFormatted: '6.2 GB',
          duplicatesCount: 3,
          unclassifiedCount: 0,
          recentChangesCount: 5,
          targetedByRuleIds: ['rule-3'],
          associatedOrgNames: ['CosFair GmbH', 'Amazon', 'Medicov GmbH']
        },
        {
          id: 'family.root',
          name: 'Family',
          path: '~/Documents/02_Areas/03_Family',
          type: 'area',
          filesCount: 841,
          sizeFormatted: '3.9 GB',
          duplicatesCount: 2,
          unclassifiedCount: 0,
          recentChangesCount: 3,
          targetedByRuleIds: [],
          associatedOrgNames: ['Familienkasse']
        }
      ]
    },
    {
      id: 'resources.root',
      name: '03_Resources',
      path: '~/Documents/03_Resources',
      type: 'resource',
      filesCount: 3017,
      sizeFormatted: '10.8 GB',
      duplicatesCount: 2,
      unclassifiedCount: 0,
      recentChangesCount: 4,
      targetedByRuleIds: [],
      associatedOrgNames: []
    },
    {
      id: 'archive.root',
      name: '04_Archive',
      path: '~/Documents/04_Archive',
      type: 'archive',
      filesCount: 1393,
      sizeFormatted: '3.4 GB',
      duplicatesCount: 0,
      unclassifiedCount: 0,
      recentChangesCount: 2,
      targetedByRuleIds: [],
      associatedOrgNames: []
    }
  ]
};

export const INITIAL_SAFETY_SETTINGS: SafetySettings = {
  dryRunMode: true,
  autoFileMoves: false,
  permanentDeletion: false,
  rollbackProtection: true,
  localAiEnabled: true,
  sendDuplicatesToTrash: true,
  verifyHashAfterMove: true,
  requireApprovalBeforeMoves: true,
  logOperationsToSqlite: true,
};

export const LATEST_SCAN_REPORT: ScanReport = {
  timestamp: 'Today, 06:45 AM',
  durationSeconds: 14.2,
  filesScanned: 12482,
  newFiles: 42,
  duplicatesDetected: 24,
  aiClassifications: 38,
  errors: 0,
  scannedRoots: ['~/Desktop', '~/Downloads', '~/Documents', '/Volumes/SanDisk_Backup'],
};

export const MASTER_FOLDER_TREE: FolderNode = {
  name: 'Documents',
  path: '/Users/alex/Documents',
  type: 'system',
  children: [
    { name: '00_Automations', path: '/Users/alex/Documents/00_Automations', type: 'system' },
    { name: '00_Inbox', path: '/Users/alex/Documents/00_Inbox', type: 'system' },
    {
      name: '01_Projects',
      path: '/Users/alex/Documents/01_Projects',
      type: 'project',
      children: [
        {
          name: 'Business_Projects',
          path: '/Users/alex/Documents/01_Projects/Business_Projects',
          type: 'project',
          children: [
            { name: 'THE_DEN', path: '/Users/alex/Documents/01_Projects/Business_Projects/THE_DEN', type: 'project' },
            { name: 'TechnoVen_Platform', path: '/Users/alex/Documents/01_Projects/Business_Projects/TechnoVen_Platform', type: 'project' },
          ],
        },
        { name: 'Software_Apps', path: '/Users/alex/Documents/01_Projects/Software_Apps', type: 'project' },
      ],
    },
    {
      name: '02_Areas',
      path: '/Users/alex/Documents/02_Areas',
      type: 'area',
      children: [
        {
          name: '01_Personal',
          path: '/Users/alex/Documents/02_Areas/01_Personal',
          type: 'area',
          children: [
            { name: 'Government_Admin', path: '/Users/alex/Documents/02_Areas/01_Personal/Government_Admin', type: 'area' },
            { name: 'Finance_Tax', path: '/Users/alex/Documents/02_Areas/01_Personal/Finance_Tax', type: 'area' },
            { name: 'Housing_Herzogstrasse', path: '/Users/alex/Documents/02_Areas/01_Personal/Housing_Herzogstrasse', type: 'area' },
          ],
        },
        {
          name: '02_Professional',
          path: '/Users/alex/Documents/02_Areas/02_Professional',
          type: 'area',
          children: [
            {
              name: 'Employment',
              path: '/Users/alex/Documents/02_Areas/02_Professional/Employment',
              type: 'area',
              children: [
                { name: 'CosFair_GmbH', path: '/Users/alex/Documents/02_Areas/02_Professional/Employment/CosFair_GmbH', type: 'area' },
                { name: 'Amazon', path: '/Users/alex/Documents/02_Areas/02_Professional/Employment/Amazon', type: 'area' },
                { name: 'Medicov_GmbH', path: '/Users/alex/Documents/02_Areas/02_Professional/Employment/Medicov_GmbH', type: 'area' },
              ],
            },
            { name: 'Career', path: '/Users/alex/Documents/02_Areas/02_Professional/Career', type: 'area' },
            { name: 'Businesses', path: '/Users/alex/Documents/02_Areas/02_Professional/Businesses', type: 'area' },
            { name: 'Consultation', path: '/Users/alex/Documents/02_Areas/02_Professional/Consultation', type: 'area' },
            { name: 'Freelance', path: '/Users/alex/Documents/02_Areas/02_Professional/Freelance', type: 'area' },
          ],
        },
        { name: '03_Family', path: '/Users/alex/Documents/02_Areas/03_Family', type: 'area' },
        { name: '04_Hobbies', path: '/Users/alex/Documents/02_Areas/04_Hobbies', type: 'area' },
        { name: '05_Social_Community', path: '/Users/alex/Documents/02_Areas/05_Social_Community', type: 'area' },
        { name: '06_Education', path: '/Users/alex/Documents/02_Areas/06_Education', type: 'area' },
      ],
    },
    { name: '03_Resources', path: '/Users/alex/Documents/03_Resources', type: 'resource' },
    { name: '04_Archive', path: '/Users/alex/Documents/04_Archive', type: 'archive' },
    { name: '05_Notes_DB', path: '/Users/alex/Documents/05_Notes_DB', type: 'system' },
    { name: '06_Shared', path: '/Users/alex/Documents/06_Shared', type: 'system' },
    { name: '08_Duplicates', path: '/Users/alex/Documents/08_Duplicates', type: 'system' },
    { name: '99_Transfer', path: '/Users/alex/Documents/99_Transfer', type: 'system' },
    { name: 'Codex', path: '/Users/alex/Documents/Codex', type: 'system' },
  ],
};

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'f-1',
    name: 'JC_Widerspruch_11.06.2026.pdf',
    extension: 'pdf',
    currentPath: '/Users/alex/Downloads/JC_Widerspruch_11.06.2026.pdf',
    suggestedDestination: 'Documents / 02_Areas / 01_Personal / Government_Admin / Jobcenter',
    proposedFilename: '2026-06-11_Jobcenter_Widerspruch_Bescheid.pdf',
    category: 'Government / Jobcenter',
    folderClassification: 'Area',
    confidence: 96,
    confidenceTier: 'High',
    reason: "Contains Jobcenter Düsseldorf and Widerspruchsverfahren",
    ruleOrAi: 'Rule + AI',
    classificationSource: 'Rule #101',
    stableTaxonomyId: 'personal.government.jobcenter',
    status: 'suggested',
    sizeBytes: 1845200,
    sizeFormatted: '1.8 MB',
    sha256: '9f83a213e4b7c89d021f7c32aa41b6c7810339d2e1329ffca7710bde48123011',
    createdDate: '2026-06-11 14:22',
    modifiedDate: '2026-06-11 14:25',
    detectedDocDate: '2026-06-11',
    organization: 'Jobcenter Düsseldorf',
    tags: ['government', 'legal', 'widerspruch', 'jc-duesseldorf'],
    mimeType: 'application/pdf',
    previewSnippet: 'JOBCENTER DÜSSELDORF - Geschäftszeichen: BG 40221-98712\nWiderspruch gegen den Bescheid vom 28.05.2026 hinsichtlich der Kosten der Unterkunft...'
  },
  {
    id: 'f-2',
    name: 'THE_DEN_Betriebskonzept.docx',
    extension: 'docx',
    currentPath: '/Users/alex/Desktop/THE_DEN_Betriebskonzept.docx',
    suggestedDestination: 'Documents / 01_Projects / Business_Projects / THE_DEN / Operations',
    proposedFilename: 'THE_DEN_Betriebskonzept_v2.docx',
    category: 'Projects / THE DEN',
    folderClassification: 'Project',
    confidence: 94,
    confidenceTier: 'High',
    reason: "Matches THE DEN project operational concept and business plan",
    ruleOrAi: 'AI',
    classificationSource: 'Local AI',
    stableTaxonomyId: 'projects.business.the_den',
    status: 'suggested',
    sizeBytes: 4210000,
    sizeFormatted: '4.2 MB',
    sha256: 'a12bc4f981011ea345bcdf88190012de9932401f8221adbc430198de76110294',
    createdDate: '2026-08-19 11:04',
    modifiedDate: '2026-09-02 18:30',
    detectedDocDate: '2026-08-19',
    organization: 'THE DEN',
    tags: ['business', 'the-den', 'operations', 'concept'],
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    previewSnippet: 'THE DEN – Modernes Co-Working & Kulturhub Düsseldorf\nBetriebskonzept, Flächennutzung, Genehmigungsantrag und Öffnungszeiten 2026-2027...'
  },
  {
    id: 'f-3',
    name: 'CosFair_Abrechnung_Februar.pdf',
    extension: 'pdf',
    currentPath: '/Users/alex/Downloads/CosFair_Abrechnung_Februar.pdf',
    suggestedDestination: 'Documents / 02_Areas / 02_Professional / Employment / CosFair_GmbH / Payroll',
    proposedFilename: '2026-02_CosFair_Gehaltsabrechnung.pdf',
    category: 'Professional / Employment',
    folderClassification: 'Area',
    confidence: 98,
    confidenceTier: 'High',
    reason: "Contains CosFair GmbH payroll statement and employee ID",
    ruleOrAi: 'Rule',
    classificationSource: 'Rule #103',
    stableTaxonomyId: 'professional.employment.cosfair',
    status: 'suggested',
    sizeBytes: 892000,
    sizeFormatted: '892 KB',
    sha256: '7394ba001ecde912fa8409115bcaa92019fe829031baed992410aefc882190bb',
    createdDate: '2026-03-01 09:12',
    modifiedDate: '2026-03-01 09:12',
    detectedDocDate: '2026-02-28',
    organization: 'CosFair GmbH',
    tags: ['employment', 'payroll', 'cosfair', 'tax-relevant'],
    mimeType: 'application/pdf',
    previewSnippet: 'CosFair GmbH, Königsallee 106, 40215 Düsseldorf\nEntgeltabrechnung für Februar 2026\nPersonal-Nr: CF-8491 / Steuerklasse 1...'
  },
  {
    id: 'f-4',
    name: 'Mietvertrag_Herzogstrasse_90_Addendum.pdf',
    extension: 'pdf',
    currentPath: '/Users/alex/Downloads/Mietvertrag_Herzogstrasse_90_Addendum.pdf',
    suggestedDestination: 'Documents / 02_Areas / 01_Personal / Housing_Herzogstrasse',
    proposedFilename: '2026_Mietvertrag_Herzogstrasse_90_Nachtrag.pdf',
    category: 'Personal / Housing',
    folderClassification: 'Area',
    confidence: 92,
    confidenceTier: 'High',
    reason: "Matched address 'Herzogstraße 90' and tenancy agreement keywords",
    ruleOrAi: 'AI',
    classificationSource: 'Local AI',
    stableTaxonomyId: 'personal.housing.herzogstrasse',
    status: 'suggested',
    sizeBytes: 2410000,
    sizeFormatted: '2.4 MB',
    sha256: '5d9283fa8110ce4490192ea019bbef71902410bc9310de4490218ef8902144ac',
    createdDate: '2026-07-14 16:40',
    modifiedDate: '2026-07-14 16:40',
    detectedDocDate: '2026-07-10',
    organization: 'Stadt Düsseldorf',
    tags: ['housing', 'herzogstrasse-90', 'contract'],
    mimeType: 'application/pdf',
    previewSnippet: 'Nachtrag zum Mietvertrag vom 01.04.2023 betreffend Wohneinheit Herzogstraße 90, 40217 Düsseldorf. Festsetzung der Nebenkostenvorauszahlung...'
  },
  {
    id: 'f-5',
    name: 'TechnoCraftz_Consulting_Invoice_Inv841.pdf',
    extension: 'pdf',
    currentPath: '/Users/alex/Downloads/TechnoCraftz_Consulting_Invoice_Inv841.pdf',
    suggestedDestination: 'Documents / 02_Areas / 02_Professional / Businesses / TechnoCraftz / Invoices',
    proposedFilename: '2026-05_Invoice_Inv841_TechnoCraftz.pdf',
    category: 'Professional / Businesses',
    folderClassification: 'Area',
    confidence: 89,
    confidenceTier: 'Medium',
    reason: "Identified entity 'TechnoCraftz' and VAT invoice number #841",
    ruleOrAi: 'Rule + AI',
    classificationSource: 'Metadata classifier',
    stableTaxonomyId: 'professional.businesses.general',
    status: 'suggested',
    sizeBytes: 640000,
    sizeFormatted: '640 KB',
    sha256: '38190cefab491024bdc890124701290bbfae891240182cefbca910481204018b',
    createdDate: '2026-05-20 10:15',
    modifiedDate: '2026-05-20 10:15',
    detectedDocDate: '2026-05-19',
    organization: 'TechnoCraftz',
    tags: ['invoice', 'technocraftz', 'accounting', '2026'],
    mimeType: 'application/pdf',
    previewSnippet: 'TechnoCraftz Consulting & Software Development\nRechnung Nr. 2026-841\nLeistungszeitraum: 01.05.2026 - 15.05.2026...'
  },
  {
    id: 'f-6',
    name: 'Finanzamt_Steuerbescheid_Einkommensteuer_2025.pdf',
    extension: 'pdf',
    currentPath: '/Users/alex/Downloads/Finanzamt_Steuerbescheid_Einkommensteuer_2025.pdf',
    suggestedDestination: 'Documents / 02_Areas / 01_Personal / Finance_Tax',
    proposedFilename: '2025_Finanzamt_Duesseldorf_Einkommensteuerbescheid.pdf',
    category: 'Government / Finanzamt',
    folderClassification: 'Area',
    confidence: 97,
    confidenceTier: 'High',
    reason: "Contains official tax assessment from Finanzamt Düsseldorf-Mitte for 2025",
    ruleOrAi: 'Rule + AI',
    classificationSource: 'Rule #104',
    stableTaxonomyId: 'personal.finance.tax',
    status: 'suggested',
    sizeBytes: 3120000,
    sizeFormatted: '3.1 MB',
    sha256: 'e81940bc12984102efbca81029410ea89104bcde8194012489012481029481aa',
    createdDate: '2026-08-04 11:30',
    modifiedDate: '2026-08-04 11:30',
    detectedDocDate: '2026-07-28',
    organization: 'Finanzamt',
    tags: ['taxes', 'finanzamt', 'einkommensteuer', '2025'],
    mimeType: 'application/pdf',
    previewSnippet: 'Finanzamt Düsseldorf-Mitte, Steuernummer 103/5912/4819\nBescheid für 2025 über Einkommensteuer und Solidaritätszuschlag...'
  },
  {
    id: 'f-7',
    name: 'Digitalcourage_Mitgliedsantrag_Bestaetigung.pdf',
    extension: 'pdf',
    currentPath: '/Users/alex/Desktop/Digitalcourage_Mitgliedsantrag_Bestaetigung.pdf',
    suggestedDestination: 'Documents / 02_Areas / 05_Social_Community / Digitalcourage',
    proposedFilename: '2026_Digitalcourage_Mitgliedsbestaetigung.pdf',
    category: 'Social / Community',
    folderClassification: 'Area',
    confidence: 91,
    confidenceTier: 'High',
    reason: "Matched community NGO 'Digitalcourage e.V.' membership documentation",
    ruleOrAi: 'AI',
    classificationSource: 'Local AI',
    stableTaxonomyId: 'social.digitalcourage',
    status: 'suggested',
    sizeBytes: 410000,
    sizeFormatted: '410 KB',
    sha256: '719041289bcaef1024981024bbce89102418bc0012489104efca891048120489',
    createdDate: '2026-04-12 09:40',
    modifiedDate: '2026-04-12 09:40',
    detectedDocDate: '2026-04-10',
    organization: 'Digitalcourage',
    tags: ['social', 'digitalcourage', 'privacy', 'community'],
    mimeType: 'application/pdf',
    previewSnippet: 'Digitalcourage e.V. - Für Bürgerrechte und Datenschutz\nBestätigung Ihrer Fördermitgliedschaft ab 01.04.2026...'
  },
  {
    id: 'f-8',
    name: 'Albatross_Tech_Spec_Architecture_Draft.md',
    extension: 'md',
    currentPath: '/Users/alex/Desktop/Albatross_Tech_Spec_Architecture_Draft.md',
    suggestedDestination: 'Documents / 02_Areas / 02_Professional / Businesses / Albatross_Technologies',
    proposedFilename: 'Albatross_Architecture_Spec_v1.md',
    category: 'Professional / Businesses',
    folderClassification: 'Area',
    confidence: 85,
    confidenceTier: 'Medium',
    reason: "Contains Albatross Technologies Limited distributed storage architectural blueprint",
    ruleOrAi: 'AI',
    status: 'suggested',
    sizeBytes: 94000,
    sizeFormatted: '94 KB',
    sha256: '4102941028bcfae81024981024bbce89102418bc0012489104efca8910481204',
    createdDate: '2026-09-05 22:18',
    modifiedDate: '2026-09-08 01:14',
    organization: 'Albatross Technologies Limited',
    tags: ['albatross', 'architecture', 'spec', 'distributed-systems'],
    mimeType: 'text/markdown',
    previewSnippet: '# Albatross Technologies Limited - Core Infrastructure Architecture\nTarget throughput: 100k events/sec. Local cache layer with SQLite sync protocol...'
  },
  {
    id: 'f-9',
    name: 'unknown_scanned_receipt_IMG_9941.png',
    extension: 'png',
    currentPath: '/Users/alex/Downloads/unknown_scanned_receipt_IMG_9941.png',
    suggestedDestination: 'Documents / 00_Inbox / Needs_Manual_Review',
    proposedFilename: 'Receipt_Pending_Inspection_2026.png',
    category: 'Inbox / Review',
    folderClassification: 'System',
    confidence: 48,
    confidenceTier: 'Low',
    reason: "Low OCR clarity; partial tax numbers detected but merchant is ambiguous",
    ruleOrAi: 'AI',
    status: 'suggested',
    sizeBytes: 1540000,
    sizeFormatted: '1.5 MB',
    sha256: '990124810294819041289bcaef1024981024bbce89102418bc0012489104efca',
    createdDate: '2026-09-09 19:22',
    modifiedDate: '2026-09-09 19:22',
    tags: ['unclassified', 'low-confidence', 'receipt'],
    mimeType: 'image/png',
    previewSnippet: '[IMAGE OCR OCR-PREVIEW]\nBetrag: 34,80 EUR\nDatum: 08.09.2026\n...unleserliche Zeile...'
  }
];

export const DUPLICATE_GROUPS: DuplicateGroup[] = [
  {
    id: 'dup-1',
    sha256: 'c830198de76110294a12bc4f981011ea345bcdf88190012de9932401f8221adb',
    fileSizeBytes: 4200000,
    fileSizeFormatted: '4.2 MB',
    totalCopies: 2,
    potentialSavings: '4.2 MB',
    isExact: true,
    matchType: 'Exact SHA-256',
    canonicalFile: {
      id: 'canon-1',
      name: 'Jobcenter_Bescheid.pdf',
      extension: 'pdf',
      currentPath: '/Users/alex/Documents/02_Areas/01_Personal/Government_Admin/Jobcenter/Jobcenter_Bescheid.pdf',
      suggestedDestination: '/Users/alex/Documents/02_Areas/01_Personal/Government_Admin/Jobcenter/Jobcenter_Bescheid.pdf',
      proposedFilename: 'Jobcenter_Bescheid.pdf',
      category: 'Personal / Government',
      folderClassification: 'Area',
      confidence: 100,
      confidenceTier: 'High',
      reason: 'Existing master file in Documents tree',
      ruleOrAi: 'Rule',
      status: 'verified',
      sizeBytes: 4200000,
      sizeFormatted: '4.2 MB',
      sha256: 'c830198de76110294a12bc4f981011ea345bcdf88190012de9932401f8221adb',
      createdDate: '2026-05-10 10:14',
      modifiedDate: '2026-05-10 10:14',
      detectedDocDate: '2026-05-09',
      organization: 'Jobcenter Düsseldorf',
      tags: ['government', 'canonical', 'jobcenter'],
      mimeType: 'application/pdf',
      previewSnippet: 'Jobcenter Düsseldorf - Bewilligungsbescheid zur Sicherung des Lebensunterhalts...'
    },
    duplicates: [
      {
        id: 'dup-item-1',
        name: 'Jobcenter_Bescheid copy.pdf',
        extension: 'pdf',
        currentPath: '/Users/alex/Downloads/Jobcenter_Bescheid copy.pdf',
        suggestedDestination: 'OS Trash',
        proposedFilename: 'Jobcenter_Bescheid copy.pdf',
        category: 'Downloads / Unorganized',
        folderClassification: 'System',
        confidence: 99,
        confidenceTier: 'High',
        reason: 'Identical SHA-256 hash to canonical copy in Documents',
        ruleOrAi: 'Rule',
        status: 'suggested',
        sizeBytes: 4200000,
        sizeFormatted: '4.2 MB',
        sha256: 'c830198de76110294a12bc4f981011ea345bcdf88190012de9932401f8221adb',
        createdDate: '2026-06-02 18:22',
        modifiedDate: '2026-06-02 18:22',
        tags: ['duplicate', 'downloads'],
        mimeType: 'application/pdf',
        previewSnippet: 'Jobcenter Düsseldorf - Bewilligungsbescheid zur Sicherung des Lebensunterhalts...'
      }
    ]
  },
  {
    id: 'dup-2',
    sha256: 'f81024bbce89102418bc0012489104efca891048120489901248102948190412',
    fileSizeBytes: 148000000,
    fileSizeFormatted: '148 MB',
    totalCopies: 2,
    potentialSavings: '148 MB',
    isExact: true,
    matchType: 'Exact SHA-256',
    canonicalFile: {
      id: 'canon-2',
      name: 'THE_DEN_Brand_Kit_Vector_Master.zip',
      extension: 'zip',
      currentPath: '/Users/alex/Documents/01_Projects/Business_Projects/THE_DEN/Assets/THE_DEN_Brand_Kit_Vector_Master.zip',
      suggestedDestination: '/Users/alex/Documents/01_Projects/Business_Projects/THE_DEN/Assets/THE_DEN_Brand_Kit_Vector_Master.zip',
      proposedFilename: 'THE_DEN_Brand_Kit_Vector_Master.zip',
      category: 'Projects / THE DEN',
      folderClassification: 'Project',
      confidence: 100,
      confidenceTier: 'High',
      reason: 'Organized project asset archive',
      ruleOrAi: 'Rule',
      status: 'verified',
      sizeBytes: 148000000,
      sizeFormatted: '148 MB',
      sha256: 'f81024bbce89102418bc0012489104efca891048120489901248102948190412',
      createdDate: '2026-07-01 11:20',
      modifiedDate: '2026-07-01 11:20',
      organization: 'THE DEN',
      tags: ['the-den', 'assets', 'design'],
      mimeType: 'application/zip',
      previewSnippet: 'Archive containing SVG, AI and PDF brand assets for THE DEN cultural hub.'
    },
    duplicates: [
      {
        id: 'dup-item-2',
        name: 'THE_DEN_Brand_Kit (1).zip',
        extension: 'zip',
        currentPath: '/Users/alex/Desktop/THE_DEN_Brand_Kit (1).zip',
        suggestedDestination: 'OS Trash',
        proposedFilename: 'THE_DEN_Brand_Kit (1).zip',
        category: 'Desktop / Unorganized',
        folderClassification: 'System',
        confidence: 99,
        confidenceTier: 'High',
        reason: 'Byte-for-byte replica of master project assets',
        ruleOrAi: 'Rule',
        status: 'suggested',
        sizeBytes: 148000000,
        sizeFormatted: '148 MB',
        sha256: 'f81024bbce89102418bc0012489104efca891048120489901248102948190412',
        createdDate: '2026-07-15 08:33',
        modifiedDate: '2026-07-15 08:33',
        tags: ['duplicate', 'desktop'],
        mimeType: 'application/zip',
        previewSnippet: 'Archive containing SVG, AI and PDF brand assets for THE DEN cultural hub.'
      }
    ]
  },
  {
    id: 'dup-3',
    sha256: '7394ba001ecde912fa8409115bcaa92019fe829031baed992410aefc882190bb',
    fileSizeBytes: 1800000,
    fileSizeFormatted: '1.8 MB',
    totalCopies: 2,
    potentialSavings: '1.8 MB',
    isExact: true,
    matchType: 'Exact SHA-256',
    canonicalFile: {
      id: 'canon-3',
      name: 'CosFair_Arbeitsvertrag_Gegenzeichnung.pdf',
      extension: 'pdf',
      currentPath: '/Users/alex/Documents/02_Areas/02_Professional/Employment/CosFair_GmbH/Contracts/CosFair_Arbeitsvertrag_Gegenzeichnung.pdf',
      suggestedDestination: '/Users/alex/Documents/02_Areas/02_Professional/Employment/CosFair_GmbH/Contracts/CosFair_Arbeitsvertrag_Gegenzeichnung.pdf',
      proposedFilename: 'CosFair_Arbeitsvertrag_Gegenzeichnung.pdf',
      category: 'Professional / Employment',
      folderClassification: 'Area',
      confidence: 100,
      confidenceTier: 'High',
      reason: 'Stored in Employment folder archive',
      ruleOrAi: 'Rule',
      status: 'verified',
      sizeBytes: 1800000,
      sizeFormatted: '1.8 MB',
      sha256: '7394ba001ecde912fa8409115bcaa92019fe829031baed992410aefc882190bb',
      createdDate: '2026-01-15 16:10',
      modifiedDate: '2026-01-15 16:10',
      organization: 'CosFair GmbH',
      tags: ['employment', 'contracts', 'cosfair'],
      mimeType: 'application/pdf',
      previewSnippet: 'Anstellungsvertrag zwischen CosFair GmbH und Alex Weber...'
    },
    duplicates: [
      {
        id: 'dup-item-3',
        name: 'CosFair_Vertrag_signed_scan.pdf',
        extension: 'pdf',
        currentPath: '/Users/alex/Desktop/CosFair_Vertrag_signed_scan.pdf',
        suggestedDestination: 'OS Trash',
        proposedFilename: 'CosFair_Vertrag_signed_scan.pdf',
        category: 'Desktop / Unorganized',
        folderClassification: 'System',
        confidence: 99,
        confidenceTier: 'High',
        reason: 'Exact SHA-256 hash match',
        ruleOrAi: 'Rule',
        status: 'suggested',
        sizeBytes: 1800000,
        sizeFormatted: '1.8 MB',
        sha256: '7394ba001ecde912fa8409115bcaa92019fe829031baed992410aefc882190bb',
        createdDate: '2026-01-20 14:02',
        modifiedDate: '2026-01-20 14:02',
        tags: ['duplicate', 'desktop'],
        mimeType: 'application/pdf',
        previewSnippet: 'Anstellungsvertrag zwischen CosFair GmbH und Alex Weber...'
      }
    ]
  }
];

export const INITIAL_RULES: RuleItem[] = [
  {
    id: 'rule-1',
    name: 'Jobcenter Documents',
    enabled: true,
    priority: 100,
    tier: 'BUILT-IN DEFAULT',
    safety: 'require approval',
    logic: 'OR',
    conditions: [
      { id: 'c1', field: 'document_text', operator: 'contains', value: 'Jobcenter' },
      { id: 'c2', field: 'document_text', operator: 'contains', value: 'Widerspruchsverfahren' },
      { id: 'c3', field: 'filename', operator: 'starts_with', value: 'JC_' }
    ],
    actions: [
      { 
        actionType: 'propose_destination', 
        targetPath: 'Documents / 02_Areas / 01_Personal / Government_Admin / Jobcenter',
        stableTaxonomyId: 'personal.government.jobcenter',
        renamePattern: '{date}_Jobcenter_{doc_type}_{description}.pdf',
        tagsToAdd: ['government', 'jobcenter', 'admin']
      }
    ],
    stableTaxonomyId: 'personal.government.jobcenter',
    targetDisplayPath: 'Personal / Government_Admin / Jobcenter',
    renamePattern: '{date}_Jobcenter_{doc_type}_{description}.pdf',
    tags: ['government', 'jobcenter', 'admin'],
    reviewBehavior: 'require approval',
    matchCount: 137,
    isDefault: true,
    description: 'Directs all administrative letters, Widersprüche, and notices from Jobcenter Düsseldorf to Government_Admin.'
  },
  {
    id: 'rule-2',
    name: 'THE DEN Documents',
    enabled: true,
    priority: 95,
    tier: 'BUILT-IN DEFAULT',
    safety: 'require approval',
    logic: 'OR',
    conditions: [
      { id: 'c4', field: 'filename', operator: 'contains', value: 'THE_DEN' },
      { id: 'c5', field: 'document_text', operator: 'contains', value: 'THE DEN' },
      { id: 'c6', field: 'organization', operator: 'equals', value: 'THE DEN' }
    ],
    actions: [
      { 
        actionType: 'propose_destination', 
        targetPath: 'Documents / 01_Projects / Business_Projects / THE_DEN',
        stableTaxonomyId: 'projects.business.the_den',
        renamePattern: '{date}_THE_DEN_{type}.pdf',
        tagsToAdd: ['project', 'the-den', 'business']
      }
    ],
    stableTaxonomyId: 'projects.business.the_den',
    targetDisplayPath: 'Projects / Business_Projects / THE_DEN',
    renamePattern: '{date}_THE_DEN_{type}.pdf',
    tags: ['project', 'the-den', 'business'],
    reviewBehavior: 'require approval',
    matchCount: 128,
    isDefault: true,
    description: 'Routes business plans, permit applications, and branding assets for THE DEN project.'
  },
  {
    id: 'rule-3',
    name: 'CosFair Employment',
    enabled: true,
    priority: 90,
    tier: 'BUILT-IN DEFAULT',
    safety: 'require approval',
    logic: 'AND',
    conditions: [
      { id: 'c7', field: 'document_text', operator: 'contains', value: 'CosFair' },
      { id: 'c8', field: 'extension', operator: 'equals', value: 'pdf' }
    ],
    actions: [
      { 
        actionType: 'propose_destination', 
        targetPath: 'Documents / 02_Areas / 02_Professional / Employment / CosFair_GmbH',
        stableTaxonomyId: 'professional.employment.cosfair',
        renamePattern: '{date}_CosFair_GmbH_{type}.pdf',
        tagsToAdd: ['professional', 'employment', 'cosfair']
      }
    ],
    stableTaxonomyId: 'professional.employment.cosfair',
    targetDisplayPath: 'Professional / Employment / CosFair_GmbH',
    renamePattern: '{date}_CosFair_GmbH_{type}.pdf',
    tags: ['professional', 'employment', 'cosfair'],
    reviewBehavior: 'require approval',
    matchCount: 36,
    isDefault: true,
    description: 'Files pay slips, employment agreements, and pension records from CosFair GmbH.'
  },
  {
    id: 'rule-4',
    name: 'Tax Relevant Documents 2025-2026',
    enabled: true,
    priority: 85,
    tier: 'YOUR RULE',
    safety: 'require approval',
    logic: 'OR',
    conditions: [
      { id: 'c9', field: 'document_text', operator: 'contains', value: 'Finanzamt' },
      { id: 'c10', field: 'document_text', operator: 'contains', value: 'Steuerbescheid' },
      { id: 'c11', field: 'filename', operator: 'contains', value: 'Steuer' }
    ],
    actions: [
      { 
        actionType: 'propose_destination', 
        targetPath: 'Documents / 02_Areas / 01_Personal / Finance_Tax',
        stableTaxonomyId: 'personal.finance.tax',
        renamePattern: '{date}_Finanzamt_Steuer_{type}.pdf',
        tagsToAdd: ['taxes', 'finance', 'official']
      }
    ],
    stableTaxonomyId: 'personal.finance.tax',
    targetDisplayPath: 'Personal / Finance_Tax',
    renamePattern: '{date}_Finanzamt_Steuer_{type}.pdf',
    tags: ['taxes', 'finance', 'official'],
    reviewBehavior: 'require approval',
    matchCount: 19,
    isDefault: false,
    description: 'Routes official revenue office mail and tax declaration certificates to Personal Finance.'
  },
  {
    id: 'rule-5',
    name: 'Address Herzogstraße 90 Tenancy',
    enabled: true,
    priority: 80,
    tier: 'YOUR RULE',
    safety: 'suggest only',
    logic: 'OR',
    conditions: [
      { id: 'c12', field: 'document_text', operator: 'contains', value: 'Herzogstraße 90' },
      { id: 'c13', field: 'filename', operator: 'contains', value: 'Herzogstrasse' }
    ],
    actions: [
      { 
        actionType: 'propose_destination', 
        targetPath: 'Documents / 02_Areas / 01_Personal / Housing_Herzogstrasse',
        stableTaxonomyId: 'personal.housing.herzogstrasse',
        renamePattern: '{date}_Herzogstrasse_{doc}.pdf'
      }
    ],
    stableTaxonomyId: 'personal.housing.herzogstrasse',
    targetDisplayPath: 'Personal / Housing_Herzogstrasse',
    renamePattern: '{date}_Herzogstrasse_{doc}.pdf',
    tags: ['housing', 'tenancy'],
    reviewBehavior: 'suggest only',
    matchCount: 14,
    isDefault: false,
    description: 'Organizes lease addendums, utility bills, and correspondence for Herzogstraße 90.'
  }
];

export const ORGANIZATIONS_DATA: OrganizationEntity[] = [
  // Businesses
  {
    id: 'org-1',
    name: 'Albatross Technologies Limited',
    category: 'businesses',
    aliases: ['Albatross', 'Albatross Tech', 'ATL'],
    matchedFilesCount: 48,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / Albatross_Technologies',
    confidenceScore: 98
  },
  {
    id: 'org-2',
    name: 'Aryana',
    category: 'businesses',
    aliases: ['Aryana Trading', 'Aryana Group'],
    matchedFilesCount: 15,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / Aryana',
    confidenceScore: 94
  },
  {
    id: 'org-3',
    name: 'NIHRD Limited',
    category: 'businesses',
    aliases: ['NIHRD', 'National Institute HRD'],
    matchedFilesCount: 22,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / NIHRD',
    confidenceScore: 95
  },
  {
    id: 'org-4',
    name: 'TechnoVen UG',
    category: 'businesses',
    aliases: ['TechnoVen', 'Techno Ven'],
    matchedFilesCount: 39,
    targetFolder: 'Documents / 01_Projects / Business_Projects / TechnoVen_Platform',
    confidenceScore: 99
  },
  {
    id: 'org-5',
    name: 'Cognisance UG',
    category: 'businesses',
    aliases: ['Cognisance', 'Cognisance Tech'],
    matchedFilesCount: 18,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / Cognisance',
    confidenceScore: 93
  },
  {
    id: 'org-6',
    name: 'Open People UG',
    category: 'businesses',
    aliases: ['Open People', 'OpenPeople'],
    matchedFilesCount: 12,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / Open_People',
    confidenceScore: 91
  },
  {
    id: 'org-7',
    name: 'Knowven',
    category: 'businesses',
    aliases: ['Knowven AI', 'Knowven Systems'],
    matchedFilesCount: 27,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / Knowven',
    confidenceScore: 96
  },
  {
    id: 'org-8',
    name: 'TechnoCraftz',
    category: 'businesses',
    aliases: ['TechnoCraftz UG', 'Techno Craftz'],
    matchedFilesCount: 34,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / TechnoCraftz',
    confidenceScore: 97
  },
  {
    id: 'org-9',
    name: 'dot Creative UG',
    category: 'businesses',
    aliases: ['dot Creative', 'dotCreative', 'dotcreative'],
    matchedFilesCount: 16,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Businesses / dot_Creative',
    confidenceScore: 92
  },

  // Employment
  {
    id: 'org-10',
    name: 'Amazon',
    category: 'employment',
    aliases: ['Amazon EU SARL', 'Amazon Web Services', 'AWS'],
    matchedFilesCount: 45,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Employment / Amazon',
    confidenceScore: 99
  },
  {
    id: 'org-11',
    name: 'Medicov GmbH',
    category: 'employment',
    aliases: ['Medicov', 'Medicov Health'],
    matchedFilesCount: 29,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Employment / Medicov_GmbH',
    confidenceScore: 96
  },
  {
    id: 'org-12',
    name: 'CosFair GmbH',
    category: 'employment',
    aliases: ['CosFair', 'Cos Fair', 'CosFair Trade'],
    matchedFilesCount: 52,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Employment / CosFair_GmbH',
    confidenceScore: 99
  },
  {
    id: 'org-13',
    name: 'PSZ',
    category: 'employment',
    aliases: ['Psychosoziales Zentrum', 'PSZ Düsseldorf'],
    matchedFilesCount: 11,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Employment / PSZ',
    confidenceScore: 90
  },
  {
    id: 'org-14',
    name: 'Can & Eren Taxi',
    category: 'employment',
    aliases: ['Can Eren Taxi', 'Taxi Can & Eren'],
    matchedFilesCount: 8,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Employment / Taxi_Services',
    confidenceScore: 88
  },
  {
    id: 'org-15',
    name: 'Rhein Taxi',
    category: 'employment',
    aliases: ['Rhein-Taxi Datenfunkzentrale', 'RheinTaxi Düsseldorf'],
    matchedFilesCount: 14,
    targetFolder: 'Documents / 02_Areas / 02_Professional / Employment / Taxi_Services',
    confidenceScore: 92
  },

  // Government
  {
    id: 'org-16',
    name: 'Jobcenter Düsseldorf',
    category: 'government',
    aliases: ['JC', 'Job Center', 'Jobcenter', 'JC Düsseldorf'],
    matchedFilesCount: 78,
    targetFolder: 'Documents / 02_Areas / 01_Personal / Government_Admin / Jobcenter',
    confidenceScore: 100
  },
  {
    id: 'org-17',
    name: 'Arbeitsagentur',
    category: 'government',
    aliases: ['Agentur für Arbeit', 'BA Düsseldorf', 'Bundesagentur'],
    matchedFilesCount: 23,
    targetFolder: 'Documents / 02_Areas / 01_Personal / Government_Admin / Arbeitsagentur',
    confidenceScore: 97
  },
  {
    id: 'org-18',
    name: 'Sozialgericht',
    category: 'government',
    aliases: ['SG Düsseldorf', 'Sozialgericht Düsseldorf'],
    matchedFilesCount: 17,
    targetFolder: 'Documents / 02_Areas / 01_Personal / Government_Admin / Justiz',
    confidenceScore: 95
  },
  {
    id: 'org-19',
    name: 'Finanzamt',
    category: 'government',
    aliases: ['Finanzamt Düsseldorf', 'Finanzamt Mitte', 'Finanzamt Nord'],
    matchedFilesCount: 41,
    targetFolder: 'Documents / 02_Areas / 01_Personal / Finance_Tax',
    confidenceScore: 98
  },
  {
    id: 'org-20',
    name: 'Familienkasse',
    category: 'government',
    aliases: ['Familienkasse NRW', 'Kindergeldstelle'],
    matchedFilesCount: 9,
    targetFolder: 'Documents / 02_Areas / 01_Personal / Government_Admin / Familienkasse',
    confidenceScore: 93
  },
  {
    id: 'org-21',
    name: 'Stadt Düsseldorf',
    category: 'government',
    aliases: ['Landeshauptstadt Düsseldorf', 'Bürgerbüro', 'Einwohnermeldeamt'],
    matchedFilesCount: 31,
    targetFolder: 'Documents / 02_Areas / 01_Personal / Government_Admin / Stadt_Duesseldorf',
    confidenceScore: 96
  },

  // Social / Community
  {
    id: 'org-22',
    name: 'Quer Denken e.V.',
    category: 'social',
    aliases: ['QuerDenken', 'Quer Denken Verein'],
    matchedFilesCount: 7,
    targetFolder: 'Documents / 02_Areas / 05_Social_Community / Quer_Denken',
    confidenceScore: 89
  },
  {
    id: 'org-23',
    name: 'BUNDjugend',
    category: 'social',
    aliases: ['BUND Jugend', 'Bund für Umwelt und Naturschutz'],
    matchedFilesCount: 13,
    targetFolder: 'Documents / 02_Areas / 05_Social_Community / BUNDjugend',
    confidenceScore: 92
  },
  {
    id: 'org-24',
    name: 'DA',
    category: 'social',
    aliases: ['Demokratie Aktiv', 'DA Düsseldorf'],
    matchedFilesCount: 5,
    targetFolder: 'Documents / 02_Areas / 05_Social_Community / DA',
    confidenceScore: 86
  },
  {
    id: 'org-25',
    name: 'Digitalcourage',
    category: 'social',
    aliases: ['Digitalcourage e.V.', 'FoeBuD'],
    matchedFilesCount: 19,
    targetFolder: 'Documents / 02_Areas / 05_Social_Community / Digitalcourage',
    confidenceScore: 95
  },
  {
    id: 'org-26',
    name: 'German Bangla Society',
    category: 'social',
    aliases: ['GBS', 'German-Bangla', 'Deutsch-Bengalische Gesellschaft'],
    matchedFilesCount: 26,
    targetFolder: 'Documents / 02_Areas / 05_Social_Community / German_Bangla_Society',
    confidenceScore: 96
  },
  {
    id: 'org-27',
    name: 'GBPA',
    category: 'social',
    aliases: ['German Bangla Professional Association', 'GBPA e.V.'],
    matchedFilesCount: 14,
    targetFolder: 'Documents / 02_Areas / 05_Social_Community / GBPA',
    confidenceScore: 94
  }
];

export const HISTORY_TRANSACTIONS: HistoryTransaction[] = [
  {
    transactionId: 'tx-20260910-064612-001',
    originalPath: '~/Downloads/Finanzamt_Steuererklaerung_2024.pdf',
    destinationPath: 'Documents/02_Areas/01_Personal/Finance_Tax/Finanzamt_Steuererklaerung_2024.pdf',
    originalHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    resultingHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '2026-09-10 06:46:12',
    operation: 'Move',
    verificationResult: 'Hash Verified',

    id: 'tx-1',
    action: 'Moved',
    file: 'Finanzamt_Steuererklaerung_2024.pdf',
    newPath: 'Documents/02_Areas/01_Personal/Finance_Tax/Finanzamt_Steuererklaerung_2024.pdf',
    rule: 'Tax Relevant Documents 2025-2026',
    status: 'Completed',
    rollbackAvailable: true,
    batchId: 'batch-20260910-0646',
    sha256Verified: true
  },
  {
    transactionId: 'tx-20260910-064613-002',
    originalPath: 'Documents/01_Projects/Business_Projects/THE_DEN/Floorplan_NEW.pdf',
    destinationPath: 'Documents/01_Projects/Business_Projects/THE_DEN/THE_DEN_Floorplan_FINAL_v3.pdf',
    originalHash: 'a8b2c41890ef41bca9104bce90124801cae1823901bca1904128912eab1209ca',
    resultingHash: 'a8b2c41890ef41bca9104bce90124801cae1823901bca1904128912eab1209ca',
    timestamp: '2026-09-10 06:46:13',
    operation: 'Rename',
    verificationResult: 'Hash Verified',

    id: 'tx-2',
    action: 'Renamed',
    file: 'THE_DEN_Floorplan_FINAL_v3.pdf',
    newPath: 'Documents/01_Projects/Business_Projects/THE_DEN/THE_DEN_Floorplan_FINAL_v3.pdf',
    rule: 'THE DEN Documents',
    status: 'Completed',
    rollbackAvailable: true,
    batchId: 'batch-20260910-0646',
    sha256Verified: true
  },
  {
    transactionId: 'tx-20260910-064615-003',
    originalPath: '~/Desktop/Jobcenter_Bescheid_Duplicate_copy.pdf',
    destinationPath: '~/.Trash/Jobcenter_Bescheid_Duplicate_copy.pdf',
    originalHash: 'b4a1c90234de1829031cae901428901cae1823901bca1904128912eab1209cb',
    resultingHash: 'b4a1c90234de1829031cae901428901cae1823901bca1904128912eab1209cb',
    timestamp: '2026-09-10 06:46:15',
    operation: 'Move to Trash',
    verificationResult: 'Hash Verified',

    id: 'tx-3',
    action: 'Moved to Trash',
    file: 'Jobcenter_Bescheid_Duplicate_copy.pdf',
    newPath: '~/.Trash/Jobcenter_Bescheid_Duplicate_copy.pdf',
    rule: 'Duplicate Cleanup (Exact Match)',
    status: 'Completed',
    rollbackAvailable: true,
    batchId: 'batch-20260910-0646',
    sha256Verified: true
  },
  {
    transactionId: 'tx-20260908-172104-004',
    originalPath: '~/Downloads/Amazon_Certificate_AWS_Solutions_Architect.pdf',
    destinationPath: 'Documents/02_Areas/02_Professional/Employment/Amazon/Certifications/AWS_Solutions_Architect.pdf',
    originalHash: 'f1e2d3c4b5a6978876543210fedcba9876543210abcdef0123456789abcdef01',
    resultingHash: 'f1e2d3c4b5a6978876543210fedcba9876543210abcdef0123456789abcdef01',
    timestamp: '2026-09-08 17:21:04',
    operation: 'Move',
    verificationResult: 'Hash Verified',

    id: 'tx-4',
    action: 'Moved',
    file: 'Amazon_Certificate_AWS_Solutions_Architect.pdf',
    newPath: 'Documents/02_Areas/02_Professional/Employment/Amazon/Certifications/AWS_Solutions_Architect.pdf',
    rule: 'Professional Certifications',
    status: 'Completed',
    rollbackAvailable: true,
    batchId: 'batch-20260908-1720',
    sha256Verified: true
  },
  {
    transactionId: 'tx-20260908-172105-005',
    originalPath: '~/.Trash/Draft_Proposal_TechnoVen.docx',
    destinationPath: 'Documents/01_Projects/Business_Projects/TechnoVen_Platform/Draft_Proposal_TechnoVen.docx',
    originalHash: 'c901823901bca1904128912eab1209cab4a1c90234de1829031cae901428901a',
    resultingHash: 'c901823901bca1904128912eab1209cab4a1c90234de1829031cae901428901a',
    timestamp: '2026-09-08 17:21:05',
    operation: 'Restore',
    verificationResult: 'Hash Verified',

    id: 'tx-5',
    action: 'Restored',
    file: 'Draft_Proposal_TechnoVen.docx',
    newPath: 'Documents/01_Projects/Business_Projects/TechnoVen_Platform/Draft_Proposal_TechnoVen.docx',
    rule: 'User Rollback Action',
    status: 'Rolled Back',
    rollbackAvailable: false,
    batchId: 'batch-20260908-1720',
    sha256Verified: true
  }
];

export const ROLLBACK_BATCHES: RollbackBatch[] = [
  {
    id: 'batch-20260910-2014',
    title: 'Organization run · Sep 10, 2026 · 20:14',
    timestamp: 'Sep 10, 2026 · 20:14',
    filesChanged: 23,
    renamed: 8,
    moved: 15,
    deletedPermanently: 0,
    rollbackAvailable: true,
    items: [
      {
        id: 'tb-1',
        timestamp: '20:14:02',
        action: 'Moved',
        file: 'JC_Widerspruch_Schriftsatz.pdf',
        originalPath: '~/Downloads/JC_Widerspruch_Schriftsatz.pdf',
        newPath: 'Documents/02_Areas/01_Personal/Government_Admin/Jobcenter/JC_Widerspruch_Schriftsatz.pdf',
        rule: 'Jobcenter Documents',
        status: 'Completed',
        rollbackAvailable: true,
        batchId: 'batch-20260910-2014',
        sha256Verified: true
      },
      {
        id: 'tb-2',
        timestamp: '20:14:03',
        action: 'Renamed',
        file: 'THE_DEN_Finanzplan_2026_Q4.xlsx',
        originalPath: 'Documents/01_Projects/Business_Projects/THE_DEN/calc_the_den.xlsx',
        newPath: 'Documents/01_Projects/Business_Projects/THE_DEN/THE_DEN_Finanzplan_2026_Q4.xlsx',
        rule: 'THE DEN Documents',
        status: 'Completed',
        rollbackAvailable: true,
        batchId: 'batch-20260910-2014',
        sha256Verified: true
      },
      {
        id: 'tb-3',
        timestamp: '20:14:04',
        action: 'Moved',
        file: 'CosFair_Lohnnachweis_Jan2026.pdf',
        originalPath: '~/Downloads/CosFair_Lohnnachweis_Jan2026.pdf',
        newPath: 'Documents/02_Areas/02_Professional/Employment/CosFair_GmbH/Payroll/CosFair_Lohnnachweis_Jan2026.pdf',
        rule: 'CosFair Employment',
        status: 'Completed',
        rollbackAvailable: true,
        batchId: 'batch-20260910-2014',
        sha256Verified: true
      }
    ]
  },
  {
    id: 'batch-20260908-1720',
    title: 'Automated Cleanup run · Sep 8, 2026 · 17:20',
    timestamp: 'Sep 8, 2026 · 17:20',
    filesChanged: 12,
    renamed: 3,
    moved: 9,
    deletedPermanently: 0,
    rollbackAvailable: true,
    items: []
  }
];

export const ACTIVITY_7_DAYS = [
  { day: 'Fri (Sep 4)', date: '2026-09-04', count: 18, bytesFormatted: '42 MB' },
  { day: 'Sat (Sep 5)', date: '2026-09-05', count: 6, bytesFormatted: '12 MB' },
  { day: 'Sun (Sep 6)', date: '2026-09-06', count: 9, bytesFormatted: '28 MB' },
  { day: 'Mon (Sep 7)', date: '2026-09-07', count: 34, bytesFormatted: '180 MB' },
  { day: 'Tue (Sep 8)', date: '2026-09-08', count: 52, bytesFormatted: '310 MB' },
  { day: 'Wed (Sep 9)', date: '2026-09-09', count: 27, bytesFormatted: '94 MB' },
  { day: 'Thu (Today)', date: '2026-09-10', count: 42, bytesFormatted: '215 MB' },
];
