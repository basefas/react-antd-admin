export interface GroupListItem {
  id: number;
  name: string;
  role_id?: number;
  role_name?: string;
}

export interface GroupCreateInfo {
  name: string;
  role_id: number;
}

export interface GroupUpdateInfo {
  name?: string;
  role_id?: number;
}
