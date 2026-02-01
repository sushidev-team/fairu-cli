// ─── Shared GraphQL fragments ─────────────────────────────

const PAGINATOR_FIELDS = `
  count
  currentPage
  lastPage
  perPage
  total
  hasMorePages
`;

// ─── Asset Queries ────────────────────────────────────────

export const SEARCH_ASSETS = `
  query SearchAssets($search: String!, $page: Int, $perPage: Int) {
    fairuSearch(search: $search, page: $page, first: $perPage) {
      data { id name mimeType size createdAt }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

// ─── Asset Mutations ──────────────────────────────────────

export const BLOCK_ASSET = `
  mutation BlockAsset($id: ID!) {
    blockFairuFile(id: $id)
  }
`;

export const UNBLOCK_ASSET = `
  mutation UnblockAsset($id: ID!) {
    unblockFairuFile(id: $id)
  }
`;

export const RENAME_ASSET = `
  mutation RenameAsset($id: ID!, $name: String!) {
    renameFairuFile(id: $id, name: $name) { id name }
  }
`;

export const MOVE_ASSET = `
  mutation MoveAsset($id: ID!, $parent: ID) {
    moveFairuFile(id: $id, parent: $parent)
  }
`;

export const DUPLICATE_ASSET = `
  mutation DuplicateAsset($id: ID!, $parent: ID) {
    duplicateFairuFile(id: $id, parent: $parent)
  }
