import React from "react";
import { Text } from "ink";
import {
  AssetsList, AssetGet, AssetSearch, AssetDelete,
  AssetBlock, AssetUnblock, AssetRename, AssetMove,
  AssetDuplicate, AssetUpdate, AssetGetByPath, AssetReplace, AssetRedownload,
  AssetListAll, AssetGetMany, AssetTotalSize, AssetUrl,
} from "./commands/assets.js";
import {
  FolderList, FolderGet, FolderCreate, FolderDelete,
  FolderRename, FolderMove, FolderUpdate, FolderFtp, FolderUploadShare,
} from "./commands/folders.js";
import {
  GalleryList, GalleryGet, GalleryItems, GalleryCreate,
  GalleryDelete, GalleryUpdate, GalleryShare,
} from "./commands/galleries.js";
import { CopyrightList, CopyrightGet, CopyrightCreate, CopyrightUpdate, CopyrightDelete } from "./commands/copyrights.js";
import { LicenseList, LicenseGet, LicenseCreate, LicenseUpdate, LicenseDelete } from "./commands/licenses.js";
import { Upload } from "./commands/upload.js";
import { HealthCheck } from "./commands/health.js";
import { TenantInfo, TenantCreate, TenantUpdate, TenantDomains } from "./commands/tenant.js";
import { HelpCommand } from "./commands/help.js";
import { DiskList, DiskGet, DiskStatus, DiskCreate, DiskUpdate, DiskDelete } from "./commands/disks.js";
import { DmcaList, DmcaGet, DmcaCreate, DmcaUpdate } from "./commands/dmca.js";
import { RoleList, RoleGet, RoleCreate, RoleUpdate, RoleDelete } from "./commands/roles.js";
import { UserList, UserGet, UserInvite, UserDelete } from "./commands/users.js";
import { WorkflowList, WorkflowGet, WorkflowCreate, WorkflowUpdate, WorkflowDelete } from "./commands/workflows.js";
import { CredentialList, CredentialCreate, CredentialRevoke, CredentialDelete } from "./commands/credentials.js";
import { PdfSignatureCreate, PdfSignatureStart, PdfSignatureCancel, FileAccessSign } from "./commands/signatures.js";

interface AppProps {
  resource: string;
  action: string;
  positional: string[];
  flags: Record<string, string | boolean>;
  tenantId?: string;
}

export function App({ resource, action, positional, flags, tenantId }: AppProps) {
  if (flags.help) return <HelpCommand />;

  switch (resource) {
    case "assets":
      return renderAssets(action, positional, flags);
    case "folders":
      return renderFolders(action, positional, flags);
    case "galleries":
      return renderGalleries(action, positional, flags, tenantId);
    case "copyrights":
      return renderCopyrights(action, positional, flags);
    case "licenses":
      return renderLicenses(action, positional, flags);
    case "upload":
      return <Upload filePath={action} flags={flags} />;
    case "health":
      return <HealthCheck />;
    case "tenant":
      return renderTenant(action, positional, flags);
    case "disks":
      return renderDisks(action, positional, flags);
    case "dmca":
      return renderDmca(action, positional, flags);
    case "roles":
      return renderRoles(action, positional, flags);
    case "users":
      return renderUsers(action, positional, flags);
    case "workflows":
      return renderWorkflows(action, positional, flags);
    case "credentials":
      return renderCredentials(action, positional, flags);
    case "signatures":
      return renderSignatures(action, positional, flags);
    default:
      return <Text color="red">Unknown resource: {resource}. Run &quot;fairu --help&quot; for usage.</Text>;
  }
}

function renderAssets(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <AssetsList flags={flags} />;
    case "get": return <AssetGet id={positional[0]!} />;
    case "search": return <AssetSearch query={positional[0]!} flags={flags} />;
    case "delete": return <AssetDelete id={positional[0]!} />;
    case "block": return <AssetBlock id={positional[0]!} />;
    case "unblock": return <AssetUnblock id={positional[0]!} />;
    case "rename": return <AssetRename id={positional[0]!} name={flags.name as string} />;
    case "move": return <AssetMove id={positional[0]!} targetFolder={flags.to as string | undefined} />;
    case "duplicate": return <AssetDuplicate id={positional[0]!} targetFolder={flags.to as string | undefined} />;
    case "update": return <AssetUpdate id={positional[0]!} flags={flags} />;
    case "get-by-path": return <AssetGetByPath path={positional[0]!} />;
    case "replace": return <AssetReplace id={positional[0]!} />;
    case "redownload": return <AssetRedownload id={positional[0]!} />;
    case "list-all": return <AssetListAll flags={flags} />;
    case "get-many": return <AssetGetMany flags={flags} />;
    case "total-size": return <AssetTotalSize flags={flags} />;
    case "url": return <AssetUrl path={positional[0]!} flags={flags} />;
    default: return <Text color="red">Unknown action: assets {action}.</Text>;
  }
}

