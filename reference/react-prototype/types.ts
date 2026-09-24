export type ActionStatus = 'suggested' | 'approved' | 'moving' | 'verified' | 'failed' | 'rolled_back';

export type ConfidenceTier = 'High' | 'Medium' | 'Low';

export type EntityCategory = 'businesses' | 'employment' | 'government' | 'social' | 'people';

export type RuleTier = 'BUILT-IN DEFAULT' | 'YOUR RULE' | 'TEMPORARY RULE';

export type RuleSafety = 'suggest only' | 'require approval' | 'trusted automatic rule';

export interface FileItem {
  id: string;
  name: string;
  extension: string;
  currentPath: string;
  suggestedDestination: string;
  proposedFilename: string;
  category: string;
  folderClassification: 'Project' | 'Area' | 'Resource' | 'Archive' | 'System';
  confidence: number;
  confidenceTier: ConfidenceTier;
  reason: string;
  ruleOrAi: 'Rule' | 'AI' | 'Rule + AI';
  classificationSource?: string; // e.g. 'Rule #104' | 'Local AI' | 'Metadata classifier'
  stableTaxonomyId?: string; // e.g. 'professional.employment.cosfair'
  status: ActionStatus;
  sizeBytes: number;
  sizeFormatted: string;
  sha256: string;
  createdDate: string;
  modifiedDate: string;
  detectedDocDate?: string;
  organization?: string;
  tags: string[];
  isDuplicate?: boolean;
  duplicateCount?: number;
  previewSnippet?: string;
  mimeType: string;
}

export interface DuplicateGroup {
  id: string;
  canonicalFile: FileItem;
  duplicates: FileItem[];
  sha256: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  totalCopies: number;
  potentialSavings: string;
  isExact: boolean;
  matchType: 'Exact SHA-256' | 'Fuzzy Name & Size' | 'Version Conflict';
}

export interface DuplicatePreflightCheck {
  id: string;
  fileId: string;
  fileName: string;
  canonicalExists: boolean;
  canonicalHashMatches: boolean;
  duplicateExists: boolean;
  duplicateHashMatchesCanonical: boolean;
  canonicalNotSelectedForDeletion: boolean;
  passed: boolean;
  message: string;
}

export interface RuleCondition {
  id: string;
  field: 'filename' | 'extension' | 'current_path' | 'document_text' | 'organization' | 'metadata' | 'file_size' | 'date';
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex' | 'matches_any' | 'matches_all';
  value: string;
}

export interface RuleAction {
  actionType: 'propose_destination' | 'move_after_approval' | 'rename' | 'add_tags' | 'ignore' | 'send_to_review';
  targetPath?: string;
  stableTaxonomyId?: string;
  renamePattern?: string;
  tagsToAdd?: string[];
}

export interface RuleItem {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  tier: RuleTier;
  safety: RuleSafety;
  logic: 'AND' | 'OR';
  conditions: RuleCondition[];
  actions: RuleAction[];
  stableTaxonomyId: string;
  targetDisplayPath: string;
  renamePattern?: string;
  tags?: string[];
  reviewBehavior?: RuleSafety;
  matchCount: number;
  isDefault: boolean;
  description?: string;
}

export interface OrganizationEntity {
  id: string;
  name: string;
  category: EntityCategory;
  aliases: string[];
  matchedFilesCount: number;
  targetFolder: string;
  stableTaxonomyId?: string;
  notes?: string;
  confidenceScore: number;
}

export interface HistoryTransaction {
  // Core 8 journal fields for filesystem safety
  transactionId?: string;
  originalPath: string;
  destinationPath?: string;
  originalHash?: string;
  resultingHash?: string;
  timestamp: string;
  operation?: 'Move' | 'Rename' | 'Move to Trash' | 'Restore';
  verificationResult?: 'Hash Verified' | 'Mismatch Detected' | 'Simulated (Dry Run)';

  // Compatibility fields
  id: string;
  action: 'Moved' | 'Renamed' | 'Moved to Trash' | 'Restored' | 'Ignored' | 'Rule applied';
  file: string;
  newPath: string;
  rule: string;
  status: 'Completed' | 'Pending Approval' | 'Rolled Back' | 'Failed';
  rollbackAvailable: boolean;
  batchId: string;
  sha256Verified: boolean;
}

export interface RollbackBatch {
  id: string;
  title: string;
  timestamp: string;
  filesChanged: number;
  renamed: number;
  moved: number;
  deletedPermanently: number;
  rollbackAvailable: boolean;
  items: HistoryTransaction[];
}

export interface ScanReport {
  timestamp: string;
  durationSeconds: number;
  filesScanned: number;
  newFiles: number;
  duplicatesDetected: number;
  aiClassifications: number;
  errors: number;
  scannedRoots: string[];
}

export interface SafetySettings {
  dryRunMode: boolean;
  autoFileMoves: boolean;
  permanentDeletion: boolean;
  rollbackProtection: boolean;
  localAiEnabled: boolean;
  sendDuplicatesToTrash: boolean;
  verifyHashAfterMove: boolean;
  requireApprovalBeforeMoves: boolean;
  logOperationsToSqlite: boolean;
}

export interface FolderNode {
  name: string;
  path: string;
  type: 'project' | 'area' | 'resource' | 'archive' | 'system' | 'folder';
  children?: FolderNode[];
}

export interface TaxonomyNode {
  id: string; // Stable internal identifier, e.g. 'professional.employment.cosfair'
  name: string;
  path: string; // Mapped filesystem path: ~/Documents/...
  type: 'root' | 'project' | 'area' | 'resource' | 'archive' | 'inbox';
  filesCount: number;
  sizeFormatted: string;
  duplicatesCount: number;
  unclassifiedCount: number;
  recentChangesCount: number;
  targetedByRuleIds: string[];
  associatedOrgNames: string[];
  children?: TaxonomyNode[];
}