`;

// ─── Folder Queries ───────────────────────────────────────

export const FOLDER_CONTENTS = `
  query FolderContents($folder: ID, $search: String, $page: Int, $perPage: Int) {
    fairuFolder(folder: $folder, search: $search, page: $page, first: $perPage) {
      data {
        ... on FairuFolder { id name createdAt __typename }
        ... on FairuAsset { id name mimeType size createdAt __typename }
      }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const FOLDER_BY_PATH = `
  query FolderByPath($path: String!) {
    fairuFolderByPath(path: $path) { id name createdAt updatedAt }
  }
`;

// ─── Folder Mutations ─────────────────────────────────────

export const CREATE_FOLDER = `
  mutation CreateFolder($data: FairuFolderDto!) {
    createFairuFolder(data: $data) { id name }
  }
`;

export const UPDATE_FOLDER = `
  mutation UpdateFolder($data: FairuFolderDto!) {
    updateFairuFolder(data: $data) { id name }
  }
`;

export const DELETE_FOLDER = `
  mutation DeleteFolder($id: ID!) {
    deleteFairuFolder(id: $id)
  }
`;

export const RENAME_FOLDER = `
  mutation RenameFolder($id: ID!, $name: String!) {
    renameFairuFolder(id: $id, name: $name) { id name }
  }
`;

export const MOVE_FOLDER = `
  mutation MoveFolder($id: ID!, $parent: ID) {
    moveFairuFolder(id: $id, parent: $parent)
  }
`;

// ─── Gallery Queries ──────────────────────────────────────

export const LIST_GALLERIES = `
  query ListGalleries($tenants: [String!]!, $page: Int, $perPage: Int, $search: String) {
    fairuGalleries(tenants: $tenants, page: $page, first: $perPage, search: $search) {
      data { id name createdAt updatedAt }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_GALLERY = `
  query GetGallery($id: ID!) {
    fairuGallery(id: $id) { id name createdAt updatedAt description location date }
  }
`;

export const GALLERY_ITEMS = `
  query GalleryItems($id: ID!, $page: Int, $perPage: Int) {
    fairuGallery(id: $id) {
      name
      itemsPaginated(page: $page, first: $perPage) {
        data { id name mimeType size }
        paginatorInfo { ${PAGINATOR_FIELDS} }
      }
    }
  }
`;

// ─── Gallery Mutations ────────────────────────────────────

export const CREATE_GALLERY = `
  mutation CreateGallery($data: FairuGalleryDto!) {
    createFairuGallery(data: $data) { id name }
  }
`;

export const UPDATE_GALLERY = `
  mutation UpdateGallery($data: FairuGalleryDto!) {
    updateFairuGallery(data: $data) { id name }
  }
`;

export const DELETE_GALLERY = `
  mutation DeleteGallery($id: ID!) {
    deleteFairuGallery(id: $id)
  }
`;

export const SHARE_GALLERY = `
  mutation ShareGallery($id: ID!) {
    createFairuGalleryShareLink(id: $id)
  }
`;

// ─── Copyright Queries ────────────────────────────────────

export const LIST_COPYRIGHTS = `
  query ListCopyrights($page: Int, $perPage: Int) {
    fairuCopyrights(page: $page, first: $perPage) {
      data { id name createdAt }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_COPYRIGHT = `
  query GetCopyright($id: ID!) {
    fairuCopyright(id: $id) { id name createdAt updatedAt }
  }
`;

// ─── License Queries ──────────────────────────────────────

export const LIST_LICENSES = `
  query ListLicenses($page: Int, $perPage: Int) {
    fairuLicenses(page: $page, first: $perPage) {
      data { id name createdAt }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_LICENSE = `
  query GetLicense($id: ID!) {
    fairuLicense(id: $id) { id name createdAt updatedAt }
  }
`;

// ─── Tenant & Health ──────────────────────────────────────

export const HEALTH_CHECK = `
  query HealthCheck {
    fairuHealthCheck { status version }
  }
`;

export const TENANT_INFO = `
  query TenantInfo {
    fairuTenant { id name }
  }
`;

// ─── Copyright Mutations ────────────────────────────────

export const CREATE_COPYRIGHT = `
  mutation CreateCopyright($data: FairuCopyrightDto!) {
    createFairuCopyright(data: $data) { id name }
  }
`;

export const UPDATE_COPYRIGHT = `
  mutation UpdateCopyright($data: FairuCopyrightDto!) {
    updateFairuCopyright(data: $data) { id name }
  }
`;

export const DELETE_COPYRIGHT = `
  mutation DeleteCopyright($id: ID!, $deleteAssets: Boolean, $deleteLicenses: Boolean) {
    deleteFairuCopyright(id: $id, deleteAssets: $deleteAssets, deleteLicenses: $deleteLicenses)
  }
`;

// ─── License Mutations ──────────────────────────────────

export const CREATE_LICENSE = `
  mutation CreateLicense($data: FairuLicenseDto!) {
    createFairuLicense(data: $data) { id name }
  }
`;

export const UPDATE_LICENSE = `
  mutation UpdateLicense($data: FairuLicenseDto!) {
    updateFairuLicense(data: $data) { id name }
  }
`;

export const DELETE_LICENSE = `
  mutation DeleteLicense($id: ID!, $deleteAssets: Boolean) {
    deleteFairuLicense(id: $id, deleteAssets: $deleteAssets)
  }
`;

// ─── Asset Extra Queries ────────────────────────────────

export const ALL_FILES_FLAT = `
  query AllFilesFlat($cursor: String, $limit: Int) {
    fairuAllFilesFlat(cursor: $cursor, limit: $limit) { id name mimeType size createdAt }
  }
`;

export const MULTIPLE_FILES = `
  query MultipleFiles($ids: [ID!]!) {
    fairuMultipleFiles(ids: $ids) { id name mimeType size createdAt }
  }
`;

export const FILES_TOTAL_SIZE = `
  query FilesTotalSize($ids: [ID!]!) {
    fairuFilesTotalSize(ids: $ids)
  }
`;

export const FILE_URL_BY_PATH = `
  query FileUrlByPath($path: String!, $tenantId: ID!, $width: Int, $height: Int, $quality: Int, $version: String) {
    fairuFileUrlByPath(path: $path, tenantId: $tenantId, width: $width, height: $height, quality: $quality, version: $version)
  }
`;

// ─── Asset Extra Mutations ──────────────────────────────

export const GET_ASSET_BY_PATH = `
  query GetAssetByPath($path: String!) {
    fairuFileByPath(path: $path) { id name mime size alt caption description blocked createdAt: created_at updatedAt: updated_at }
  }
`;

export const REPLACE_ASSET = `
  mutation ReplaceAsset($id: ID!) {
    replaceFairuFile(id: $id) { id upload_url sync_url }
  }
`;

export const REDOWNLOAD_ASSET = `
  mutation RedownloadAsset($id: ID!) {
    redownloadFairuFile(id: $id)
  }
`;

// ─── Folder Extra Mutations ─────────────────────────────

export const CREATE_FOLDER_FTP = `
  mutation CreateFolderFTP($id: ID!) {
    createFairuFolderFTP(id: $id) { id name type }
  }
`;

export const CREATE_FOLDER_UPLOAD_SHARE = `
  mutation CreateFolderUploadShare($id: ID!, $name: String, $expires_in: FairuUploadShareLinkExpiration) {
    createFairuFolderUploadShareLink(id: $id, name: $name, expires_in: $expires_in) { id url name expires_at }
  }
`;

export const SUPPORTED_DOMAINS = `
  query SupportedDomains {
    fairuSupportedDomains
  }
`;

// ─── Tenant Mutations ───────────────────────────────────

export const CREATE_TENANT = `
  mutation CreateTenant($name: String!) {
    createFairuTenant(name: $name) { id name api_key created_at }
  }
`;

export const UPDATE_TENANT = `
  mutation UpdateTenant($name: String, $use_ai: Boolean, $use_ai_onupload: Boolean, $custom_domain: String, $force_file_alt: Boolean, $force_file_caption: Boolean, $force_file_description: Boolean, $force_file_policy: Boolean, $force_file_copyright: Boolean, $force_license: Boolean, $ai_blur_faces: Boolean, $ai_language: String, $ai_nsfw: Boolean, $avatar_id: ID, $block_files_with_error: Boolean, $hide_dotfiles: Boolean) {
    updateFairuTenant(name: $name, use_ai: $use_ai, use_ai_onupload: $use_ai_onupload, custom_domain: $custom_domain, force_file_alt: $force_file_alt, force_file_caption: $force_file_caption, force_file_description: $force_file_description, force_file_policy: $force_file_policy, force_file_copyright: $force_file_copyright, force_license: $force_license, ai_blur_faces: $ai_blur_faces, ai_language: $ai_language, ai_nsfw: $ai_nsfw, avatar_id: $avatar_id, block_files_with_error: $block_files_with_error, hide_dotfiles: $hide_dotfiles) { id name }
  }
`;

// ─── Disk Queries ───────────────────────────────────────

export const LIST_DISKS = `
  query ListDisks($page: Int, $perPage: Int) {
    fairuDisks(page: $page, perPage: $perPage) {
      data { id name type active healthy syncing createdAt: created_at }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_DISK = `
  query GetDisk($id: ID!) {
    fairuDisk(id: $id) { id name type active healthy syncing path pattern createdAt: created_at updatedAt: updated_at }
  }
`;

export const GET_DISK_STATUS = `
  query GetDiskStatus($id: ID!) {
    fairuDiskStatus(id: $id) { id syncing open pending synced failed }
  }
`;

// ─── Disk Mutations ─────────────────────────────────────

export const CREATE_DISK = `
  mutation CreateDisk($data: FairuDiskDto!) {
    createFairuDisk(data: $data) { id name type }
  }
`;

export const UPDATE_DISK = `
  mutation UpdateDisk($data: FairuDiskDto!) {
    updateFairuDisk(data: $data) { id name type }
  }
`;

export const DELETE_DISK = `
  mutation DeleteDisk($id: ID!) {
    deleteFairuDisk(id: $id)
  }
`;

// ─── DMCA Queries ───────────────────────────────────────

export const LIST_DMCAS = `
  query ListDmcas($page: Int, $perPage: Int) {
    fairuDmcas(page: $page, perPage: $perPage) {
      data { id name email status }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_DMCA = `
  query GetDmca($id: ID!) {
    fairuDmca(id: $id) { id name email status reply reply_send }
  }
`;

// ─── DMCA Mutations ─────────────────────────────────────

export const CREATE_DMCA = `
  mutation CreateDmca($data: FairuDmcaComplainDto!) {
    createFairuDmcaComplain(data: $data)
  }
`;

export const UPDATE_DMCA = `
  mutation UpdateDmca($data: FairuDmcaDto!) {
    updateFairuDmcaComplain(data: $data) { id name email status reply }
  }
`;

// ─── Role Queries ───────────────────────────────────────

export const LIST_ROLES = `
  query ListRoles($page: Int, $perPage: Int) {
    fairuRoles(page: $page, perPage: $perPage) {
      data { id name createdAt: created_at }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_ROLE = `
  query GetRole($id: ID!) {
    fairuRole(id: $id) { id name permissions createdAt: created_at updatedAt: updated_at }
  }
`;

// ─── Role Mutations ─────────────────────────────────────

export const CREATE_ROLE = `
  mutation CreateRole($data: FairuRoleDto!) {
    createFairuRole(data: $data) { id name }
  }
`;

export const UPDATE_ROLE = `
  mutation UpdateRole($data: FairuRoleDto!) {
    updateFairuRole(data: $data) { id name }
  }
`;

export const DELETE_ROLE = `
  mutation DeleteRole($id: ID!) {
    deleteFairuRole(id: $id)
  }
`;

// ─── User Queries ───────────────────────────────────────

export const LIST_USERS = `
  query ListUsers($page: Int, $perPage: Int) {
    fairuUsers(page: $page, perPage: $perPage) {
      data { id name email status owner }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_USER = `
  query GetUser($id: ID!) {
    fairuUser(id: $id) { id name email status owner }
  }
`;

// ─── User Mutations ─────────────────────────────────────

export const INVITE_USER = `
  mutation InviteUser($email: String!, $role: ID!) {
    inviteFairuUser(email: $email, role: $role)
  }
`;

export const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteFairuUser(id: $id)
  }
`;

// ─── Workflow Queries ───────────────────────────────────

export const LIST_WORKFLOWS = `
  query ListWorkflows($page: Int, $perPage: Int) {
    fairuWorkflows(page: $page, perPage: $perPage) {
      data { id name type active status createdAt: created_at }
      paginatorInfo { ${PAGINATOR_FIELDS} }
    }
  }
`;

export const GET_WORKFLOW = `
  query GetWorkflow($id: ID!) {
    fairuWorkflow(id: $id) { id name type active status has_error createdAt: created_at updatedAt: updated_at }
  }
`;

// ─── Workflow Mutations ─────────────────────────────────

export const CREATE_WORKFLOW = `
  mutation CreateWorkflow($data: FairuWorkflowDto!) {
    createFairuWorkflow(data: $data) { id name }
  }
`;

export const UPDATE_WORKFLOW = `
  mutation UpdateWorkflow($data: FairuWorkflowDto!) {
    updateFairuWorkflow(data: $data) { id name }
  }
`;

export const DELETE_WORKFLOW = `
  mutation DeleteWorkflow($id: ID!) {
    deleteFairuWorkflow(id: $id)
  }
`;

// ─── Credential Queries/Mutations ───────────────────────

export const LIST_CREDENTIALS = `
  query ListCredentials {
    fairuRakuCredentials { id name access_key_id bucket active permissions created_at expires_at }
  }
`;

export const CREATE_CREDENTIAL = `
  mutation CreateCredential($name: String, $bucket: String, $permissions: [String!]!) {
    createFairuRakuCredential(name: $name, bucket: $bucket, permissions: $permissions) { id name access_key_id secret_access_key bucket permissions }
  }
`;

export const REVOKE_CREDENTIAL = `
  mutation RevokeCredential($id: ID!) {
    revokeFairuRakuCredential(id: $id)
  }
`;

export const DELETE_CREDENTIAL = `
  mutation DeleteCredential($id: ID!) {
    deleteFairuRakuCredential(id: $id)
  }
`;

// ─── Signature Mutations ────────────────────────────────

export const CREATE_PDF_SIGNATURE = `
  mutation CreatePdfSignature($data: FairuFilePdfSignatureRequestDto!) {
    createFairuPdfSignatureRequest(data: $data) { id status config_url }
  }
`;

export const START_PDF_SIGNATURE = `
  mutation StartPdfSignature($id: ID!) {
    startFairuPdfSignatureRequest(id: $id) { id status }
  }
`;

export const CANCEL_PDF_SIGNATURE = `
  mutation CancelPdfSignature($id: ID!) {
    cancelFairuPdfSignatureRequest(id: $id)
  }
`;

export const CREATE_FILE_ACCESS_SIGNATURE = `
  mutation CreateFileAccessSignature($ids: [ID!]!, $valid_for_minutes: Int) {
    createFairuFileAccessSignature(ids: $ids, valid_for_minutes: $valid_for_minutes) { file_id signature expires_at }
  }
`;