function renderFolders(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <FolderList flags={flags} />;
    case "get": return <FolderGet path={positional[0]!} />;
    case "create": return <FolderCreate flags={flags} />;
    case "delete": return <FolderDelete id={positional[0]!} />;
    case "rename": return <FolderRename id={positional[0]!} name={flags.name as string} />;
    case "move": return <FolderMove id={positional[0]!} targetParent={flags.to as string | undefined} />;
    case "update": return <FolderUpdate id={positional[0]!} flags={flags} />;
    case "ftp": return <FolderFtp id={positional[0]!} />;
    case "upload-share": return <FolderUploadShare id={positional[0]!} flags={flags} />;
    default: return <Text color="red">Unknown action: folders {action}.</Text>;
  }
}

function renderGalleries(action: string, positional: string[], flags: Record<string, string | boolean>, tenantId?: string) {
  switch (action) {
    case "list": return <GalleryList flags={flags} tenantId={tenantId} />;
    case "get": return <GalleryGet id={positional[0]!} />;
    case "items": return <GalleryItems id={positional[0]!} flags={flags} />;
    case "create": return <GalleryCreate flags={flags} />;
    case "delete": return <GalleryDelete id={positional[0]!} />;
    case "update": return <GalleryUpdate id={positional[0]!} flags={flags} />;
    case "share": return <GalleryShare id={positional[0]!} />;
    default: return <Text color="red">Unknown action: galleries {action}.</Text>;
  }
}

function renderCopyrights(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <CopyrightList flags={flags} />;
    case "get": return <CopyrightGet id={positional[0]!} />;
    case "create": return <CopyrightCreate flags={flags} />;
    case "update": return <CopyrightUpdate id={positional[0]!} flags={flags} />;
    case "delete": return <CopyrightDelete id={positional[0]!} flags={flags} />;
    default: return <Text color="red">Unknown action: copyrights {action}.</Text>;
  }
}

function renderLicenses(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <LicenseList flags={flags} />;
    case "get": return <LicenseGet id={positional[0]!} />;
    case "create": return <LicenseCreate flags={flags} />;
    case "update": return <LicenseUpdate id={positional[0]!} flags={flags} />;
    case "delete": return <LicenseDelete id={positional[0]!} flags={flags} />;
    default: return <Text color="red">Unknown action: licenses {action}.</Text>;
  }
}

function renderTenant(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "info": case "": case undefined: return <TenantInfo />;
    case "create": return <TenantCreate flags={flags} />;
    case "update": return <TenantUpdate flags={flags} />;
    case "domains": return <TenantDomains />;
    default: return <Text color="red">Unknown action: tenant {action}.</Text>;
  }
}

function renderDisks(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <DiskList flags={flags} />;
    case "get": return <DiskGet id={positional[0]!} />;
    case "status": return <DiskStatus id={positional[0]!} />;
    case "create": return <DiskCreate flags={flags} />;
    case "update": return <DiskUpdate id={positional[0]!} flags={flags} />;
    case "delete": return <DiskDelete id={positional[0]!} />;
    default: return <Text color="red">Unknown action: disks {action}.</Text>;
  }
}

function renderDmca(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <DmcaList flags={flags} />;
    case "get": return <DmcaGet id={positional[0]!} />;
    case "create": return <DmcaCreate flags={flags} />;
    case "update": return <DmcaUpdate id={positional[0]!} flags={flags} />;
    default: return <Text color="red">Unknown action: dmca {action}.</Text>;
  }
}

function renderRoles(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <RoleList flags={flags} />;
    case "get": return <RoleGet id={positional[0]!} />;
    case "create": return <RoleCreate flags={flags} />;
    case "update": return <RoleUpdate id={positional[0]!} flags={flags} />;
    case "delete": return <RoleDelete id={positional[0]!} />;
    default: return <Text color="red">Unknown action: roles {action}.</Text>;
  }
}

function renderUsers(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <UserList flags={flags} />;
    case "get": return <UserGet id={positional[0]!} />;
    case "invite": return <UserInvite flags={flags} />;
    case "delete": return <UserDelete id={positional[0]!} />;
    default: return <Text color="red">Unknown action: users {action}.</Text>;
  }
}

function renderWorkflows(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <WorkflowList flags={flags} />;
    case "get": return <WorkflowGet id={positional[0]!} />;
    case "create": return <WorkflowCreate flags={flags} />;
    case "update": return <WorkflowUpdate id={positional[0]!} flags={flags} />;
    case "delete": return <WorkflowDelete id={positional[0]!} />;
    default: return <Text color="red">Unknown action: workflows {action}.</Text>;
  }
}

function renderCredentials(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "list": return <CredentialList flags={flags} />;
    case "create": return <CredentialCreate flags={flags} />;
    case "revoke": return <CredentialRevoke id={positional[0]!} />;
    case "delete": return <CredentialDelete id={positional[0]!} />;
    default: return <Text color="red">Unknown action: credentials {action}.</Text>;
  }
}

function renderSignatures(action: string, positional: string[], flags: Record<string, string | boolean>) {
  switch (action) {
    case "pdf-create": return <PdfSignatureCreate flags={flags} />;
    case "pdf-start": return <PdfSignatureStart id={positional[0]!} />;
    case "pdf-cancel": return <PdfSignatureCancel id={positional[0]!} />;
    case "file-access": return <FileAccessSign flags={flags} />;
    default: return <Text color="red">Unknown action: signatures {action}.</Text>;
  }
}
